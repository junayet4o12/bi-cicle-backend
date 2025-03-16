import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";
import { order_status } from './order.const';
import { calculateTotalPrice } from "../../utils/calculateTotalPrice";

const productSchema = new Schema(
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
    },
    { _id: false }
);

const orderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
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
    },
    {
        timestamps: true,
    }
);

orderSchema.post('find', async function (docs) {
    for (const doc of docs) {
        // Calculate total price for each populated order
        doc.totalPrice = calculateTotalPrice(doc.products);
        await doc.save(); // Save the updated totalPrice
    }
});

orderSchema.post('findOne', async function (doc) {
    if (doc) {
        doc.totalPrice = calculateTotalPrice(doc.products);
        await doc.save();
    }
});

// Ensure `totalPrice` is recalculated after findOneAndUpdate, update, and updateMany
orderSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        doc.totalPrice = calculateTotalPrice(doc.products);
        await doc.save();
    }
});

const Order = model<IOrder>('Order', orderSchema);

export default Order;
