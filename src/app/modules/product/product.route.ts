import { Router } from 'express';
import { ProductControllers } from './product.controller';


const router = Router();
router.get('/', ProductControllers.getAllProducts)
router.post('/create-product', ProductControllers.createProduct)
router.get('/:productId', ProductControllers.getSingleProduct)
export const ProductRoutes = router;