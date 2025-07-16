// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from 'axios';
// import FormData from 'form-data';
// import { extname } from 'path';
// import httpStatus from 'http-status';
// import config from '../config';
// import AppError from '../error/appError';

// const getAudioContentType = (filename: string): string => {
//     const ext = extname(filename).toLowerCase();
//     switch (ext) {
//         case '.mp3':
//             return 'audio/mpeg';
//         case '.mp4':
//             return 'audio/mp4';
//         case '.mpeg':
//             return 'audio/mpeg';
//         case '.mpga':
//             return 'audio/mpeg';
//         case '.m4a':
//             return 'audio/x-m4a';
//         case '.wav':
//             return 'audio/wav';
//         case '.webm':
//             return 'audio/webm';
//         default:
//             throw new AppError(
//                 httpStatus.BAD_REQUEST,
//                 `Unsupported audio format: ${ext}`
//             );
//     }
// };

// export const speechToText = async (
//     audioBuffer: any,
//     filename: string
// ): Promise<string> => {
//     try {
//         console.log('🎤 Converting speech to text with Whisper...');

//         const formData = new FormData();
//         formData.append('file', audioBuffer, {
//             filename,
//             contentType: getAudioContentType(filename),
//         });
//         formData.append('model', 'whisper-1');
//         formData.append('language', 'en');

//         const response: any = await axios.post(
//             'https://api.openai.com/v1/audio/transcriptions',
//             formData,
//             {
//                 headers: {
//                     ...formData.getHeaders(),
//                     Authorization: `Bearer ${config.AI.open_ai_api_key}`,
//                 },
//                 maxContentLength: Infinity,
//                 maxBodyLength: Infinity,
//             }
//         );

//         const transcription = response.data.text;
//         console.log('✅ Speech transcribed successfully:', transcription);
//         return transcription;
//     } catch (error: any) {
//         console.error(
//             '❌ Speech to text failed:',
//             error.response?.data || error.message
//         );
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'Failed to convert speech to text'
//         );
//     }
// };
