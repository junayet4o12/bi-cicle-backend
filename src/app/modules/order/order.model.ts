import { model, Schema } from "mongoose";
import { IOrder, IOrderedProduct } from "./order.interface";
import { order_status } from './order.const';
import { calculateTotalPrice } from "../../utils/calculateTotalPrice";

const productSchema = new Schema<IOrderedProduct>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            min: [1, 'Quantity must be at least 1'],
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const orderSchema = new Schema<IOrder>(
    {
        products: {
            type: [productSchema],
            validate: {
                validator: (value: any[]) => value.length > 0,
                message: 'At least one product must be provided',
            },
        },
        status: {
            type: String,
            enum: Object.keys(order_status),
        },
        payment: {
            type: Number,
            min: [0, 'Payment amount cannot be negative'],
            required: true
        },
        address: {
            type: String,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        contact: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

orderSchema.virtual('totalPrice').get(function (this: IOrder) {
    return calculateTotalPrice(this.products);
});

const Order = model<IOrder>('Order', orderSchema);

export default Order;
