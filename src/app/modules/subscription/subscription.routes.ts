import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import subscriptionController from './subscription.controller';

const router = express.Router();

router.post(
    '/create',
    auth(USER_ROLE.superAdmin),
    subscriptionController.createSubscription
);

router.patch(
    '/update/:id',
    auth(USER_ROLE.superAdmin),
    subscriptionController.updateSubscription
);

export const subscriptionRoutes = router;
