import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { ISubscription } from './subscription.interface';
import { Subscription } from './subscription.model';

const createSubscription = async (payload: ISubscription) => {
    const created = await Subscription.create(payload);
    return created;
};

const updateSubscription = async (
    id: string,
    payload: Partial<ISubscription>
) => {
    const updated = await Subscription.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    if (!updated) {
        throw new AppError(httpStatus.NOT_FOUND, 'Subscription not found');
    }

    return updated;
};

const subscriptionService = {
    createSubscription,
    updateSubscription,
};

export default subscriptionService;
