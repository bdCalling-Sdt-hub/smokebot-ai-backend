import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { INormalUser } from './normalUser.interface';
import { NormalUser } from './normalUser.model';

const createUser = async (storeId: string, payload: INormalUser) => {
    const result = await NormalUser.create({ ...payload, store: storeId });
    return result;
};

const getAllUser = async (query: Record<string, unknown>) => {
    const resultQuery = new QueryBuilder(NormalUser.find(), query)
        .search(['name'])
        .fields()
        .filter()
        .paginate()
        .sort();

    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();
    return {
        meta,
        result,
    };
};
const getMyUsers = async (storeId: string, query: Record<string, unknown>) => {
    const resultQuery = new QueryBuilder(
        NormalUser.find({ store: storeId }),
        query
    )
        .search(['name'])
        .fields()
        .filter()
        .paginate()
        .sort();

    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();
    return {
        meta,
        result,
    };
};

const deleteUser = async (storeId: string, id: string) => {
    const result = await NormalUser.findOneAndDelete({
        _id: id,
        store: storeId,
    });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return result;
};

const NormalUserService = {
    createUser,
    getAllUser,
    getMyUsers,
    deleteUser,
};

export default NormalUserService;
