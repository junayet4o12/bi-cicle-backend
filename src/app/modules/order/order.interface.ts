import { Model, Types } from 'mongoose';
import { order_status } from './order.const';
type TOrderStatus = keyof typeof order_status
export interface IOrderedProduct {
    product: Types.ObjectId;
    quantity: number;
}
export interface IOrder {
    userId: Types.ObjectId;
    products: IOrderedProduct[];
    status?: TOrderStatus;
    payment: number;
    address: string;
}