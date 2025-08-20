/* eslint-disable @typescript-eslint/no-explicit-any */
import AWS from 'aws-sdk';
import httpStatus from 'http-status';
import AppError from '../error/appError';

// Configure AWS Polly
const polly = new AWS.Polly({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
});

export const textToSpeech = async (
    text: string,
    voiceId: string = 'Joanna'
): Promise<any> => {
    try {
        console.log('🔊 Converting text to speech with Amazon Polly...');

        const params = {
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: voiceId,
            Engine: 'neural',
            // Engine: 'standard',
            LanguageCode: 'en-US',
            TextType: 'text',
        };

        const result = await polly.synthesizeSpeech(params).promise();

        if (!result.AudioStream) {
            throw new Error('No audio stream received from Polly');
        }

        const audioBuffer = result.AudioStream as any;
        console.log('✅ Text to speech completed successfully');

        return audioBuffer;
    } catch (error: any) {
        console.error('❌ Text to speech failed:', error);
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to convert text to speech'
        );
    }
};
