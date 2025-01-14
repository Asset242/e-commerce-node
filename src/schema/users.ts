import { z } from "zod";

export const signupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)

})

export const AddressSchema = z.object({
    lineOne: z.string().min(1, 'Lineone name is required'),
    lineTwo: z.string().optional(),
    pincode: z.string().min(6),
    country: z.string().min(1, 'Country name is required'),
    city: z.string().min(1, 'City name is required'),
    userId: z.number().optional()
})

export const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    defaultBillingAddressId: z.preprocess((val) => 
        typeof val === "string" ? Number(val) : val, 
        z.number().optional()
    ),
    defaultShippingAddressId: z.preprocess((val) => 
        typeof val === "string" ? Number(val) : val, 
        z.number().optional()
    )
});





