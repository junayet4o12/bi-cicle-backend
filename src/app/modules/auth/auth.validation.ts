import { z } from "zod";


const loginValidationSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'email is required' }).email({ message: 'Use a valid Email' }),
        password: z.string({ required_error: 'Password is required' })
    })
})
const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'Old password is required' }),
        newPassword: z.string({ required_error: 'New password is required' })
    })
})
const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({ required_error: 'Refresh Token is required!' })
    })
})
const forgetPasswordValidationSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'email is required' }).email({ message: 'Use a valid Email' }),
    })
})

const resetPasswordValidationSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'User email is required!' }).trim().email({ message: 'Use a valid Email' }),
        newPassword: z.string({ required_error: 'New Password is required!' }),
    })
});


export const AuthValidations = {
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema
}