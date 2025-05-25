/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
export interface INormalUser {
    store: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    isAgeOver22: boolean;
}
