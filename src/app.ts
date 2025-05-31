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
            'http://52.4.188.254',
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
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Welcome to Smokebot AI</title>
      <style>
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          overflow: hidden;
        }
        h1 {
          font-size: 3rem;
          margin: 0;
          animation: fadeInSlide 2s ease forwards;
        }
        p {
          font-size: 1.5rem;
          margin-top: 10px;
          animation: fadeInSlide 2s ease 1s forwards;
          opacity: 0;
        }
        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .sparkle {
          position: absolute;
          width: 5px;
          height: 5px;
          background: white;
          border-radius: 50%;
          animation: sparkleAnim 3s infinite ease-in-out;
          opacity: 0.8;
        }
        @keyframes sparkleAnim {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.5); }
        }
      </style>
    </head>
    <body>
      <h1>Welcome to <br />Smokebot AI</h1>
      <p>Your AI assistant for finding products fast and easy.</p>
      <script>
        // Create sparkling dots effect
        for(let i=0; i<30; i++) {
          const sparkle = document.createElement('div');
          sparkle.classList.add('sparkle');
          sparkle.style.top = Math.random() * 100 + 'vh';
          sparkle.style.left = Math.random() * 100 + 'vw';
          sparkle.style.animationDelay = (Math.random() * 3) + 's';
          sparkle.style.width = sparkle.style.height = (Math.random() * 3 + 2) + 'px';
          document.body.appendChild(sparkle);
        }
      </script>
    </body>
    </html>
  `);
});

// global error handler
app.use(globalErrorHandler);
// not found---------
app.use(notFound);

export default app;
