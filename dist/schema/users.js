"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.AddressSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
exports.AddressSchema = zod_1.z.object({
    lineOne: zod_1.z.string().min(1, 'Lineone name is required'),
    lineTwo: zod_1.z.string().optional(),
    pincode: zod_1.z.string().min(6),
    country: zod_1.z.string().min(1, 'Country name is required'),
    city: zod_1.z.string().min(1, 'City name is required'),
    userId: zod_1.z.number().optional()
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    defaultBillingAddressId: zod_1.z.preprocess((val) => typeof val === "string" ? Number(val) : val, zod_1.z.number().optional()),
    defaultShippingAddressId: zod_1.z.preprocess((val) => typeof val === "string" ? Number(val) : val, zod_1.z.number().optional())
});
