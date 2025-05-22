import { z } from "zod";

export const updateProductData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const ProductValidations = { updateProductData };
export default ProductValidations;