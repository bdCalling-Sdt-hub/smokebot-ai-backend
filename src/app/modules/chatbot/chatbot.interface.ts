import { Types } from 'mongoose';
export interface IChat {
    user: Types.ObjectId;
    userMessage: string;
    aiReply: string;
}
