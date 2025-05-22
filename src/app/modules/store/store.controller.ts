import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import storeServices from './store.service';

const updateStoreProfile = catchAsync(async (req, res) => {
    const result = await storeServices.updateStoreProfile(
        req.user.profileId,
        req.body
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
});

const StoreController = { updateStoreProfile };
export default StoreController;
