import { z } from 'zod';

export const updateStoreData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const StoreValidations = { updateStoreData };
export default StoreValidations;
