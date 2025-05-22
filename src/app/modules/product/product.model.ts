import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 0 },
        isFeatured: { type: Boolean, default: false },
        store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    },
    { timestamps: true }
);

export const ProductModel = model<IProduct>('Product', productSchema);
