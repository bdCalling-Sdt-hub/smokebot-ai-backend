import express from 'express';
import ChatController from './chatbot.controller';

const router = express.Router();

router.post('/chat', ChatController.chat);

export const chatRoutes = router;
