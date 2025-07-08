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
import qs from 'qs';
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
            'https://smokebot.ai',
            'http://smokebot.ai',
            'https://www.smokebot.ai',
            'http://www.smokebot.ai',
            'https://10.0.60.187:4173',
            'http://10.0.60.137:5030',
            'https://10.0.60.187:4173',
        ],
        credentials: true,
    })
);
app.use('/uploads', express.static('uploads'));
// application routers -------------------
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

// router.get('/connect-clover/:storeId', (req, res) => {
//     const { storeId } = req.params;
//     const redirectUri = encodeURIComponent(
//         `http://10.0.60.137:5050/api/clover/oauth/callback`
//     );

//     console.log('redirected url', redirectUri);
//     const url = `https://sandbox.dev.clover.com/oauth/authorize?client_id=${process.env.CLOVER_CLIENT_ID}&response_type=code&state=${storeId}&redirect_uri=${redirectUri}`;
//     // res.redirect(url);
//     res.send({ url: url });
// });

// router.get('/api/clover/oauth/callback', async (req, res) => {
//     try {
//         const { code, state } = req.query;

//         if (!code || !state) {
//             return res.status(400).send('Missing OAuth code or state');
//         }

//         const tokenUrl = 'https://sandbox.dev.clover.com/oauth/token';
//         const redirectUri = 'http://10.0.60.137:5050/api/clover/oauth/callback';

//         const body = qs.stringify({
//             client_id: process.env.CLOVER_CLIENT_ID,
//             client_secret: process.env.CLOVER_SECRET_KEY,
//             code,
//             redirect_uri: redirectUri,
//         });

//         const response: any = await axios.post(tokenUrl, body, {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//         });

//         console.log('response', response);
//         const { access_token } = response.data;
//         console.log('Access Token:', access_token);

//         // const merchantResponse = await axios.get(
//         //     'https://apisandbox.dev.clover.com/v3/merchants/me',
//         //     {
//         //         headers: {
//         //             Authorization: `Bearer ${access_token}`,
//         //         },
//         //     }
//         // );

//         // console.log('merchant res', merchantResponse);

//         // const merchantId = merchantResponse.data.id;
//         // console.log('Merchant ID:', merchantId);
//         const response1 = await axios.get(
//             'https://api.clover.com/v3/merchants/me',
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`,
//                 },
//             }
//         );

//         console.log('rwesonse', response1);

//         // If the response contains a single merchant object
//         const merchantId = response.data.id;

//         console.log(`Merchant ID: ${merchantId}`);

//         await Store.findByIdAndUpdate(state, {
//             clover: {
//                 connected: true,
//                 accessToken: access_token,
//                 merchantId: merchantId,
//                 lastSyncedAt: new Date(),
//             },
//         });

//         res.send('Clover account connected successfully!');
//     } catch (err) {
//         console.error(
//             'OAuth callback error:',
//             err?.response?.data || err.message
//         );
//         res.status(400).send('Failed to connect Clover account.');
//     }
// });

// router.get('/api/clover/oauth/callback', async (req, res) => {
//     try {
//         const { code, state } = req.query; // state = storeId

//         if (!code || !state) {
//             return res.status(400).send('Missing OAuth code or state');
//         }

//         console.log('CLIENT_ID:', process.env.CLOVER_CLIENT_ID);
//         console.log('SECRET_KEY:', process.env.CLOVER_SECRET_KEY);

//         const tokenUrl = 'https://sandbox.dev.clover.com/oauth/token';
//         const redirectUri = 'http://10.0.60.137:5050/api/clover/oauth/callback';

//         // Prepare x-www-form-urlencoded body
//         const body = qs.stringify({
//             client_id: process.env.CLOVER_CLIENT_ID,
//             client_secret: process.env.CLOVER_SECRET_KEY,
//             code,
//             redirect_uri: redirectUri,
//         });

//         // Send request to exchange code for access_token
//         const response = await axios.post(tokenUrl, body, {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//         });

//         console.log('res', response);
//         console.log('res2', response.data);
//         const { access_token, merchant_id } = response.data;
//         console.log('access token', access_token);
//         const merchantResponse = await axios.get(
//             'https://apisandbox.dev.clover.com/v3/merchants/me',
//             {
//                 headers: {
//                     Authorization: `Bearer ${access_token}`,
//                 },
//             }
//         );

//         console.log('march respn', merchantResponse);

//         const marchentId = merchantResponse.data.id;
//         console.log('maedhfdh', marchentId);
//         // Update store in MongoDB
//         await Store.findByIdAndUpdate(state, {
//             clover: {
//                 connected: true,
//                 accessToken: access_token,
//                 merchantId: merchant_id,
//                 lastSyncedAt: new Date(),
//             },
//         });

//         console.log('Clover connected:', { merchant_id });

//         // Optional: redirect to dashboard or UI
//         res.send('Clover account connected successfully!');
//     } catch (err) {
//         console.error(
//             'OAuth callback error:',
//             err?.response?.data || err.message
//         );
//         res.status(400).send('Failed to connect Clover account.');
//     }
// });

// router.get('/connect-clover/:storeId', (req, res) => {
//     const { storeId } = req.params;

//     // ✅ Use ngrok public URL
//     const redirectUri =
//         'https://0e0bddf6a0cd.ngrok-free.app/api/clover/oauth/callback';

//     const url = `https://sandbox.dev.clover.com/oauth/authorize?client_id=${process.env.CLOVER_CLIENT_ID}&response_type=code&state=${storeId}&redirect_uri=${redirectUri}`;

//     res.send({ url });
// });

router.get('/connect-clover/:storeId', (req, res) => {
    const { storeId } = req.params;

    const redirectUri =
        'https://0e0bddf6a0cd.ngrok-free.app/api/clover/oauth/callback';

    // The scopes you need, reflecting what your app is configured for.
    // 'merchant_read' is crucial for /merchants/me
    // 'inventory_read' or 'items_read' for items
    // 'orders_read' for orders
    // Use the specific scopes as documented by Clover for each permission
    const scopes =
        'merchant_read,inventory_read,orders_read,orders_write,inventory_write'; // Add all relevant scopes based on your app's "Requested Permissions"

    const url = `https://sandbox.dev.clover.com/oauth/authorize?client_id=${process.env.CLOVER_CLIENT_ID}&response_type=code&state=${storeId}&redirect_uri=${redirectUri}&scope=${scopes}`;

    res.send({ url });
});

router.get('/api/clover/oauth/callback', async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code || !state) {
            return res.status(400).send('Missing OAuth code or state');
        }

        const tokenUrl = 'https://sandbox.dev.clover.com/oauth/token';

        // ✅ Use same public URL here
        const redirectUri =
            'https://0e0bddf6a0cd.ngrok-free.app/api/clover/oauth/callback';

        const body = qs.stringify({
            client_id: process.env.CLOVER_CLIENT_ID,
            client_secret: process.env.CLOVER_SECRET_KEY,
            code,
            redirect_uri: redirectUri,
        });

        const response = await axios.post(tokenUrl, body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = response.data;
        console.log('Access Token:', access_token);

        // ✅ Use sandbox endpoint for /me
        const merchantResponse = await axios.get(
            'https://apisandbox.dev.clover.com/v3/merchants/me',
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const merchantId = merchantResponse.data.id;
        console.log(`Merchant ID: ${merchantId}`);

        // ✅ Save in DB
        await Store.findByIdAndUpdate(state, {
            clover: {
                connected: true,
                accessToken: access_token,
                merchantId: merchantId,
                lastSyncedAt: new Date(),
            },
        });

        res.send('Clover account connected successfully!');
    } catch (err) {
        console.error(
            'OAuth callback error:',
            err?.response?.data || err.message
        );
        res.status(400).send('Failed to connect Clover account.');
    }
});

const syncCloverProducts = async (storeId: string) => {
    const store = await Store.findById(storeId);
    if (!store?.clover?.connected) return;

    const { accessToken, merchantId } = store.clover;

    const response = await axios.get(
        `https://apisandbox.dev.clover.com/v3/merchants/${merchantId}/items`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    console.log('respnse', response);

    const cloverItems = response.data?.elements || [];

    // Optional: Clear old products
    await Product.deleteMany({ store: storeId });

    // Map and save to your schema
    for (const item of cloverItems) {
        await Product.create({
            store: storeId,
            name: item.name,
            category: item?.category?.name || 'General',
            flavour: item?.flavour || '', // if you add custom fields
            price: item.price / 100, // Clover returns price in cents
            sku: item.sku || '',
            isFeatured: false, // Default
        });
    }

    store.clover.lastSyncedAt = new Date();
    await store.save();
};

import cron from 'node-cron';
import Store from './app/modules/store/store.model';
import { Product } from './app/modules/product/product.model';
import axios from 'axios';

cron.schedule('0 * * * *', async () => {
    const stores = await Store.find({ 'clover.connected': true });
    for (const store of stores) {
        try {
            await syncCloverProducts(store._id.toString());
            console.log(`Synced Clover for store: ${store.name}`);
        } catch (err) {
            console.error(`Failed to sync for ${store.name}`, err);
        }
    }
});

// global error handler
app.use(globalErrorHandler);
// not found---------
app.use(notFound);

export default app;
