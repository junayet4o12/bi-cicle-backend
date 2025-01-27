import { IProduct } from "./product.interface";
import Product from "./product.model"

const getAllProductsFromDB = async () => {
    const result = await Product.find();
    return result
}

const createProductsIntoDB = async (productData: IProduct) => {
    const result = Product.create(productData);
    return result;
}
export const ProductServices = {
    getAllProductsFromDB,
    createProductsIntoDB
}