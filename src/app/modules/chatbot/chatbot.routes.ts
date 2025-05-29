import express from 'express';
import ChatController from './chatbot.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/chat',
    auth(USER_ROLE.storeOwner),

    ChatController.chat
);
router.get('/get-user-chat', ChatController.getChatForUser);

export const chatRoutes = router;
