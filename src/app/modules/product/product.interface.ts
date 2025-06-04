import { Types } from 'mongoose';

export interface IProduct {
    name: string;
    category: string;
    price: number;
    quantity: number;
    isFeatured: boolean;
    store: Types.ObjectId;
    flavour: string;
}
