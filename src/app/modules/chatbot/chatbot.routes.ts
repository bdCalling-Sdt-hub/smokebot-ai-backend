import express, { Request, Response, NextFunction } from 'express';
import ChatController from './chatbot.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { audioUpload } from '../../middlewares/uploadMiddleware';

const router = express.Router();

router.post(
    '/chat',
    auth(USER_ROLE.storeOwner),
    // audioUpload,
    // (req: Request, res: Response, next: NextFunction) => {
    //     if (req.body.data) {
    //         req.body = JSON.parse(req.body.data);
    //     }
    //     next();
    // },
    ChatController.chat
);
router.get('/get-user-chat', ChatController.getChatForUser);

export const chatRoutes = router;
