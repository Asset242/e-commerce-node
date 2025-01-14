import { z } from "zod";

export const createCartSchema = z.object({
    productId: z.number(),
    quantity: z.number()
})
export const updateQuantitySchema = z.object({
    quantity: z.number()
})
