import { model, Schema } from 'mongoose';
import { IStore } from './store.interface';

const storeSchema = new Schema<IStore>(
    {
        user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        name: { type: String, required: true },
        phone: { type: String },
        email: { type: String, required: true },
        address: { type: String },
    },
    { timestamps: true }
);

const Store = model<IStore>('Store', storeSchema);
export default Store;
