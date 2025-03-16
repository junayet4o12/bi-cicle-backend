import { Router } from 'express';
import { OrderControllers } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidations } from './order.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.post('', auth('admin'), validateRequest(OrderValidations.createOrderValidationSchema), OrderControllers.createOrder);
router.get('', auth('admin'), OrderControllers.getAllOrders);
router.get('/revenue', auth('admin'), OrderControllers.calculateTotalRevenue);
router.get('/:orderId', auth('admin', 'user'), OrderControllers.getSingleOrder);
router.patch('/:orderId', auth('admin'), validateRequest(OrderValidations.updateOrderValidationSchema), OrderControllers.updateOrder);
router.patch('/status/:orderId', auth('admin'), validateRequest(OrderValidations.changeStatusValidationSchema), OrderControllers.updateOrderStatus);
router.delete('/:orderId', auth('admin'), OrderControllers.deleteOrder);


export const OrderRoutes = router;
