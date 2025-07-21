import httpStatus from 'http-status';
import AppError from '../../error/appError';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import ChatBotService from './chatbot.service';
import { speechToText } from '../../helper/spaceToText';
const chat = catchAsync(async (req, res) => {
    // const audioBuffer = req.file?.buffer;
    // const filename = req.file?.originalname;

    // if (!audioBuffer || !filename) {
    //     throw new AppError(httpStatus.BAD_REQUEST, 'No audio file provided');
    // }

    // const text = await speechToText(audioBuffer,filename);
    // req.body.message = text;


    const result = await ChatBotService.chat(req.user.profileId, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Chat retrieved successfully',
        data: result,
    });
});
const getChatForUser = catchAsync(async (req, res) => {
    const result = await ChatBotService.getChatForUser(
        req.query.id as string,
        req.query
    );

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Chat retrieved successfully',
        data: result,
    });
});

const ChatController = {
    chat,
    getChatForUser,
};

export default ChatController;
