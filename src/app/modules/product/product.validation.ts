import { z } from 'zod';

const createProductValidationSchema = z.object({
    name: z.string().trim().max(100, "Name must not exceed 100 characters"),
    brand: z.string().trim().max(50, "Brand must not exceed 50 characters"),
    price: z.number().min(0, "Price must be a positive value"),
    category: z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
        invalid_type_error: "Category must be one of Mountain, Road, Hybrid, BMX, or Electric",
    }),
    frameMaterial: z.enum(['Aluminum', 'Carbon', 'Steel', 'Titanium'], {
        invalid_type_error: "Frame material must be one of Aluminum, Carbon, Steel, or Titanium",
    }),
    wheelSize: z.number(),
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
});

export const ProductValidations = {
    createProductValidationSchema
};
