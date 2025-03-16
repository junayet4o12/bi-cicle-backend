import { Router } from 'express';
import { OrderControllers } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidations } from './order.validation';

const router = Router();
router.post('/', validateRequest(OrderValidations.createOrderValidationSchema), OrderControllers.createOrder)
router.get('/revenue', OrderControllers.calculateTotalRevenue)
export const OrderRoutes = router;
