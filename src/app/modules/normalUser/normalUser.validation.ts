import { z } from 'zod';

const createNormalUserValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
    }),
});

const normalUserValidations = {
    createNormalUserValidationSchema,
};

export default normalUserValidations;
