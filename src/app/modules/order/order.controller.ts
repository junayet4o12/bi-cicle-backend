import { Request, Response } from "express";
import { orderServices } from "./order.service";
import Product from "../product/product.model";
import { IOrder } from "./order.interface";
import { IProduct } from "../product/product.interface";

const createOrder = async (req: Request, res: Response) => {
    try {
        const orderData: IOrder = req.body;
        const product = orderData.product;
        const checkProduct: IProduct | null = await Product.findById(product);
        if (!checkProduct) {
            res.status(404).json({
                status: false,
                message: 'Product not found for order',
                data: checkProduct,
            })
        } else {
            const isProductOutOfStockStock = checkProduct.quantity < orderData.quantity;
            if (isProductOutOfStockStock) {
                res.status(400).json({
                    success: false,
                    message: `Insufficient product quantity. Available quantity: ${checkProduct.quantity}`,
                });
            } else {

                try {
                    const updatedQuantity = checkProduct.quantity - orderData.quantity;
                    const isStock = updatedQuantity > 0;
                    const totalPrice = checkProduct.price * orderData.quantity;
                    await Product.findByIdAndUpdate(
                        product,
                        { quantity: updatedQuantity, isStock }
                    );
                    const result = await orderServices.createOrderIntoDB({ ...orderData, totalPrice, });

                    if (result) {

                        res.status(200).json({
                            success: true,
                            message: "Order created successfully",
                            data: result,
                        });
                    } else {
                        res.status(400).json({
                            success: false,
                            message: "Failed to create Order",
                            data: null,
                        });
                    }
                } catch (error: any) {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Something went wrong",
                        error: error,
                    });
                }
            }
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
};
const calculateTotalRevenue = async (req: Request, res: Response) => {
    try {
        const result = await orderServices.calculateRevenueFromDB();
        res.status(200).json({
            status: true,
            message: 'Revenue calculated successfully',
            data: result[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
}

export const OrderControllers = {
    createOrder,
    calculateTotalRevenue
};