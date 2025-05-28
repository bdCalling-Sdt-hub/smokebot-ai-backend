/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response, application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
const app: Application = express();
import sendContactUsEmail from './app/helper/sendContactUsEmail';
import dotenv from 'dotenv';
import { USER_ROLE } from './app/modules/user/user.constant';
import auth from './app/middlewares/auth';
import uploadCsvFile, { stopCsvUpload } from './app/helper/uploadCsv';
import multer from 'multer';
import handleWebhook from './stripe/webhook';
import axios from 'axios';
const upload = multer({ dest: 'uploads/' });
dotenv.config();

// web hook
app.post(
    '/store/webhook',
    express.raw({ type: 'application/json' }),
    handleWebhook
);
// parser
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            'http://localhost:3004',
            'http://localhost:3005',
            'http://localhost:3006',
            'http://localhost:3007',
            'http://localhost:3008',
            'http://10.0.60.187:11000',
            'http://10.0.60.187:5000',
        ],
        credentials: true,
    })
);
app.use('/uploads', express.static('uploads'));
// application routers ----------------
app.use('/', router);
app.post('/contact-us', sendContactUsEmail);
app.post(
    '/upload-csv',
    auth(USER_ROLE.storeOwner),
    upload.single('file'),
    uploadCsvFile
);
app.post('/stop-csv-upload', stopCsvUpload);
app.get('/', async (req, res) => {
    res.send({ message: 'Welcome to dance club server' });
});

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama3-70b-8192';

// app.post('/chat', async (req, res) => {
//     const { messages } = req.body;

//     try {
//         const response = await axios.post(
//             GROQ_API_URL,
//             {
//                 model: GROQ_MODEL,
//                 messages: messages,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${GROQ_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//         console.log('res', response);
//         const reply = response.data.choices[0].message; // Adjust based on API response format
//         res.json({ reply });
//     } catch (error) {
//         console.error(error.response?.data || error.message);
//         res.status(500).json({ error: 'Failed to get response from API' });
//     }
// });

// app.post('/chat', async (req, res) => {
//     const userMessage = req.body.message; // expecting { message: "Hi" }

//     // Build the messages array with a system prompt and user message
//     const messages = [
//         {
//             role: 'system',
//             content: 'You are a helpful assistant.',
//         },
//         {
//             role: 'user',
//             content: userMessage,
//         },
//     ];

//     try {
//         const response: any = await axios.post(
//             GROQ_API_URL,
//             {
//                 model: GROQ_MODEL,
//                 messages: messages,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${GROQ_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//         const reply = response.data.choices[0].message;
//         res.json({ reply });
//     } catch (error: any) {
//         console.error(error.response?.data || error.message);
//         res.status(500).json({ error: 'Failed to get response from API' });
//     }
// });

const conversations: any = {}; // key: user/session id, value: messages array

app.post('/chat', async (req, res) => {
    const userId = req.body.userId;
    const userMessage = req.body.message;

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
        const response = await axios.post(
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

        res.json({ reply });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get response from API' });
    }
});

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
// global error handler
app.use(globalErrorHandler);
// not found---------
app.use(notFound);

export default app;
