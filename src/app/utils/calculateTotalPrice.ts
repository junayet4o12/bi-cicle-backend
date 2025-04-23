import { IOrderedProduct } from "../modules/order/order.interface";
import { IProduct } from "../modules/product/product.interface";

export const calculateTotalPrice = (products: IOrderedProduct[]) => {
    return products.reduce((total, { product, quantity, price }) => {
      if (product && price) {
        total += price * quantity;
      }
      return total;
    }, 0);
  };