import { Request, Response } from "express";
import { ProductServices } from "./product.service";
import productValidationSchema from "./product.validation";
import { IProduct } from "./product.interface";

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const result = await ProductServices.getAllProductsFromDB();
        returnRes(res, result, 'Bicycles retrieved successfully')
    } catch (error) {
        returnErr(res, error)
    }
}

const createProduct = async (req: Request, res: Response) => {
    try {
        const productData = req.body;
        const parseData = productValidationSchema.parse(productData);
        const result = await ProductServices.createProductsIntoDB(parseData);
        returnRes(res, result, 'Bicycle created successfully')
    } catch (error) {
        returnErr(res, error)
    }
}
export const ProductControllers = {
    getAllProducts,
    createProduct
}


const returnErr = (res: Response, error: any) => {
    return res.status(500).json({
        status: false,
        message: error.message || "Something went wrong",
        error: error
    })
}

const returnRes = (res: Response, result: any, message: string) => {
    return res.status(200).json({
        status: true,
        message,
        data: result
    })
}