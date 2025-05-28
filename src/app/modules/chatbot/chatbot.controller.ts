import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import ChatBotService from './chatbot.service';
const chat = catchAsync(async (req, res) => {
    const result = await ChatBotService.chat(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Conversation retrieved successfully',
        data: result,
    });
});

const ChatController = {
    chat,
};

export default ChatController;
