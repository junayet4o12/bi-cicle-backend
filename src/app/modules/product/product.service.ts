import { IProduct } from "./product.interface";
import Product from "./product.model"
type TUpdatedProduct = {
    productId: string;
    data: object
}
const getAllProductsFromDB = async () => {
    const result = await Product.find();
    return result
}

const createProductsIntoDB = async (productData: IProduct) => {
    const result = Product.create(productData);
    return result;
}
const getSingleProductFromDB = async (productId: string) => {
    const result = await Product.findById(productId);
    return result
}
const updateSingleProductOfDB = async ({ productId, data }: TUpdatedProduct) => {
    const result = await Product.findByIdAndUpdate(productId, data)
    return result
}
export const ProductServices = {
    getAllProductsFromDB,
    createProductsIntoDB,
    getSingleProductFromDB,
    updateSingleProductOfDB,
}