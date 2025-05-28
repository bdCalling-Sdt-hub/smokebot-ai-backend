import { Schema, model } from 'mongoose';
import { IChat } from './chatbot.interface';

const chatSchema = new Schema<IChat>(
    {
        user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        userMessage: { type: String, required: true },
        aiReply: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Chat = model<IChat>('Chat', chatSchema);

export default Chat;
