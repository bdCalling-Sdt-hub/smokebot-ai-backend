import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { ENUM_PAYMENT_PURPOSE } from '../../utilities/enum';
import Stripe from 'stripe';
import config from '../../config';
import { subscriptionPrice } from '../../constant';
import Store from '../store/store.model';
const stripe = new Stripe(config.stripe.stripe_secret_key as string);

// purchase subscription--------------------------
const purchaseSubscription = async (profileId: string) => {
    const store = await Store.findById(profileId);
    if (!store) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    const amountInCent = subscriptionPrice * 100;
    const storeId = store._id.toString();

    if (
        store?.subscriptionExpiryDate &&
        new Date(store?.subscriptionExpiryDate).getTime() > Date.now()
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You already have subscription'
        );
    }

    if (store?.subscriptionPurchaseDate) {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Renew Subscription`,
                        },
                        unit_amount: amountInCent,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: storeId,
                paymentPurpose: ENUM_PAYMENT_PURPOSE.RENEW_SUBSCRIPTION,
            },
            customer_email: store?.email,
            success_url: `${config.stripe.subscription_renew_success_url}?collaborationId=${storeId}`,
            cancel_url: `${config.stripe.subscription_renew_cancel_url}`,
        });
        return { url: session.url };
    } else {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Purchase Subscription`,
                        },
                        unit_amount: amountInCent,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                storeId: storeId,
                paymentPurpose: ENUM_PAYMENT_PURPOSE.PURCHASE_SUBSCRIPTION,
            },
            customer_email: store?.email,
            success_url: `${config.stripe.subscription_payment_success_url}`,
            cancel_url: `${config.stripe.subscription_payment_cancel_url}`,
        });

        return { url: session.url };
    }
};

const continueWithTrail = async (profileId: string) => {
    const store = await Store.findById(profileId);
    if (store?.trialStartDate) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'You already take trial , now you need to purchase subscription'
        );
    }
    const currentDate = new Date();
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(currentDate.getDate() + 5);

    const result = await Store.findByIdAndUpdate(
        profileId,
        {
            trialStartDate: currentDate,
            trialEndDate: fiveDaysLater,
        },
        { new: true, runValidators: true }
    );

    return result;
};

const SubscriptionService = {
    purchaseSubscription,
    continueWithTrail,
};

export default SubscriptionService;
