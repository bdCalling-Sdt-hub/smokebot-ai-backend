import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { INormalUser } from './normalUser.interface';
import { NormalUser } from './normalUser.model';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../user/user.constant';

const startChat = async (storeId: string, payload: INormalUser) => {
    if (!payload.name) {
        const isUserExist = await NormalUser.findOne({ phone: payload.phone });
        if (!isUserExist) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found');
        }
    }
    const result = await NormalUser.create({ ...payload, store: storeId });
    return result;
};

const getAllUser = async (
    userData: JwtPayload,
    query: Record<string, unknown>
) => {
    if (userData.role == USER_ROLE.storeOwner) {
        const resultQuery = new QueryBuilder(
            NormalUser.find({ store: userData.profileId }),
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
    } else {
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
    }
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
    startChat,
    getAllUser,
    getMyUsers,
    deleteUser,
};

export default NormalUserService;
