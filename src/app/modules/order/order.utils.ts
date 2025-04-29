import httpStatus from 'http-status';
import { startSession, Types } from "mongoose";
import { IOrder } from "./order.interface";
import Product from "../product/product.model";
import Order from "./order.model";
import AppError from "../../errors/AppError";
type NewProducts = {
    price: number;
    product: Types.ObjectId;
    quantity: number;
    name: string;
}[]
export const createOrder = async (orderData: Omit<IOrder, 'transactionId'>, newProducts: NewProducts, tran_id?: string) => {
    const finalOrder: IOrder = {
        ...orderData,
        transactionId: tran_id || '',
        paidStatus: false
    }
    const session = await startSession();
    session.startTransaction();

    try {
        // Reduce product quantity
        for (const item of newProducts) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { quantity: -item.quantity } },
                { session }
            );
        }

        const order = new Order(finalOrder);
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