"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartItems = exports.updateCartItemQuantity = exports.removeItemFromCart = exports.addItemToCart = void 0;
const cart_1 = require("../schema/cart");
const not_found_exception_1 = require("../exceptions/not-found-exception");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const addItemToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = cart_1.createCartSchema.parse(req.body);
    try {
        const product = yield __1.prismaClient.product.findFirstOrThrow({
            where: { id: validatedData.productId }
        });
    }
    catch (err) {
        throw new not_found_exception_1.NotFoundException('Product not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
    const itemExist = yield __1.prismaClient.cartItem.findFirst({
        where: {
            userId: req.user.id,
            productId: validatedData.productId
        }
    });
    if (itemExist) {
        const updateQuantity = yield __1.prismaClient.cartItem.update({
            where: {
                id: itemExist.id
            },
            data: {
                quantity: itemExist.quantity + 1
            }
        });
        return res.json(updateQuantity);
    }
    const cartItems = yield __1.prismaClient.cartItem.create({
        data: {
            productId: validatedData.productId,
            userId: req.user.id,
            quantity: validatedData.quantity
        }
    });
    res.json(cartItems);
});
exports.addItemToCart = addItemToCart;
const removeItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield __1.prismaClient.cartItem.delete({
            where: {
                id: +req.params.id,
                userId: req.user.id
            }
        });
        res.json({ success: true, message: 'Item removed from cart' });
    }
    catch (err) {
        throw new not_found_exception_1.NotFoundException('Cart Item not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
});
exports.removeItemFromCart = removeItemFromCart;
const updateCartItemQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = cart_1.updateQuantitySchema.parse(req.body);
    try {
        const updateCart = yield __1.prismaClient.cartItem.update({
            where: { id: +req.params.id },
            data: { quantity: validatedData.quantity }
        });
        res.json({ sucess: true, message: "Cart Item quantity updated successfully", data: updateCart });
    }
    catch (err) {
        throw new not_found_exception_1.NotFoundException('Cart Item not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
});
exports.updateCartItemQuantity = updateCartItemQuantity;
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItems = yield __1.prismaClient.cartItem.findMany({
        where: { userId: req.user.id },
        include: { product: true }
    });
    res.status(200).json({ "success": true, "message": "Items Fetched Successfully", "data": cartItems });
});
exports.getCartItems = getCartItems;
