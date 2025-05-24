import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import productController from './product.controller';

const router = express.Router();

router.post(
    '/create',
    auth(USER_ROLE.storeOwner),
    productController.createProduct
);

router.patch(
    '/update/:id',
    auth(USER_ROLE.storeOwner),
    productController.updateProduct
);

router.get(
    '/get-all',
    // auth(USER_ROLE.superAdmin, USER_ROLE.user),
    productController.getAllProducts
);

router.get(
    '/get-my-products',
    auth(USER_ROLE.storeOwner),
    productController.getMyProducts
);
router.get(
    '/get-store-product/:id',
    // auth(USER_ROLE.storeOwner, USER_ROLE.superAdmin, USER_ROLE.user),
    productController.getSpecificStoreProduct
);

router.get(
    '/get-single/:id',
    // auth(USER_ROLE.superAdmin, USER_ROLE.user, USER_ROLE.storeOwner),
    productController.getSingleProduct
);
//
router.delete(
    '/delete/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.storeOwner),
    productController.deleteProduct
);

export const productRoutes = router;
