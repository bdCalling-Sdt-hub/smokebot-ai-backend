import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import subscriptionService from './subscription.service';

const createSubscription = catchAsync(async (req, res) => {
    const result = await subscriptionService.createSubscription(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Subscription created successfully',
        data: result,
    });
});

const updateSubscription = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await subscriptionService.updateSubscription(id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Subscription updated successfully',
        data: result,
    });
});

const subscriptionController = {
    createSubscription,
    updateSubscription,
};

export default subscriptionController;
