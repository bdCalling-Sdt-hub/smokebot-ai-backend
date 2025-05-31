import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { ManageRoutes } from '../modules/manage-web/manage.routes';
import { normalUserRoutes } from '../modules/normalUser/normalUser.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { superAdminRoutes } from '../modules/superAdmin/superAdmin.routes';
// import { subscriptionRoutes } from '../modules/subscription/subscription.routes';
import { storeRoutes } from '../modules/store/store.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { productRoutes } from '../modules/product/product.routes';
import { subscriptionRoutes } from '../modules/subscription/subscription.routes';
import { chatRoutes } from '../modules/chatbot/chatbot.routes';

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        router: authRoutes,
    },
    {
        path: '/user',
        router: userRoutes,
    },
    {
        path: '/normal-user',
        router: normalUserRoutes,
    },

    {
        path: '/manage',
        router: ManageRoutes,
    },

    {
        path: '/admin',
        router: AdminRoutes,
    },

    {
        path: '/super-admin',
        router: superAdminRoutes,
    },
    // {
    //     path: '/subscription',
    //     router: subscriptionRoutes,
    // },
    {
        path: '/store',
        router: storeRoutes,
    },
    {
        path: '/category',
        router: categoryRoutes,
    },
    {
        path: '/product',
        router: productRoutes,
    },
    {
        path: '/subscription',
        router: subscriptionRoutes,
    },
    {
        path: '/chatbot',
        router: chatRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
