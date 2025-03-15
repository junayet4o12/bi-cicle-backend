import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { UserControllers } from "./user.controller";

const router = Router();

router.post('', validateRequest(UserValidations.createUserValidationSchema), UserControllers.createUser);
router.get('', UserControllers.getAllUsers);
router.get('/me', UserControllers.getMe);
router.get('/:id', UserControllers.getSingleUsers);
router.patch('/me', validateRequest(UserValidations.updateUserValidationSchema), UserControllers.updateByData);
router.patch('/:id', validateRequest(UserValidations.updateUserValidationSchema), UserControllers.updateSingleUser);
router.patch('/:id/toggle-state', UserControllers.toggleUserState);

export const UserRoutes = router;