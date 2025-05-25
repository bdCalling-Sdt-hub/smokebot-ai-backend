/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import httpStatus from 'http-status';
import { ENUM_PAYMENT_PURPOSE } from '../app/utilities/enum';
import { getIO } from '../app/socket/socketManager';
import Store from '../app/modules/store/store.model';
import AppError from '../app/error/appError';

const handlePaymentSuccess = async (
    metaData: any,
    transactionId: string,
    amount: number
) => {
    if (metaData.paymentPurpose == ENUM_PAYMENT_PURPOSE.PURCHASE_SUBSCRIPTION) {
        await handleSubcriptionPurchaseSuccess(
            metaData.storeId,
            transactionId,
            amount
        );
    } else if (
        metaData.paymentPurpose == ENUM_PAYMENT_PURPOSE.RENEW_SUBSCRIPTION
    ) {
        await handleSubscriptionRenewSuccess(
            metaData.storeId,
            transactionId,
            amount
        );
    }
};

const handleSubcriptionPurchaseSuccess = async (
    storeId: string,
    transactionId: string,
    amount: number
) => {
    const io = getIO();
    const normalUser = await Store.findById(storeId);
    if (!normalUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    await Store.findByIdAndUpdate(
        storeId,
        {
            subscriptionPurchaseDate: new Date(),
            subscriptionExpiryDate: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            ),
            isPremium: true,
        },
        { new: true, runValidators: true }
    );
    // await Transaction.create({
    //     user: normalUser?._id,
    //     email: normalUser?.email,
    //     type: ENUM_TRANSACTION_TYPE.PURCHASE_SUBSCRIPTION,
    //     amount: amount,
    //     transactionId,
    // });

    // await Notification.create({
    //     title: 'Subscription purchase successful',
    //     message: `Congratullations you successfully purchase subscription`,
    //     receiver: userId,
    // });
    // const updatedNotificationCount = await getUserNotificationCount(userId);
    // io.to(userId.toString()).emit('notifications', updatedNotificationCount);
};

const handleSubscriptionRenewSuccess = async (
    storeId: string,
    transactionId: string,
    amount: number
) => {
    // const io = getIO();
    const store = await Store.findById(storeId);
    if (!store) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    await Store.findByIdAndUpdate(
        storeId,
        {
            subscriptionExpiryDate: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            ),
            subscriptionRenewDate: new Date(),
        },
        { new: true, runValidators: true }
    );
    // await Transaction.create({
    //     user: store?._id,
    //     email: store?.email,
    //     type: ENUM_TRANSACTION_TYPE.RENEW_SUBSCRIPTION,
    //     amount: amount,
    //     transactionId,
    // });

    // await Notification.create({
    //     title: 'Subscription renew successful',
    //     message: `Congratullations you successfully renew subscription`,
    //     receiver: userId,
    // });
    // const updatedNotificationCount = await getUserNotificationCount(userId);
    // io.to(userId.toString()).emit('notifications', updatedNotificationCount);
};

export default handlePaymentSuccess;
