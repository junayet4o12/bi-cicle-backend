import httpStatus from 'http-status';
import { Request, Response } from "express";
import { OrderServices } from "./order.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from '../../utils/catchAsync';

const checkout = catchAsync(async (req: Request, res: Response) => {
    const orderData = req.body; 
    await OrderServices.checkout(orderData, res);
    
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
const getSingleOrderByTranId = catchAsync(async (req: Request, res: Response) => {
    const { tranId } = req.params;
    const result = await OrderServices.getSingleOrderByTranIdFromDB(tranId);
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
    getAllOrders,
    getSingleOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    getMyOrders,
    checkout,
    getSingleOrderByTranId
};
