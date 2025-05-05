import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { SubscribeService } from './subscribe.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const createSubscribe = catchAsync(async (req: Request, res: Response) => {
  const subscribeData = req.body;
  const result = await SubscribeService.createSubscribeIntoDB(subscribeData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Subscription created successfully',
    data: result,
  });
});

const getAllSubscribes = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
  const result = await SubscribeService.getAllSubscribesFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscriptions retrieved successfully',
    data: result,
  });
});

const getSingleSubscribe = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await SubscribeService.getSingleSubscribeFromDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription retrieved successfully',
    data: result,
  });
});

const deleteSubscribe = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  await SubscribeService.deleteSubscribeFromDB(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription deleted successfully',
    data: {},
  });
});

const updateSubscribeStatus = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const { isBlock } = req.body;
  const result = await SubscribeService.updateSubscribeStatusInDB({ email, isBlock });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Subscription ${isBlock ? 'blocked' : 'unblocked'} successfully`,
    data: result,
  });
});

export const SubscribeControllers = {
  createSubscribe,
  getAllSubscribes,
  getSingleSubscribe,
  deleteSubscribe,
  updateSubscribeStatus,
};
