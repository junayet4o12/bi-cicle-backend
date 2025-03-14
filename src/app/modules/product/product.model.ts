import mongoose from 'mongoose';
import { IProduct } from './product.interface';
import { categories, frameMaterials } from './product.const';

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        trim: true,
        required: true
    },
    brand: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: categories,
        required: true
    },
    frameMaterial: {
        type: String,
        enum: frameMaterials,
        required: true
    },
    wheelSize: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        validate: {
            validator: (value: string[]) => value.length > 0,
            message: "At least one image is required."
        },
        required: true
    },
    specifications: [
        {
            key: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Automatically set `isStock` based on quantity
productSchema.virtual('isStock').get(function (this: IProduct) {
    return this.quantity > 0;
});

// Middleware to exclude deleted products from queries
productSchema.pre("find", function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
});

productSchema.pre("findOne", function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
});

productSchema.pre("findOneAndUpdate", function (next) {
    this.where({ isDeleted: { $ne: true } });
    next();
});

productSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
