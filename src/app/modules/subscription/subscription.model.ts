import mongoose, { Schema } from 'mongoose';
import {
    ENUM_SUBSCRIPTION_TYPE,
    ENUM_SUBSCRIPTION_DURATION,
} from './subscription.enum';
import { ISubscription } from './subscription.interface';

const SubscriptionSchema = new Schema<ISubscription>({
    type: {
        type: String,
        enum: Object.values(ENUM_SUBSCRIPTION_TYPE),
        required: true,
    },
    duration: {
        type: String,
        enum: Object.values(ENUM_SUBSCRIPTION_DURATION),
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true,
    },
});

export const Subscription = mongoose.model<ISubscription>(
    'Subscription',
    SubscriptionSchema
);
