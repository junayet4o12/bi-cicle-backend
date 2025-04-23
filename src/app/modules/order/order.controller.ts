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
        message: "Order has been created successfully",
        data: result,
    });
});

const calculateTotalRevenue = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderServices.calculateRevenueFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Revenue calculated successfully",
        data: result,
    });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await OrderServices.getAllOrdersFromDB(query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: result.result,
        meta: result.meta,
    });
});
const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const { email } = req.user
    const result = await OrderServices.getMyOrdersFromDB(email, query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: result.result,
        meta: result.meta,
    });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const result = await OrderServices.getSingleOrderFromDB(orderId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order retrieved successfully",
        data: result,
    });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const data = req.body;
    const result = await OrderServices.updateOrderIntoDB(orderId, data);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order updated successfully",
        data: result,
    });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const result = await OrderServices.updateOrderStatus(orderId, { status });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Order status updated to ${status}`,
        data: result,
    });
});
const deleteOrder = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    await OrderServices.deleteOrderFromDB(orderId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Order deleted successfully!`,
        data: {},
    });
});


export const OrderControllers = {
    createOrder,
    calculateTotalRevenue,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    getMyOrders
};
