/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import NormalUserServices from './normalUser.services';

const startChat = catchAsync(async (req, res) => {
    const result = await NormalUserServices.startChat(
        req.user.profileId,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User created successfully',
        data: result,
    });
});

const getAllUser = catchAsync(async (req, res) => {
    const result = await NormalUserServices.getAllUser(req.user, req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});
const getMyUsers = catchAsync(async (req, res) => {
    const result = await NormalUserServices.getMyUsers(
        req.user.profileId,
        req.query
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});

const deleteUser = catchAsync(async (req, res) => {
    const result = await NormalUserServices.deleteUser(
        req.user.profileId,
        req.params.id
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
});

const NormalUserController = {
    startChat,
    getAllUser,
    deleteUser,
    getMyUsers,
};

export default NormalUserController;
