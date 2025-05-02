import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from 'express';
import { AnalyticsServices } from './analytics.service';

const calculateTotalRevenue = catchAsync(async (req: Request, res: Response) => {
    const result = await AnalyticsServices.calculateRevenueFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Revenue calculated successfully",
        data: result,
    });
});

export const AnalyticsControllers = {
    calculateTotalRevenue,

}