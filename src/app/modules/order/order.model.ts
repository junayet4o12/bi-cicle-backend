import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true
        },
        product: {
            type: String,
            required: [true, 'Product identifier is required'],
            trim: true
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },
        totalPrice: {
            type: Number,
            required: [true, 'Total price is required'],
            min: [0, 'Total price cannot be negative']
        }
    },
    {
        timestamps: true
    }
);
const Order = model<IOrder>('Order', orderSchema);

export default Order;