import { Router } from 'express';
import { ProductControllers } from './product.controller';


const router = Router();
router.get('/', ProductControllers.getAllProducts)
router.post('/create-product', ProductControllers.createProduct)
export const ProductRoutes = router;