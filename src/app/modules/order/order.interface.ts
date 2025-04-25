import {  Types } from 'mongoose';
import { order_status } from './order.const';
export type TOrderStatus = keyof typeof order_status
export interface IOrderedProduct {
    product: Types.ObjectId;
    quantity: number;
    name: string;
    price: number;
}
export interface IOrder {
    products: IOrderedProduct[];
    status?: TOrderStatus;
    payment: number;
    address: string;
    name: string;
    email?: string;
    contact: string;
    transactionId: string;
    paidStatus: boolean;
}