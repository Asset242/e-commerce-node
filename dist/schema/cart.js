"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuantitySchema = exports.createCartSchema = void 0;
const zod_1 = require("zod");
exports.createCartSchema = zod_1.z.object({
    productId: zod_1.z.number(),
    quantity: zod_1.z.number()
});
exports.updateQuantitySchema = zod_1.z.object({
    quantity: zod_1.z.number()
});
