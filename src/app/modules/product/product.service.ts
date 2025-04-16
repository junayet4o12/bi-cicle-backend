import QueryBuilder from "../../builder/QueryBuilder";
import { IProduct } from "./product.interface";
import Product from "./product.model"
type TUpdatedProduct = {
    productId: string;
    data: object
}
const getAllProductsFromDB = async (query: Record<string, unknown>) => {
    const productQuery = new QueryBuilder(Product.find(), query).fields().filter().paginate().search(['name', 'description', 'category']).sort()
    const result = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return { meta, result }
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

    const result = await Product.findByIdAndUpdate(productId, data, { new: true });

    return result
}
const deleteSingleProductFromDB = async (productId: string) => {
    const result = await Product.findByIdAndUpdate(productId, { isDeleted: true })
    return result
}
export const ProductServices = {
    getAllProductsFromDB,
    createProductsIntoDB,
    getSingleProductFromDB,
    updateSingleProductOfDB,
    deleteSingleProductFromDB,
}