import { Types } from 'mongoose';

export interface IStore {
    user: Types.ObjectId;
    name: string;
    phone?: string;
    email: string;
    address?: string;
}
