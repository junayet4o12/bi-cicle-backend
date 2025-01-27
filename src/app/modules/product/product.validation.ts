import { z } from 'zod';

const productValidationSchema = z.object({
    name: z.string({ required_error: "Name is required" }).trim().max(100, "Name must not exceed 100 characters"),
    brand: z.string({ required_error: "Brand is required" }).trim().max(50, "Brand must not exceed 50 characters"),
    price: z.number({ required_error: "Price is required" }).min(0, "Price must be a positive value"),
    type: z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
        required_error: "Type is required",
        invalid_type_error: "Type must be one of Mountain, Road, Hybrid, BMX, or Electric",
    }),
    description: z.string({ required_error: "Description is required" }).max(500, "Description must not exceed 500 characters"),
    quantity: z.number({ required_error: "Quantity is required" }).min(0, "Quantity must be a non-negative number"),
    isStock: z.boolean({ required_error: "Stock status is required" }).default(true),
});
export default productValidationSchema