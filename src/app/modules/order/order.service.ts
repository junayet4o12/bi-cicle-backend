import { IOrder } from "./order.interface";
import Order from "./order.model";

const createOrderIntoDB = async (orderData: IOrder) => {
    const result = Order.create(orderData);
    return result;
}
const calculateRevenueFromDB = async () => {
    const result = await Order.aggregate([
        {
            $addFields: { product: { $toObjectId: '$product' } }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productDetails',
            }
        },
        { $unwind: '$productDetails' },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: { $multiply: ['$quantity', '$productDetails.price'] }
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

    return result
}
export const orderServices = {
    createOrderIntoDB,
    calculateRevenueFromDB
}