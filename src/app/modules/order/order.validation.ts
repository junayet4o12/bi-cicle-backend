import { z } from 'zod';
import { order_status } from './order.const';

const createOrderValidationSchema = z.object({
    body: z.object({
        products: z.array(
            z.object({
                product: z.string().length(24, "Product ID must be a valid MongoDB ObjectId"), // Assuming product is also a MongoDB ObjectId
                quantity: z.number().min(1, 'Quantity must be at least 1'),
            })
        ).nonempty('At least one product must be provided'),
        status: z.enum(Object.keys(order_status) as [keyof typeof order_status], {
            invalid_type_error: `Status must be one of ${Object.keys(order_status).join(', ')}`,
        }).default('PENDING').optional(),
        payment: z.number().min(0, 'Payment amount cannot be negative'),
        address: z.string().trim().min(5, 'Address must be at least 5 characters long'),
    }),
});

const updateOrderValidationSchema = z.object({
    body: z.object({
        payment: z.number().min(0, 'Payment amount cannot be negative').optional(),
        address: z.string().trim().min(5, 'Address must be at least 5 characters long').optional(),
    })
        .partial()
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        })
});

const changeStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(Object.keys(order_status) as [keyof typeof order_status], {
            invalid_type_error: `Status must be one of ${Object.keys(order_status).join(', ')}`,
        }),
    }),
});

export const OrderValidations = {
    createOrderValidationSchema,
    updateOrderValidationSchema,
    changeStatusValidationSchema
};