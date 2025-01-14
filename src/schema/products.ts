import { any, z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Product description is required'),
    price: z.number().positive('is required and should be a positive number'),
    tags: z.array(z.string()).optional()
})