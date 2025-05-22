/* eslint-disable no-unused-vars */

import { User } from './user.model';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { USER_ROLE } from './user.constant';
import NormalUser from '../normalUser/normalUser.model';
import cron from 'node-cron';
import { JwtPayload } from 'jsonwebtoken';
import SuperAdmin from '../superAdmin/superAdmin.model';

//TODO: ata kono todo na mojar baper hossa akana thaka jdoi aii 2 ta line remove kora dai tahola multer-s3 kaj korba nah
import dotenv from 'dotenv';
import Admin from '../admin/admin.model';
import { IStore } from '../store/store.interface';
import { TUser } from './user.interface';
import sendEmail from '../../utilities/sendEmail';
import registrationSuccessEmailBody from '../../mailTemplate/registerSucessEmail';
dotenv.config();
const generateVerifyCode = (): number => {
    return Math.floor(10000 + Math.random() * 900000);
};

const registerStore = async (
    payload: IStore & { password: string; confirmPassword: string }
) => {
    const { password, confirmPassword, ...userData } = payload;
    if (password !== confirmPassword) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Password and confirm password doesn't match"
        );
    }

    const emailExist = await User.findOne({ email: userData.email });
    if (emailExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'This email already exist');
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const verifyCode = generateVerifyCode();
        const userDataPayload: Partial<TUser> = {
            email: userData?.email,
            password: password,
            role: USER_ROLE.storeOwner,
            verifyCode,
            codeExpireIn: new Date(Date.now() + 5 * 60000),
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const user = await User.create([userDataPayload], { session });

        const storePayload = {
            ...userData,
            user: user[0]._id,
        };
        const result = await NormalUser.create([storePayload], {
            session,
        });

        await User.findByIdAndUpdate(
            user[0]._id,
            { profileId: result[0]._id },
            { session }
        );

        sendEmail({
            email: userData.email,
            subject: 'Activate Your Account',
            html: registrationSuccessEmailBody(
                result[0].name,
                user[0].verifyCode
            ),
        });

        await session.commitTransaction();
        session.endSession();

        return result[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const deleteUserAccount = async (user: JwtPayload, password: string) => {
    const userData = await User.findById(user.id);

    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (!(await User.isPasswordMatched(password, userData?.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not match');
    }

    await NormalUser.findByIdAndDelete(user.profileId);
    await User.findByIdAndDelete(user.id);

    return null;
};

const getMyProfile = async (userData: JwtPayload) => {
    let result = null;
    if (userData.role === USER_ROLE.user) {
        result = await NormalUser.findById(userData.profileId);
    } else if (userData.role === USER_ROLE.superAdmin) {
        result = await SuperAdmin.findById(userData.profileId);
    } else if (userData.role === USER_ROLE.admin) {
        result = await Admin.findById(userData.profileId);
    }
    return result;
};

// all cron jobs for users

cron.schedule('*/2 * * * *', async () => {
    try {
        const now = new Date();

        // Find unverified users whose expiration time has passed
        const expiredUsers = await User.find({
            isVerified: false,
            codeExpireIn: { $lte: now },
        });

        if (expiredUsers.length > 0) {
            const expiredUserIds = expiredUsers.map((user) => user._id);

            // Delete corresponding NormalUser documents
            const normalUserDeleteResult = await NormalUser.deleteMany({
                user: { $in: expiredUserIds },
            });

            // Delete the expired User documents
            const userDeleteResult = await User.deleteMany({
                _id: { $in: expiredUserIds },
            });

            console.log(
                `Deleted ${userDeleteResult.deletedCount} expired inactive users`
            );
            console.log(
                `Deleted ${normalUserDeleteResult.deletedCount} associated NormalUser documents`
            );
        }
    } catch (error) {
        console.log('Error deleting expired users and associated data:', error);
    }
});

const changeUserStatus = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    const result = await User.findByIdAndUpdate(
        id,
        { isBlocked: !user.isBlocked },
        { new: true, runValidators: true }
    );
    return result;
};

const userServices = {
    registerStore,
    getMyProfile,
    changeUserStatus,
    deleteUserAccount,
};

export default userServices;
