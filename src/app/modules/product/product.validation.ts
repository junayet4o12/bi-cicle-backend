import { z } from 'zod';
import { categories, frameMaterials } from './product.const';

const createProductValidationSchema = z.object({
    body: z.object({
        name: z.string().trim().max(100, "Name must not exceed 100 characters"),
        brand: z.string().trim().max(50, "Brand must not exceed 50 characters"),
        price: z.number().min(0, "Price must be a positive value"),
        category: z.enum(categories, {
            invalid_type_error: "Category must be one of Mountain, Road, Hybrid, BMX, or Electric",
        }),
        frameMaterial: z.enum(frameMaterials, {
            invalid_type_error: "Frame material must be one of Aluminum, Carbon, Steel, or Titanium",
        }),
        wheelSize: z.number().min(10, 'Wheel Size must be minimum 10').max(29, 'Wheel Size must be maximum 29'),
        quantity: z.number().min(0, "Quantity must be a non-negative number"),
        description: z.string().max(500, "Description must not exceed 500 characters"),
        images: z.array(z.string()).min(1, "At least one image is required."),
        specifications: z.array(
            z.object({
                key: z.string(),
                value: z.string(),
            })
        ),
        isDeleted: z.boolean().default(false).optional(),
    })
});
const updateProductValidationSchema = z.object({
    body: z.object({
        name: z.string().trim().max(100, "Name must not exceed 100 characters").optional(),
        brand: z.string().trim().max(50, "Brand must not exceed 50 characters").optional(),
        price: z.number().min(0, "Price must be a positive value").optional(),
        category: z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
            invalid_type_error: "Category must be one of Mountain, Road, Hybrid, BMX, or Electric",
        }).optional(),
        frameMaterial: z.enum(['Aluminum', 'Carbon', 'Steel', 'Titanium'], {
            invalid_type_error: "Frame material must be one of Aluminum, Carbon, Steel, or Titanium",
        }).optional(),
        wheelSize: z.number().min(10, 'Wheel Size must be minimum 10').max(29, 'Wheel Size must be maximum 29').optional(),
        quantity: z.number().min(0, "Quantity must be a non-negative number").optional(),
        description: z.string().max(500, "Description must not exceed 500 characters").optional(),
        images: z.array(z.string()).min(1, "At least one image is required.").optional(),
        specifications: z.array(
            z.object({
                key: z.string(),
                value: z.string(),
            })
        ).optional(),
        isDeleted: z.boolean().default(false).optional(),
    })
        .partial()
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        })
});

export const ProductValidations = {
    createProductValidationSchema,
    updateProductValidationSchema
};
