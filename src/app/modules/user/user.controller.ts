import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { AuthServices } from '../auth/auth.service';
import config from '../../config';

const createUser = catchAsync(async (req, res) => {
    const data = req.body
    const user = await UserServices.createUserIntoDB(data);
    const loginData = {
        email: data.email,
        password: data.password

    }
    const result = await AuthServices.loginUser(loginData);
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
        message: 'User is created and logged in successfully',
        data: {
            accessToken,
            data: user
        }
    })
})

const getAllUsers = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUserFromDB(req.query);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Students data has fetched!", data: result.result, meta: result.meta });
})
const getSingleUsers = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUserFromDB(id);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Student data has fetched!", data: result });
})
const getMe = catchAsync(async (req, res) => {
    const { email, role } = req.user;
    const queryData = { email, role }
    const result = await UserServices.getMeFromDB(queryData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "My data has fetched!", data: result });
})
const updateSingleUser = catchAsync(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const result = await UserServices.updateSingleUserFromDB(id, data);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "User Data has updated", data: result });
})
const updateByData = catchAsync(async (req, res) => {
    const { email, role } = req.user;
    const queryData = { email, role }
    const data = req.body
    const result = await UserServices.updateMyDataIntoDB(queryData, data);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "My data has updated!", data: result });
})
const toggleUserState = catchAsync(async (req, res) => {
    const { email, role } = req.user
    const queryData = { email, role }
    const id = req.params.id;
    const result = await UserServices.toggleUserStatus(id, queryData);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "User status has toggled!", data: result });
})





export const UserControllers = {
    createUser,
    getAllUsers,
    getSingleUsers,
    getMe,
    updateSingleUser,
    updateByData,
    toggleUserState
}