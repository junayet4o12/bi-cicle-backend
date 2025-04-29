import httpStatus from 'http-status';
import { Request, Response } from "express";
import { ProductServices } from "./product.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from '../../utils/catchAsync';

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await ProductServices.getAllProductsFromDB(query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bicycles retrieved successfully",
        data: result.result,
        meta: result.meta
    });
})

const createProduct = catchAsync(async (req: Request, res: Response) => {
    const productData = req.body;
    const result = await ProductServices.createProductsIntoDB(productData);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Product created successfully",
        data: result
    });
})

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const query = req.query
    const result = await ProductServices.getSingleProductFromDB(productId,query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bicycle retrieved successfully",
        data: result
    });
});

const updateSingleProduct = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const data = req.body;
    const { isDeleted, ...filteredData } = data;
    const result = await ProductServices.updateSingleProductOfDB({
        productId,
        data: filteredData
    });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bicycle updated successfully",
        data: result
    });
});

const deleteSingleProduct = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    await ProductServices.deleteSingleProductFromDB(productId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bicycle deleted successfully",
        data: {}
    });
});

export const ProductControllers = {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateSingleProduct,
    deleteSingleProduct,
};
