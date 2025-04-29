import { z } from 'zod';
import { order_status, paymentMethod } from './order.const';

const checkoutValidationSchema = z.object({
    body: z.object({
        products: z.array(
            z.object({
                product: z.string().length(24, "Product ID must be a valid MongoDB ObjectId"), // Assuming product is also a MongoDB ObjectId
                quantity: z.number().min(1, 'Quantity must be at least 1'),
                name: z.string({ required_error: 'Name is Required!' }),
            })
        ).nonempty('At least one product must be provided'),
        status: z.enum(Object.keys(order_status) as [keyof typeof order_status], {
            invalid_type_error: `Status must be one of ${Object.keys(order_status).join(', ')}`,
        }).default('PENDING').optional(),
        payment: z.number().min(0, 'Payment amount cannot be negative'),
        address: z.string().trim().min(5, 'Address must be at least 5 characters long'),
        name: z.string({ required_error: 'Name is Required!' }),
        paymentMethod: z.enum(paymentMethod, {
            invalid_type_error: "Payment method must be one of Cash on Delivery or Online Payment",
        }),
        email: z
            .string()
            .email({ message: "Please enter a valid email address" })
            .or(z.literal(""))
            .optional(),
        contact: z.string({ required_error: 'Contact is Required' }),
    }),
});

const updateOrderValidationSchema = z.object({
    body: z.object({
        payment: z.number().min(0, 'Payment amount cannot be negative').optional(),
        address: z.string().trim().min(5, 'Address must be at least 5 characters long').optional(),
        name: z.string().optional(),
        email: z
            .string()
            .email({ message: "Please enter a valid email address" })
            .or(z.literal(""))
            .optional(),
        contact: z.string().optional()
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
    updateOrderValidationSchema,
    changeStatusValidationSchema,
    checkoutValidationSchema
};