import mongoose from 'mongoose';

const NormalUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAgeOver22: {
        type: Boolean,
    },
});

export const NormalUserModel = mongoose.model('NormalUser', NormalUserSchema);
