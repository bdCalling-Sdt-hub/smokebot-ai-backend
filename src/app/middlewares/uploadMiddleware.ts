// uploadMiddleware.ts
import multer from 'multer';

export const audioUpload = multer({
    storage: multer.memoryStorage(), // 🔥 keep file in memory
    limits: { fileSize: 25 * 1024 * 1024 }, // up to 25MB
}).single('audio'); // match field name from frontend
