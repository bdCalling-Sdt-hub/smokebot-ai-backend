import { z } from 'zod';

export const updateStoreData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});
const registerStoreValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        email: z.string({ required_error: 'Email is required' }),
        password: z
            .string({ required_error: 'Password is required' })
            .min(6, { message: 'Password minimum 6 digit' }),
        confirmPassword: z
            .string({ required_error: 'Confirm password is required' })
            .min(6, { message: 'Password minimum 6 digit' }),
    }),
});
const StoreValidations = { updateStoreData, registerStoreValidationSchema };
export default StoreValidations;
