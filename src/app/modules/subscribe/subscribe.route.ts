import { Router } from 'express';
import { SubscribeControllers } from './subscribe.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { SubscribeValidations } from './subscribe.validation';

const router = Router();

router.get('/', SubscribeControllers.getAllSubscribes);

router.post(
  '/',
  validateRequest(SubscribeValidations.subscribe),
  SubscribeControllers.createSubscribe
);

router.get('/:email', SubscribeControllers.getSingleSubscribe);

router.delete('/:email', auth('admin'), SubscribeControllers.deleteSubscribe);

router.patch(
  '/status/:email',
  auth('admin'),
  validateRequest(SubscribeValidations.updateSubscribeStatus),
  SubscribeControllers.updateSubscribeStatus
);

export const SubscribeRoutes = router;
