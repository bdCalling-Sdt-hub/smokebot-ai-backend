import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import productController from './product.controller';

const router = express.Router();

router.post(
    '/create',
    auth(USER_ROLE.superAdmin),
    productController.createProduct
);

router.patch(
    '/update/:id',
    auth(USER_ROLE.superAdmin),
    productController.updateProduct
);

router.get(
    '/get-all',
    auth(USER_ROLE.superAdmin, USER_ROLE.user),
    productController.getAllProducts
);

router.get(
    '/get-single/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.user),
    productController.getSingleProduct
);
router.delete(
    '/delete/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.user),
    productController.deleteProduct
);

export const productRoutes = router;
