import httpStatus from 'http-status';
import { Request, Response } from "express";
import { ProductServices } from "./product.service";
import sendResponse from "../../utils/sendResponse";

const getAllProducts = async (req: Request, res: Response) => {
    const query = req.query
    const result = await ProductServices.getAllProductsFromDB(query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bicycles retrieved successfully",
        data: result.result,
        meta: result.meta
    });
};

const createProduct = async (req: Request, res: Response) => {
    const productData = req.body;
    const result = await ProductServices.createProductsIntoDB(productData);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Product created successfully",
        data: result
    });
};

const getSingleProduct = async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const result = await ProductServices.getSingleProductFromDB(productId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bicycle retrieved successfully",
        data: result
    });
};

const updateSingleProduct = async (req: Request, res: Response) => {
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
};

const deleteSingleProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;
    await ProductServices.deleteSingleProductFromDB(productId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Bicycle deleted successfully",
        data: {}
    });
};

export const ProductControllers = {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateSingleProduct,
    deleteSingleProduct,
};
