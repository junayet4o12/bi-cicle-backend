import { Router } from 'express';
import { ProductControllers } from './product.controller';


const router = Router();
router.get('/', ProductControllers.getAllProducts)
router.post('/create-product', ProductControllers.createProduct)
router.get('/:productId', ProductControllers.getSingleProduct)
router.put('/:productId', ProductControllers.updateSingleProduct)
export const ProductRoutes = router;