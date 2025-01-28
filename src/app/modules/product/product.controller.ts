import { Request, Response } from "express";
import { ProductServices } from "./product.service";
import productValidationSchema from "./product.validation";

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const result = await ProductServices.getAllProductsFromDB();
        if (result && result.length > 0) {
            res.status(200).json({
                status: true,
                message: "Bicycles retrieved successfully",
                data: result,
            });
        } else {
            res.status(404).json({
                status: false,
                message: "No products found",
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
};

const createProduct = async (req: Request, res: Response) => {
    try {
        const productData = req.body;
        const parseData = productValidationSchema.parse(productData);
        const result = await ProductServices.createProductsIntoDB(parseData);
        if (result) {
            res.status(200).json({
                success: true,
                message: "Bicycle created successfully",
                data: result,
            });
        } else {
            res.status(400).json({
                status: false,
                message: "Failed to create bicycle",
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
};

const getSingleProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;
        const result = await ProductServices.getSingleProductFromDB(productId);
        if (result) {
            res.status(200).json({
                status: true,
                message: "Bicycle retrieved successfully",
                data: result,
            });
        } else {
            res.status(404).json({
                status: false,
                message: "Product not found",
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
};

const updateSingleProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const data = req.body;
        const { isDeleted, ...filteredData } = data;
        const partialProductValidationSchema = productValidationSchema.partial();
        const validatedData = partialProductValidationSchema.parse(filteredData);
        const result = await ProductServices.updateSingleProductOfDB({
            productId,
            data: validatedData,
        });
        if (result) {
            res.status(200).json({
                status: true,
                message: "Bicycle updated successfully",
                data: result,
            });
        } else {
            res.status(404).json({
                status: false,
                message: "No product found to update",
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
};

const deleteSingleProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const result = await ProductServices.deleteSingleProductFromDB(productId);
        if (result) {
            res.status(200).json({
                status: true,
                message: "Bicycle deleted successfully",
                data: {},
            });
        } else {
            res.status(404).json({
                status: false,
                message: "No product found to delete",
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
};

export const ProductControllers = {
    getAllProducts,
    createProduct,
    getSingleProduct,
    updateSingleProduct,
    deleteSingleProduct,
};
