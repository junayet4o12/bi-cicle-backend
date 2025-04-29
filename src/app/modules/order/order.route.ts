import { Router } from 'express';
import { OrderControllers } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidations } from './order.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.get('', auth('admin'), OrderControllers.getAllOrders);
router.get('/my-orders', auth('admin', 'user'), OrderControllers.getMyOrders);
router.get('/revenue', auth('admin'), OrderControllers.calculateTotalRevenue);
router.get('/:orderId', OrderControllers.getSingleOrder);
router.get('/success/:tranId', OrderControllers.getSingleOrderByTranId);
router.patch('/:orderId', auth('admin'), validateRequest(OrderValidations.updateOrderValidationSchema), OrderControllers.updateOrder);
router.patch('/status/:orderId', auth('admin'), validateRequest(OrderValidations.changeStatusValidationSchema), OrderControllers.updateOrderStatus);
router.delete('/:orderId', auth('admin'), OrderControllers.deleteOrder);
router.post('/checkout', validateRequest(OrderValidations.checkoutValidationSchema) , OrderControllers.checkout)


export const OrderRoutes = router;
