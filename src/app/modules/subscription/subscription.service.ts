import httpStatus from "http-status";
import AppError from "../../error/appError";
import { ISubscription } from "./subscription.interface";
import subscriptionModel from "./subscription.model";

const updateUserProfile = async (id: string, payload: Partial<ISubscription>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await subscriptionModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await subscriptionModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const SubscriptionServices = { updateUserProfile };
export default SubscriptionServices;