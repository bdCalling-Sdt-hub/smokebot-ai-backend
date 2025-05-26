import { model, Schema } from 'mongoose';
import { IStore } from './store.interface';

const storeSchema = new Schema<IStore>(
    {
        user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        name: { type: String, required: true },
        phone: { type: String },
        email: { type: String, required: true },
        address: { type: String },
        subscriptionPurchaseDate: {
            type: Date,
        },
        subscriptionRenewDate: {
            type: Date,
        },
        subscriptionExpiryDate: {
            type: Date,
        },
        trialStartDate: {
            type: Date,
        },
        trialEndDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Store = model<IStore>('Store', storeSchema);
export default Store;
