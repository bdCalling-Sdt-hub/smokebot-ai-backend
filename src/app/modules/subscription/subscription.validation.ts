import { z } from 'zod';
import {
    ENUM_SUBSCRIPTION_TYPE,
    ENUM_SUBSCRIPTION_DURATION,
} from './subscription.enum';
const createSubscriptionValidationSchema = z.object({
    body: z.object({
        type: z.enum([...Object.values(ENUM_SUBSCRIPTION_TYPE)] as [
            string,
            ...string[],
        ]),
        duration: z.enum([...Object.values(ENUM_SUBSCRIPTION_DURATION)] as [
            string,
            ...string[],
        ]),
        price: z.number().min(0),
        description: z.string().min(1),
    }),
});
const updateSubscriptionValidationSchema = z.object({
    body: z.object({
        type: z.enum([...Object.values(ENUM_SUBSCRIPTION_TYPE)] as [
            string,
            ...string[],
        ]),
        duration: z.enum([...Object.values(ENUM_SUBSCRIPTION_DURATION)] as [
            string,
            ...string[],
        ]),
        price: z.number().min(0),
        description: z.string().min(1),
    }),
});

const SubscriptoinValidations = {
    createSubscriptionValidationSchema,
    updateSubscriptionValidationSchema,
};

export default SubscriptoinValidations;
