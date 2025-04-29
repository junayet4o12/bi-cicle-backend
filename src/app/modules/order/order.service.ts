import { IProduct } from './../product/product.interface';
import httpStatus from 'http-status';
import AppError from "../../errors/AppError";
import Product from "../product/product.model";
import { IOrder, TOrderStatus } from "./order.interface";
import Order from "./order.model";
import { startSession } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import config from '../../config';
import SSLCommerzPayment from "sslcommerz-lts";
import { Response, Router } from 'express';
import sendResponse from '../../utils/sendResponse';
import { checkoutData } from '../../utils/checkoutData';
import { createOrder } from './order.utils';
const store_id = config.ssl_store_id
const store_passwd = config.ssl_secret_key
const checkout = async (orderData: Omit<IOrder, 'transactionId'>, res: Response) => {

    const productsId = orderData.products.map(item => item.product);
    const productsData = await Product.find({ _id: { $in: productsId } });

    const newProducts = orderData.products
        .filter(item => productsData.some(p => p._id.toString() === item.product.toString()))
        .map(item => {
            const product = productsData.find(p => p._id.toString() === item.product.toString()) as IProduct;

            if (product.quantity < item.quantity) {
                throw new AppError(httpStatus.BAD_REQUEST, `${product.name} is not available for ${item.quantity}. Available: ${product.quantity} pieces!`);
            }

            return { ...item, price: product.price };
        });

    if (newProducts.length < 1) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Products not available!');
    }

    orderData.products = newProducts;
    orderData.status = 'PENDING';
    const totalPrice = newProducts.reduce((sum, item) => sum + (item.quantity * item.price), 0);




    if (orderData.paymentMethod === 'Cash On Delivery') {
        const result = await createOrder(orderData, newProducts);
        

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Order has Created.",
            data: result,
        });
        return
    }

    const data = checkoutData({
        totalPrice, name: orderData.name, address: orderData.address, email: orderData
            ?.email || ''
    })

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, false);
    sslcz.init(data)
        .then(async (apiResponse: any) => {
            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "checkout url has sent",
                data: apiResponse.GatewayPageURL,
            });
            const result = await createOrder(orderData, newProducts, data.tran_id)
            return result
        })
        .catch(() => {
            throw new AppError(httpStatus.BAD_GATEWAY, 'Payment initialization failed.')
        });
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
const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
    const orderQuery = new QueryBuilder(Order.find(), query).fields().filter().paginate().sort().search(['email', 'contact', 'name', 'address']);
    const result = await orderQuery.modelQuery.populate('products.product');
    const meta = await orderQuery.countTotal();
    return {
        result,
        meta
    }
}
const getMyOrdersFromDB = async (email: string, query: Record<string, unknown>) => {
    const orderQuery = new QueryBuilder(Order.find({ email: email }), query).fields().filter().paginate().sort().search(['email', 'contact', 'name', 'address']);
    const result = await orderQuery.modelQuery.populate('products.product');
    const meta = await orderQuery.countTotal();
    return {
        result,
        meta
    }
}

const getSingleOrderFromDB = async (id: string) => {
    const result = await Order.findById(id).populate('products.product');
    return result
}
const getSingleOrderByTranIdFromDB = async (tranId: string) => {
    const result = await Order.findOne({ transactionId: tranId }).populate('products.product');
    return result
}

const updateOrderIntoDB = async (id: string, payload: Partial<Pick<IOrder, 'address' | 'payment'>>) => {
    const result = await Order.findByIdAndUpdate(id, payload, { new: true });
    return result
}
const updateOrderStatus = async (id: string, payload: { status: TOrderStatus }) => {
    const result = await Order.findByIdAndUpdate(id, payload, { new: true });
    return result
}

const deleteOrderFromDB = async (id: string) => {
    const orderData = await Order.findById(id);

    if (!orderData) {
        throw new AppError(httpStatus.NOT_FOUND, 'Order not found!')
    }

    const products = orderData.products;
    const session = await startSession();
    session.startTransaction();
    try {
        for (let item of products) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { quantity: item.quantity }
            }, { session })
        }
        await Order.findByIdAndDelete(id, { session })
        await session.commitTransaction();
        session.endSession();

    } catch (error: any) {
        // Rollback transaction if anything fails
        await session.abortTransaction();
        session.endSession();
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Order creation failed: ${error.message}`);
    }
}

export const OrderServices = {
    calculateRevenueFromDB,
    getAllOrdersFromDB,
    getSingleOrderFromDB,
    updateOrderIntoDB,
    updateOrderStatus,
    deleteOrderFromDB,
    getMyOrdersFromDB,
    checkout,
    getSingleOrderByTranIdFromDB
}