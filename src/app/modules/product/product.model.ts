import mongoose from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        trim: true,
        required: [true, "Product name is required."]
    },
    brand: {
        type: String,
        trim: true,
        required: [true, "Brand is required."]
    },
    price: {
        type: Number,
        required: [true, "Price is required."]
    },
    type: {
        type: String,
        enum: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'],
        required: [true, "Product type is required."]
    },
    description: {
        type: String,
        required: [true, "Description is required."]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required."]
    },
    isStock: {
        type: Boolean,
        required: [true, "Stock status is required."],
        default: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
