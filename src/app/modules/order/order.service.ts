import httpStatus from 'http-status';
import AppError from "../../errors/AppError";
import Product from "../product/product.model";
import { IOrder } from "./order.interface";
import Order from "./order.model";
import mongoose, { startSession, Types } from 'mongoose';

const createOrderIntoDB = async (orderData: IOrder) => {
    const products = orderData.products
    const productsId = products.map(item => item.product);
    const productsData = await Product.find({ _id: { $in: productsId } });

    // checked product existing  
    const newProducts = products.filter(item => {
        const isProductExist = productsData.find(data => data._id.toString() === item.product.toString());
        return isProductExist ? true : false
    })
    if (newProducts.length < 1) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Products not available!')
    }

    // checking isAll Product is in Stock 
    newProducts.forEach(item => {
        const productFullData = productsData.find(data => data._id.toString() === item.product.toString());
        if (productFullData?.quantity as number < item.quantity) {
            throw new AppError(httpStatus.BAD_REQUEST, `${productFullData?.name} is not available for ${item.quantity}. Available: ${productFullData?.quantity} pieces!`)
        }
        return item
    });
    let totalPrice = 0;
    newProducts.forEach(item => {
        const productFullData = productsData.find(data => data._id.toString() === item.product.toString());
        totalPrice = totalPrice + (item.quantity * (productFullData?.price || 0) as number);
        return item
    });
    if (totalPrice > orderData.payment) {
        throw new AppError(httpStatus.BAD_REQUEST, `Total price: ${totalPrice} BDT. Received: ${orderData.payment}BDT. Short: ${totalPrice - orderData.payment} BDT`)
    }
    orderData.products = newProducts;
    orderData.status = 'PENDING';

    const session = await startSession();
    session.startTransaction();

    try {
        // Reduce product quantity
        for (const item of newProducts) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { quantity: -item.quantity } }
                , // Reduce quantity
                { session }
            );
        }

        // Create the order
        const order = new Order(orderData);
        const result = await Order.create([order], { session })
        if (!result.length) {
            throw new AppError(httpStatus.BAD_REQUEST, `Order not created!`);
        }
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return result[0];
    } catch (error: any) {
        // Rollback transaction if anything fails
        await session.abortTransaction();
        session.endSession();
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Order creation failed: ${error.message}`);
    }
}
const calculateRevenueFromDB = async () => {
    const result = await Order.aggregate([
        
        {
            $unwind: '$products'
        },
        {
            $addFields: { productDetails: { $toObjectId: '$products.product' } }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productDetails',
                foreignField: '_id',
                as: 'productDetails',
            }
        },
        { $unwind: '$productDetails' },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: { $multiply: ['$products.quantity', '$productDetails.price'] }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1
            }
        }


    ])

    return result[0]
}
export const OrderServices = {
    createOrderIntoDB,
    calculateRevenueFromDB
}