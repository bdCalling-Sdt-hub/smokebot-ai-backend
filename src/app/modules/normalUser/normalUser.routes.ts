import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import normalUserValidations from './normalUser.validation';
import NormalUserController from './normalUser.controller';

const router = express.Router();

router.post(
    '/create-user',
    auth(USER_ROLE.storeOwner, USER_ROLE.superAdmin),
    validateRequest(normalUserValidations.createNormalUserValidationSchema),
    NormalUserController.createUser
);
router.get(
    '/get-all-users',
    auth(USER_ROLE.superAdmin, USER_ROLE.storeOwner),
    NormalUserController.getAllUser
);
router.get(
    '/my-users',
    auth(USER_ROLE.storeOwner),
    NormalUserController.getMyUsers
);

router.delete(
    '/delete-user/:id',
    auth(USER_ROLE.storeOwner),
    NormalUserController.deleteUser
);

export const normalUserRoutes = router;
