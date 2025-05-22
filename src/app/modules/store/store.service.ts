import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IStore } from './store.interface';
import storeModel from './store.model';

const updateStoreProfile = async (id: string, payload: Partial<IStore>) => {
    if (payload.email) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You cannot change the email'
        );
    }
    const user = await storeModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'Profile not found');
    }
    return await storeModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const StoreServices = { updateStoreProfile };
export default StoreServices;
