import httpStatus from 'http-status';
import { Request, Response } from "express";
import { OrderServices } from "./order.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from '../../utils/catchAsync';

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const orderData = req.body;
    const result = await OrderServices.createOrderIntoDB(orderData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order has created",
        data: result,
    });
})
const calculateTotalRevenue = async (req: Request, res: Response) => {
    try {
        const result = await OrderServices.calculateRevenueFromDB();
        res.status(200).json({
            status: true,
            message: 'Revenue calculated successfully',
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
}

export const OrderControllers = {
    createOrder,
    calculateTotalRevenue
};