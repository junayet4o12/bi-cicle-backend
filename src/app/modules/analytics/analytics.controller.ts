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

// 2. Get Last 12 Months Analytics Data (Users + Orders + Revenue)
const getLast12MonthsAnalyticsData = catchAsync(async (req: Request, res: Response) => {
    const result = await AnalyticsServices.getLast12MonthsAnalyticsData();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Last 12 months analytics data retrieved successfully",
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
    getLast12MonthsAnalyticsData,
    getTopTenProducts
};
