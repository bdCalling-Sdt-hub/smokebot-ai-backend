import express from 'express';
import { USER_ROLE } from '../user/user.constant';
import CategoryController from './category.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.patch(
    '/add-category',
    auth(USER_ROLE.superAdmin, USER_ROLE.storeOwner),
    CategoryController.addNewCategory
);
router.get('/get-all', CategoryController.getCategories);

export const categoryRoutes = router;
