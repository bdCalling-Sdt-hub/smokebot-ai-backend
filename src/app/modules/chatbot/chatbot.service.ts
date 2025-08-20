/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Chat from './chatbot.model';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from '../product/product.model';
import { textToSpeech } from '../../helper/textToSpeech';
// import { textToSpeech } from '../../helper/textToSpeech';

// const OPENAI_API_KEY = config.AI.open_ai_api_key;
// const OPENAI_API_URL = config.AI.open_ai_url;
// const OPENAI_MODEL = config.AI.open_ai_model;

// const conversations: any = {};

// // Utility: Extract meaningful keywords
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

// // Grouping and summarizing products
// const groupProductsByBaseName = (products: any[]) => {
//     const groups: Record<string, any[]> = {};
//     products.forEach((p) => {
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

// // Product data fetching based on user input
// const fetchProductData = async (storeId: string, userMessage: string) => {
//     const keywords = extractKeywords(userMessage);
//     let products;

//     if (keywords.length === 0) {
//         products = await Product.find({ store: storeId }).limit(10);
//     } else {
//         const regex = keywords.join('|');
//         products = await Product.find({
//             store: storeId,
//             name: { $regex: regex, $options: 'i' },
//         });

//         if (products.length === 0) {
//             products = await Product.find({
//                 store: storeId,
//                 category: { $regex: regex, $options: 'i' },
//             });
//         }

//         if (products.length === 0) {
//             products = await Product.find({ store: storeId }).limit(10);
//         }
//     }

//     return products && products.length > 0
//         ? buildProductsSummary(products)
//         : null;
// };

// // Distinct categories
// const fetchCategories = async (storeId: string) => {
//     const categories = await Product.distinct('category', { store: storeId });
//     return categories.length > 0 ? categories : null;
// };

// // Featured-related queries
// const isFeaturedQuery = (text: string): boolean => {
//     return /featured (products?|items?)|any featured/i.test(text);
// };

// const isSpecificProductFeaturedQuery = (text: string): string | null => {
//     const match = text.match(/is (.+?) (a )?featured (product|item)?/i);
//     return match ? match[1].trim() : null;
// };

// const fetchFeaturedProducts = async (storeId: string) => {
//     const featured = await Product.find({
//         store: storeId,
//         isFeatured: true,
//     }).limit(5);
//     if (!featured.length)
//         return 'There are no featured products in this store.';

//     let summary = `Yes, here are some featured products:\n`;
//     featured.forEach((p) => {
//         summary += ` - ${p.name}, Quantity: ${
//             p.quantity
//         }, Price: $${p.price.toFixed(2)}\n`;
//     });
//     return summary.trim();
// };

// // Main chat handler
// const chat = async (
//     storeId: string,
//     payload: {
//         userId: string;
//         message: string;
//     }
// ) => {
//     const { userId, message: userMessage } = payload;

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

//     // FEATURED PRODUCT HANDLING
//     const featuredListRequested = isFeaturedQuery(userMessage);
//     const specificProductName = isSpecificProductFeaturedQuery(userMessage);
//     let specialAnswer = '';

//     if (featuredListRequested) {
//         specialAnswer = await fetchFeaturedProducts(storeId);
//     } else if (specificProductName) {
//         const product = await Product.findOne({
//             store: storeId,
//             name: { $regex: new RegExp(`^${specificProductName}$`, 'i') },
//         });

//         if (!product) {
//             specialAnswer = `Sorry, we couldn’t find the product "${specificProductName}".`;
//         } else {
//             const isFeatured = product.isFeatured;
//             const featuredNote = isFeatured
//                 ? 'Yes, it is a featured product.'
//                 : 'No, it is not a featured product.';
//             const suggestions = await fetchFeaturedProducts(storeId);
//             specialAnswer = `${featuredNote}\n\n${suggestions}`;
//         }
//     }

//     if (specialAnswer) {
//         const result = await Chat.create({
//             user: userId,
//             userMessage: userMessage,
//             aiReply: specialAnswer,
//         });

//         conversations[userId].messages.push({
//             role: 'assistant',
//             content: specialAnswer,
//         });
//         return result;
//     }

//     // Fallback to OpenAI if no special case matched
//     const productsSummary = await fetchProductData(storeId, userMessage);
//     const categories = await fetchCategories(storeId);

//     // let systemPrompt = `You are a helpful assistant for a store chatbot.`;
//     let systemPrompt = `You are a helpful assistant for a smokeshop. You help customers find smoking accessories, vapes, and related products.`;

//     if (productsSummary) {
//         systemPrompt += `\n\nHere is the product data available for this store:\n${productsSummary}\n\n`;
//     }

//     if (categories) {
//         systemPrompt += `Available product categories in this store: ${categories.join(
//             ', '
//         )}.\n\n`;
//     }

//     systemPrompt += `
// Rules:
// - You are a helpful assistant for a smokeshop. You help customers find smoking accessories, vapes, and related products.
// - You can confirm availability and quantity for products listed above.
// - If the user asks about any product NOT in the above list, politely say: "Sorry, we do not have that product in our store," but feel free to suggest **similar or relevant general advice**.
// - If the user asks vaguely (e.g., "What’s a good laptop for video editing?"), provide helpful **general guidance** or make suggestions based on common knowledge.
// - Do not make up products that aren't listed above, but feel free to offer **shopping tips, category advice, and comparison help**.
// - If the store has no products, inform the user politely.
// - Otherwise, answer in a friendly and informative tone.
// `;

//     conversations[userId].messages[0] = {
//         role: 'system',
//         content: systemPrompt,
//     };
//     conversations[userId].messages.push({ role: 'user', content: userMessage });

//     try {
//         const response: any = await axios.post(
//             OPENAI_API_URL as string,
//             {
//                 model: OPENAI_MODEL,
//                 messages: conversations[userId].messages,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${OPENAI_API_KEY}`,
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

// // Cleanup sessions
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
//                 `Clearing session for user ${userId} due to inactivity.`
//             );
//             delete conversations[userId];
//         }
//     }
// }, CLEANUP_INTERVAL);

const OPENAI_API_KEY = config.AI.open_ai_api_key;
const OPENAI_API_URL = config.AI.open_ai_url;
const OPENAI_MODEL = config.AI.open_ai_model;

const conversations: any = {};

// Utility: Extract meaningful keywords
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

// Grouping and summarizing products
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
            summary += ` - ${p.name}, Category: ${p.category}, Flavour: ${p.flavour}\n`;
        });
    }
    return summary.trim();
};

// Product data fetching based on user input
const fetchProductData = async (storeId: string, userMessage: string) => {
    const keywords = extractKeywords(userMessage);
    let products;

    if (keywords.length === 0) {
        products = await Product.find({ store: storeId }).limit(10);
    } else {
        const regex = keywords.join('|');
        products = await Product.find({
            store: storeId,
            name: { $regex: regex, $options: 'i' },
        });

        if (products.length === 0) {
            products = await Product.find({
                store: storeId,
                category: { $regex: regex, $options: 'i' },
            });
        }

        if (products.length === 0) {
            products = await Product.find({ store: storeId }).limit(10);
        }
    }

    return products && products.length > 0
        ? buildProductsSummary(products)
        : null;
};

// Distinct categories
const fetchCategories = async (storeId: string) => {
    const categories = await Product.distinct('category', { store: storeId });
    return categories.length > 0 ? categories : null;
};

// Featured-related queries
const isFeaturedQuery = (text: string): boolean => {
    return /featured (products?|items?)|any featured/i.test(text);
};

const isSpecificProductFeaturedQuery = (text: string): string | null => {
    const match = text.match(/is (.+?) (a )?featured (product|item)?/i);
    return match ? match[1].trim() : null;
};

const fetchFeaturedProducts = async (storeId: string) => {
    const featured = await Product.find({
        store: storeId,
        isFeatured: true,
    }).limit(5);

    if (!featured.length)
        return 'There are no featured products in this store.';

    let summary = `Yes, here are some featured products:\n`;
    featured.forEach((p) => {
        summary += ` - ${p.name}, Category: ${p.category}, Flavour: ${p.flavour}\n`;
    });
    return summary.trim();
};

// Main chat handler
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

    // FEATURED PRODUCT HANDLING
    const featuredListRequested = isFeaturedQuery(userMessage);
    const specificProductName = isSpecificProductFeaturedQuery(userMessage);
    let specialAnswer = '';

    if (featuredListRequested) {
        specialAnswer = await fetchFeaturedProducts(storeId);
    } else if (specificProductName) {
        const product = await Product.findOne({
            store: storeId,
            name: { $regex: new RegExp(`^${specificProductName}$`, 'i') },
        });

        if (!product) {
            specialAnswer = `Sorry, we couldn’t find the product "${specificProductName}".`;
        } else {
            const isFeatured = product.isFeatured;
            const featuredNote = isFeatured
                ? 'Yes, it is a featured product.'
                : 'No, it is not a featured product.';
            const suggestions = await fetchFeaturedProducts(storeId);
            specialAnswer = `${featuredNote}\n\n${suggestions}`;
        }
    }

    if (specialAnswer) {
        const result = await Chat.create({
            user: userId,
            userMessage: userMessage,
            aiReply: specialAnswer,
        });

        conversations[userId].messages.push({
            role: 'assistant',
            content: specialAnswer,
        });
        return result;
    }

    // Fallback to OpenAI if no special case matched
    const productsSummary = await fetchProductData(storeId, userMessage);
    const categories = await fetchCategories(storeId);

    let systemPrompt = `You are a helpful assistant for a smokeshop. You help customers find smoking accessories, vapes, and related products.`;

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
- You are a helpful assistant for a smokeshop. You help customers find smoking accessories, vapes, and related products.
- You can confirm availability for products listed above.
- Each product has a name, category, and flavour.
- If the user asks about any product NOT in the above list, politely say: "Sorry, we do not have that product in our store," but feel free to suggest **similar or relevant general advice**.
- If the user asks vaguely (e.g., "What’s a good vape?"), provide helpful **general guidance** or make suggestions based on common knowledge.
- Do not make up products that aren't listed above, but feel free to offer **shopping tips, category advice, and comparison help**.
- If the store has no products, inform the user politely.
- Otherwise, answer in a friendly and informative tone.
`;

    conversations[userId].messages[0] = {
        role: 'system',
        content: systemPrompt,
    };
    conversations[userId].messages.push({ role: 'user', content: userMessage });

    try {
        const response: any = await axios.post(
            OPENAI_API_URL as string,
            {
                model: OPENAI_MODEL,
                messages: conversations[userId].messages,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const reply = response.data.choices[0].message;
        const audioBuffer = await textToSpeech(reply.content);
        const audioBase64 = audioBuffer.toString('base64');
        conversations[userId].messages.push(reply);

        Chat.create({
            user: userId,
            userMessage: userMessage,
            aiReply: reply.content,
        });

        return {
            user: userId,
            userMessage: userMessage,
            aiReply: reply.content,
            audio: audioBase64,
        };
    } catch (error: any) {
        console.error(error.response?.data || error.message);
        throw new AppError(
            httpStatus.SERVICE_UNAVAILABLE,
            `'Failed to get response from API' ${error.message}`
        );
    }
};

// Cleanup sessions
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
                `Clearing session for user ${userId} due to inactivity.`
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
