import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IStore } from './store.interface';
import Store from './store.model';
import QueryBuilder from '../../builder/QueryBuilder';

const updateStoreProfile = async (id: string, payload: Partial<IStore>) => {
    if (payload.email) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You cannot change the email'
        );
    }
    const user = await Store.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'Profile not found');
    }
    return await Store.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const getAllStore = async (query: Record<string, unknown>) => {
    const storeQuery = new QueryBuilder(
        Store.find().populate({ path: 'store', select: 'isBlocked' }),
        query
    )
        .search(['storeName'])
        .fields()
        .filter()
        .paginate()
        .sort();
    const result = await storeQuery.modelQuery;
    const meta = await storeQuery.countTotal;
    return {
        meta,
        result,
    };
};

const getSingleStore = async (id: string) => {
    const result = await Store.findById(id);
    return result;
};

const StoreServices = { updateStoreProfile, getAllStore, getSingleStore };
export default StoreServices;
