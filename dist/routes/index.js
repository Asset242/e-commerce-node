"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const product_1 = __importDefault(require("./product"));
const user_1 = __importDefault(require("./user"));
const cart_1 = __importDefault(require("./cart"));
const order_1 = __importDefault(require("./order"));
const rootRoutes = (0, express_1.Router)();
rootRoutes.use('/auth', auth_1.default);
rootRoutes.use('/products', product_1.default);
rootRoutes.use('/user', user_1.default);
rootRoutes.use('/cart', cart_1.default);
rootRoutes.use('/order', order_1.default);
exports.default = rootRoutes;
