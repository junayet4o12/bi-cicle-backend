import { Router } from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';


const router = Router();
router.get('/',  ProductControllers.getAllProducts)
router.post('/',validateRequest(ProductValidations.createProductValidationSchema), ProductControllers.createProduct)
router.get('/:productId', ProductControllers.getSingleProduct)
router.patch('/:productId', validateRequest(ProductValidations.updateProductValidationSchema), ProductControllers.updateSingleProduct)
router.delete('/:productId', ProductControllers.deleteSingleProduct)
export const ProductRoutes = router;