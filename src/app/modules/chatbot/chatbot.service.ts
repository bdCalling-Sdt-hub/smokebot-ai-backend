/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Chat from './chatbot.model';
import AppError from '../../error/appError';
import httpStatus from 'http-status';

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama3-70b-8192';

const conversations: any = {};

const chat = async (payload: any) => {
    const userId = payload.userId;
    const userMessage = payload.message;

    if (!conversations[userId]) {
        conversations[userId] = {
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
            ],
            lastActive: new Date(),
        };
    } else {
        conversations[userId].lastActive = new Date();
    }

    conversations[userId].messages.push({ role: 'user', content: userMessage });

    try {
        const response: any = await axios.post(
            GROQ_API_URL,
            {
                model: GROQ_MODEL,
                messages: conversations[userId].messages,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const reply = response.data.choices[0].message;

        conversations[userId].messages.push(reply);
        const result = await Chat.create({
            user: userId,
            userMessage: userMessage,
            aiReply: reply,
        });

        return result;
    } catch (error: any) {
        console.error(error.response?.data || error.message);
        throw new AppError(
            httpStatus.SERVICE_UNAVAILABLE,
            `'Failed to get response from API' ${error.message}`
        );
    }
};

const CLEANUP_INTERVAL = 2 * 60 * 1000; // run every 2 minutes
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes inactivity timeout

setInterval(() => {
    const now = Date.now();
    for (const userId in conversations) {
        if (
            now - conversations[userId].lastActive.getTime() >
            SESSION_TIMEOUT
        ) {
            console.log(
                `Clearing session for user ${userId} due to inactivity over 5 minutes.`
            );
            delete conversations[userId];
        }
    }
}, CLEANUP_INTERVAL);

const ChatBotService = {
    chat,
};

export default ChatBotService;
