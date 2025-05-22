import {
    ENUM_SUBSCRIPTION_DURATION,
    ENUM_SUBSCRIPTION_TYPE,
} from './subscription.enum';

export interface ISubscription {
    type: (typeof ENUM_SUBSCRIPTION_TYPE)[keyof typeof ENUM_SUBSCRIPTION_TYPE];
    duration: (typeof ENUM_SUBSCRIPTION_DURATION)[keyof typeof ENUM_SUBSCRIPTION_DURATION];
    price: number;
    description: string;
}
