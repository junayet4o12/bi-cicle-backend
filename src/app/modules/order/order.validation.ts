import { z } from "zod";

const orderValidationSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string"
        })
            .trim()
            .min(1, { message: "Email cannot be empty" })
            .email({ message: "Invalid email format" })
            .toLowerCase(),

        product: z.string({
            required_error: "Product identifier is required",
            invalid_type_error: "Product identifier must be a string"
        })
            .trim()
            .min(1, { message: "Product identifier cannot be empty" })
            .max(100, { message: "Product identifier is too long" }),

        quantity: z.number({
            required_error: "Quantity is required",
            invalid_type_error: "Quantity must be a number"
        })
            .int({ message: "Quantity must be a whole number" })
            .positive({ message: "Quantity must be positive" })
            .default(1),

        totalPrice: z.number({
            invalid_type_error: "Total price must be a number"
        })
            .positive({ message: "Total price must be positive" })
            .transform(val => Number(val.toFixed(2)))
            .optional()
    })
});

// Type inference from the schema

export default orderValidationSchema;