import { Router } from 'express';
import { ProductControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidations } from './product.validation';
import auth from '../../middlewares/auth';


const router = Router();
router.get('/', ProductControllers.getAllProducts)
router.post('/', auth('admin'), validateRequest(ProductValidations.createProductValidationSchema), ProductControllers.createProduct)
router.get('/:productId', ProductControllers.getSingleProduct)
router.patch('/:productId', auth('admin'), validateRequest(ProductValidations.updateProductValidationSchema), ProductControllers.updateSingleProduct)
router.delete('/:productId', auth('admin'), ProductControllers.deleteSingleProduct)
export const ProductRoutes = router;