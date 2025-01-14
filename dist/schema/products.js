"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Product name is required'),
    description: zod_1.z.string().min(1, 'Product description is required'),
    price: zod_1.z.number().positive('is required and should be a positive number'),
    tags: zod_1.z.array(zod_1.z.string()).optional()
});
