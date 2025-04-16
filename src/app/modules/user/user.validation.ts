import { z } from "zod";

const createUserValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'User name is required!' }).trim(),
        email: z.string({ required_error: 'User email is required!' }).trim().email({ message: 'Use a valid Email' }),
        password: z.string({ required_error: 'Password is required!' }),
        profile: z.string().url({ message: 'Profile must be a valid url!' }).optional(),
        address: z.string().optional(),
        contactNumber: z.string({ required_error: 'Contact number is required!' }),
        isBlock: z.boolean().default(false).optional(),
    })
})
const updateUserValidationSchema = z.object({
    body: z.object({
        name: z.string().trim(),
        profile: z.string().url({ message: 'Profile must be a valid url!' }) .or(z.literal('')).optional(),
        address: z.string().optional(),
        contactNumber: z.string().optional(),
    })
        .partial()
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        })
})



export const UserValidations = {
    createUserValidationSchema,
    updateUserValidationSchema,
}