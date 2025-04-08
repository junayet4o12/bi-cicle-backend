import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 * 365
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in successfully',
        data: {
            accessToken,
        }
    })
})
const changePassword = catchAsync(async (req, res) => {
    const user = req.user;

    const passwordData = req.body;
    const result = await AuthServices.changePassword(user, passwordData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password has changed successfully',
        data: result
    })

})

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken: theRefreshToken } = req.cookies
    const result = await AuthServices.refreshToken(theRefreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access is retrieved successfully',
        data: result
    })
})

const forgetPassword = catchAsync(async (req, res) => {
    const email = req.body.email
    const result = await AuthServices.forgetPassword(email);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reset link is generated successfully!',
        data: result
    })
})
const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization as string
    
    const result = await AuthServices.resetPassword(req.body, token);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password reset successfully',
        data: result
    })
})



export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
} 