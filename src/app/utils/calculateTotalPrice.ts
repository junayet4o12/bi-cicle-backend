import { IProduct } from "../modules/product/product.interface";

export const calculateTotalPrice = (products: Array<{ product: IProduct; quantity: number }>) => {
    return products.reduce((total, { product, quantity }) => {
      if (product && product.price) {
        total += product.price * quantity;
      }
      return total;
    }, 0);
  };