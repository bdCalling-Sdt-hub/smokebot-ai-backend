import validateRequest from '../../middlewares/validateRequest';
import userControllers from './user.controller';
import { Router } from 'express';
import userValidations from './user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import StoreValidations from '../store/store.validation';

const router = Router();

router.post(
    '/register-store',
    validateRequest(StoreValidations.registerStoreValidationSchema),
    userControllers.registerStore
);

router.patch(
    '/change-status/:id',
    auth(USER_ROLE.superAdmin),
    userControllers.changeUserStatus
);
router.delete(
    '/delete-account',
    auth(USER_ROLE.user),
    validateRequest(userValidations.deleteUserAccountValidationSchema),
    userControllers.deleteUserAccount
);

router.get(
    '/get-my-profile',
    auth(USER_ROLE.storeOwner),
    userControllers.getMyProfile
);
router.post(
    '/verify-code',
    validateRequest(userValidations.verifyCodeValidationSchema),
    userControllers.verifyCode
);

router.post(
    '/resend-verify-code',
    validateRequest(userValidations.resendVerifyCodeSchema),
    userControllers.resendVerifyCode
);

router.patch(
    '/update-profile',
    auth(USER_ROLE.superAdmin, USER_ROLE.storeOwner),
    validateRequest(userValidations.updateUserValidationSchema),
    userControllers.updateProfile
);

export const userRoutes = router;
