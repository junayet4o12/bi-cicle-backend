import { Request, Response } from "express";
import { ProductServices } from "./product.service";
import productValidationSchema from "./product.validation";

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const result = await ProductServices.getAllProductsFromDB();
        res.status(200).json({
            status: true,
            message: 'Bicycles retrieved successfully',
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message || "Something went wrong",
            error: error
        })
    }
}

const createProduct = async (req: Request, res: Response) => {
    try {
        const productData = req.body;
        const parseData = productValidationSchema.parse(productData);
        const result = await ProductServices.createProductsIntoDB(parseData);
        res.status(200).json({
            success: true,
            message: 'Bicycle created successfully',
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message || "Something went wrong",
            error: error
        })
    }
}
const getSingleProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;
        const result = await ProductServices.getSingleProductFromDB(productId);
        res.status(200).json({
            status: true,
            message: 'Bicycles retrieved successfully',
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message || "Something went wrong",
            error: error
        })
    }
}
const updateSingleProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const data = req.body;
        const partialProductValidationSchema = productValidationSchema.partial();
        const validatedData = partialProductValidationSchema.parse(data);
        const result = await ProductServices.updateSingleProductOfDB({ productId, data: validatedData })
        res.status(200).json({
            status: true,
            message: 'Bicycle updated successfully',
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message || "Something went wrong",
            error: error
        })
    }
}
export const ProductControllers = {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateSingleProduct
}