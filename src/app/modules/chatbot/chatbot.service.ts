/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Chat from './chatbot.model';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from '../product/product.model';

// const GROQ_API_KEY = config.AI.groq_api_key;
// const GROQ_API_URL = config.AI.groq_api_url;
// const GROQ_MODEL = config.AI.groq_model;

// const conversations: any = {};

// const chat = async (payload: any) => {
//     const userId = payload.userId;
//     const userMessage = payload.message;

//     if (!conversations[userId]) {
//         conversations[userId] = {
//             messages: [
//                 { role: 'system', content: 'You are a helpful assistant.' },
//             ],
//             lastActive: new Date(),
//         };
//     } else {
//         conversations[userId].lastActive = new Date();
//     }

//     conversations[userId].messages.push({ role: 'user', content: userMessage });

//     try {
//         const response: any = await axios.post(
//             GROQ_API_URL as string,
//             {
//                 model: GROQ_MODEL,
//                 messages: conversations[userId].messages,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${GROQ_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         const reply = response.data.choices[0].message;
//         conversations[userId].messages.push(reply);
//         const result = await Chat.create({
//             user: userId,
//             userMessage: userMessage,
//             aiReply: reply.content,
//         });

//         return result;
//     } catch (error: any) {
//         console.error(error.response?.data || error.message);
//         throw new AppError(
//             httpStatus.SERVICE_UNAVAILABLE,
//             `'Failed to get response from API' ${error.message}`
//         );
//     }
// };

// const CLEANUP_INTERVAL = 2 * 60 * 1000; // run every 2 minutes
// const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes inactivity timeout

// setInterval(() => {
//     const now = Date.now();
//     for (const userId in conversations) {
//         if (
//             now - conversations[userId].lastActive.getTime() >
//             SESSION_TIMEOUT
//         ) {
//             console.log(
//                 `Clearing session for user ${userId} due to inactivity over 5 minutes.`
//             );
//             delete conversations[userId];
//         }
//     }
// }, CLEANUP_INTERVAL);

// new try

// Helper to extract product keywords (simple version)
// const extractKeywords = (text: string): string[] => {
//     const stopWords = new Set([
//         'is',
//         'the',
//         'in',
//         'your',
//         'do',
//         'you',
//         'have',
//         'any',
//         'of',
//         'with',
//         'for',
//         'there',
//         'store',
//         'shop',
//         'like',
//         'that',
//         'and',
//     ]);
//     return text
//         .toLowerCase()
//         .split(/\W+/)
//         .filter((word) => word.length > 2 && !stopWords.has(word));
// };

// // Optional: group products by base name for clearer variants (can skip or keep simple)
// const groupProductsByBaseName = (products: any[]) => {
//     // This is naive — assumes base name is first word or first two words — customize as needed
//     const groups: Record<string, any[]> = {};
//     products.forEach((p) => {
//         // For example, take first word or first two words as base (improve as needed)
//         const baseName = p.name.split(' ').slice(0, 2).join(' ');
//         if (!groups[baseName]) groups[baseName] = [];
//         groups[baseName].push(p);
//     });
//     return groups;
// };

// const buildProductsSummary = (products: any[]) => {
//     if (!products.length) return null;
//     const grouped = groupProductsByBaseName(products);
//     let summary = '';
//     for (const baseName in grouped) {
//         summary += `${baseName}:\n`;
//         grouped[baseName].forEach((p) => {
//             summary += ` - ${p.name}, Quantity: ${
//                 p.quantity
//             }, Price: $${p.price.toFixed(2)}\n`;
//         });
//     }
//     return summary.trim();
// };

// const fetchProductData = async (storeId: string, userMessage: string) => {
//     console.log('sotre id', storeId);
//     const keywords = extractKeywords(userMessage);
//     if (keywords.length === 0) return null;

//     const regex = keywords.join('|');
//     const products = await Product.find({
//         store: storeId,
//         name: { $regex: regex, $options: 'i' },
//     });

//     if (products.length === 0) return null;

//     return buildProductsSummary(products);
// };

// const GROQ_API_KEY = config.AI.groq_api_key;
// const GROQ_API_URL = config.AI.groq_api_url;
// const GROQ_MODEL = config.AI.groq_model;

// const conversations: any = {};

// const chat = async (
//     storeId: string,

//     payload: {
//         userId: string;
//         message: string;
//     }
// ) => {
//     const { userId, message: userMessage } = payload;
//     console.log('payload', payload);
//     if (!conversations[userId]) {
//         conversations[userId] = {
//             messages: [
//                 { role: 'system', content: 'You are a helpful assistant.' },
//             ],
//             lastActive: new Date(),
//         };
//     } else {
//         conversations[userId].lastActive = new Date();
//     }

//     // Fetch product data summary relevant to user query
//     const productsSummary = await fetchProductData(storeId, userMessage);

//     // Compose the system prompt with product data and strict instructions
//     let systemPrompt = `You are a helpful assistant for a store chatbot.`;

//     if (productsSummary) {
//         systemPrompt += `\n\nHere is the product data available for this store:\n${productsSummary}\n\n`;
//         systemPrompt += `
// Rules:
// - You can only confirm availability and quantity for products listed above.
// - If the user asks about any product NOT in the above list, respond: "Sorry, we do not have that product in our store."
// - If the user asks vaguely about product variants, only mention variants listed above.
// - For features or benefits, answer based on your general knowledge.
// - Otherwise, answer normally.
// `;
//     } else {
//         systemPrompt += `
// Rules:
// - The store currently has no products listed.
// - Inform the user politely that the store does not have any products.
// - For features or benefits questions, answer based on your general knowledge.
// - Otherwise, answer normally.
// `;
//     }

//     // Replace the initial system message with updated prompt
//     conversations[userId].messages[0] = {
//         role: 'system',
//         content: systemPrompt,
//     };

//     // Append user's new message
//     conversations[userId].messages.push({ role: 'user', content: userMessage });

//     try {
//         const response: any = await axios.post(
//             GROQ_API_URL as string,
//             {
//                 model: GROQ_MODEL,
//                 messages: conversations[userId].messages,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${GROQ_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         const reply = response.data.choices[0].message;
//         conversations[userId].messages.push(reply);

//         // Save chat to DB
//         const result = await Chat.create({
//             user: userId,
//             userMessage: userMessage,
//             aiReply: reply.content,
//         });

//         return result;
//     } catch (error: any) {
//         console.error(error.response?.data || error.message);
//         throw new AppError(
//             httpStatus.SERVICE_UNAVAILABLE,
//             `'Failed to get response from API' ${error.message}`
//         );
//     }
// };

// // Cleanup interval and session timeout remain same as your original code
// const CLEANUP_INTERVAL = 2 * 60 * 1000; // 2 minutes
// const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// setInterval(() => {
//     const now = Date.now();
//     for (const userId in conversations) {
//         if (
//             now - conversations[userId].lastActive.getTime() >
//             SESSION_TIMEOUT
//         ) {
//             console.log(
//                 `Clearing session for user ${userId} due to inactivity over 5 minutes.`
//             );
//             delete conversations[userId];
//         }
//     }
// }, CLEANUP_INTERVAL);

// make soem changes =====================================

// Helper to extract product keywords (simple version)
const extractKeywords = (text: string): string[] => {
    const stopWords = new Set([
        'is',
        'the',
        'in',
        'your',
        'do',
        'you',
        'have',
        'any',
        'of',
        'with',
        'for',
        'there',
        'store',
        'shop',
        'like',
        'that',
        'and',
    ]);
    return text
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => word.length > 2 && !stopWords.has(word));
};

// Group products by base name for clearer variants
const groupProductsByBaseName = (products: any[]) => {
    const groups: Record<string, any[]> = {};
    products.forEach((p) => {
        const baseName = p.name.split(' ').slice(0, 2).join(' ');
        if (!groups[baseName]) groups[baseName] = [];
        groups[baseName].push(p);
    });
    return groups;
};

const buildProductsSummary = (products: any[]) => {
    if (!products.length) return null;
    const grouped = groupProductsByBaseName(products);
    let summary = '';
    for (const baseName in grouped) {
        summary += `${baseName}:\n`;
        grouped[baseName].forEach((p) => {
            summary += ` - ${p.name}, Quantity: ${
                p.quantity
            }, Price: $${p.price.toFixed(2)}\n`;
        });
    }
    return summary.trim();
};

const fetchProductData = async (storeId: string, userMessage: string) => {
    const keywords = extractKeywords(userMessage);

    let products;

    if (keywords.length === 0) {
        // If no keywords detected, fetch up to 10 products (could be featured or all)
        products = await Product.find({ store: storeId }).limit(10);
    } else {
        const regex = keywords.join('|');

        // 1) Try to find products by name
        products = await Product.find({
            store: storeId,
            name: { $regex: regex, $options: 'i' },
        });

        // 2) If no products found by name, try by category
        if (products.length === 0) {
            products = await Product.find({
                store: storeId,
                category: { $regex: regex, $options: 'i' },
            });
        }

        // 3) If still no products, fallback to some products anyway
        if (products.length === 0) {
            products = await Product.find({ store: storeId }).limit(10);
        }
    }

    if (!products || products.length === 0) return null;

    return buildProductsSummary(products);
};

/**
 * Fetch distinct categories for store
 */
const fetchCategories = async (storeId: string) => {
    const categories = await Product.distinct('category', { store: storeId });
    return categories.length > 0 ? categories : null;
};

const GROQ_API_KEY = config.AI.groq_api_key;
const GROQ_API_URL = config.AI.groq_api_url;
const GROQ_MODEL = config.AI.groq_model;

const conversations: any = {};

const chat = async (
    storeId: string,
    payload: {
        userId: string;
        message: string;
    }
) => {
    const { userId, message: userMessage } = payload;

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

    const productsSummary = await fetchProductData(storeId, userMessage);
    const categories = await fetchCategories(storeId);

    // Compose system prompt
    let systemPrompt = `You are a helpful assistant for a store chatbot.`;

    if (productsSummary) {
        systemPrompt += `\n\nHere is the product data available for this store:\n${productsSummary}\n\n`;
    }

    if (categories) {
        systemPrompt += `Available product categories in this store: ${categories.join(
            ', '
        )}.\n\n`;
    }

    systemPrompt += `
Rules:
- You can only confirm availability and quantity for products listed above.
- If the user asks about any product NOT in the above list, respond: "Sorry, we do not have that product in our store."
- If the user asks vaguely about product variants, only mention variants listed above.
- For features or benefits, answer based on your general knowledge.
- If the store has no products, inform the user politely.
- Otherwise, answer normally.
`;

    conversations[userId].messages[0] = {
        role: 'system',
        content: systemPrompt,
    };

    conversations[userId].messages.push({ role: 'user', content: userMessage });

    try {
        const response: any = await axios.post(
            GROQ_API_URL as string,
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

        // Save chat to DB
        const result = await Chat.create({
            user: userId,
            userMessage: userMessage,
            aiReply: reply.content,
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

// Cleanup unchanged from your original code
const CLEANUP_INTERVAL = 2 * 60 * 1000; // 2 minutes
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

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

const getChatForUser = async (
    userId: string,
    query: Record<string, unknown>
) => {
    delete query.id;
    if (!query.sort) {
        query.sort = 'createdAt';
    }
    const resultQuery = new QueryBuilder(Chat.find({ user: userId }), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();
    return {
        meta,
        result,
    };
};

const ChatBotService = {
    chat,
    getChatForUser,
};

export default ChatBotService;
