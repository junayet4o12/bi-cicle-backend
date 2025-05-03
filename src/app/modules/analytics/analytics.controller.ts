import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from 'express';
import { AnalyticsServices } from './analytics.service';

// 1. Analyze Orders
const analyzeOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await AnalyticsServices.analyzeOrders();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Analyzed data has been generated successfully",
        data: result,
    });
});

// 2. Get Last Month Users
const getLast12MonthUsersData = catchAsync(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query; // You can optionally pass startDate and endDate via query params
    const result = await AnalyticsServices.getLast12MonthUsersData();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Over Year users data retrieved successfully",
        data: result,
    });
});

// 3. Get Top 10 Products
const getTopTenProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await AnalyticsServices.getTopTenProducts();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Top 10 products retrieved successfully",
        data: result,
    });
});

export const AnalyticsControllers = {
    analyzeOrders,
    getLast12MonthUsersData,
    getTopTenProducts
};
