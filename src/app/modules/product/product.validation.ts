import { z } from 'zod';

const createProductSchema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    price: z.number().min(0),
    quantity: z.number().min(0),
    isFeatured: z.boolean().optional(),
    store: z.string().min(1),
});
const updateProductSchema = z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    price: z.number().optional(),
    quantity: z.number().min(0),
    isFeatured: z.boolean().optional(),
    store: z.string().optional(),
});

const ProductValidations = {
    createProductSchema,
    updateProductSchema,
};

export default ProductValidations;
