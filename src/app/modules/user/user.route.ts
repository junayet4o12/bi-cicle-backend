import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post('', validateRequest(UserValidations.createUserValidationSchema), UserControllers.createUser);
router.get('', auth('admin'), UserControllers.getAllUsers);
router.get('/me', auth('admin', 'user'), UserControllers.getMe);
router.get('/:id', auth('admin'), UserControllers.getSingleUsers);
router.patch('/me', auth('admin', 'user'), validateRequest(UserValidations.updateUserValidationSchema), UserControllers.updateByData);
router.patch('/:id', auth('admin'), validateRequest(UserValidations.updateUserValidationSchema), UserControllers.updateSingleUser);
router.patch('/:id/toggle-state', auth('admin'), UserControllers.toggleUserState);

export const UserRoutes = router;