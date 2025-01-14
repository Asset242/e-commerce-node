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
exports.getOrderById = exports.cancelOrder = exports.listOrders = exports.createOrder = void 0;
const __1 = require("..");
const not_found_exception_1 = require("../exceptions/not-found-exception");
const root_1 = require("../exceptions/root");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield __1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const cart = yield tx.cartItem.findMany({
            where: { userId: req.user.id },
            include: { product: true }
        });
        if (cart.length == 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const price = cart.reduce((prev, current) => {
            return prev + (current.quantity * Number(current.product.price));
        }, 0);
        // return res.status(200).json(price)
        const address = req.user.defaultShippingAddressId ? yield tx.address.findFirst({ where: { id: req.user.defaultShippingAddressId } }) : null;
        const order = yield tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: address ? address.formattedAddress : '',
                status: "CREATION",
                products: {
                    create: cart.map((item) => {
                        return {
                            productId: item.productId,
                            quantity: item.quantity
                        };
                    })
                }
            }
        });
        const orderEvent = yield tx.orderEvent.create({
            data: {
                orderId: order.id,
            }
        });
        yield __1.prismaClient.cartItem.deleteMany({
            where: { userId: req.user.id }
        });
        return res.json({ mesaage: "Order placed successfully", data: order });
    }));
});
exports.createOrder = createOrder;
const listOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield __1.prismaClient.order.findMany({
        where: { userId: req.user.id },
        include: {
            products: true,
            events: true,
        }
    });
    res.json({ success: true, message: "Orders fetched successfully", data: orders });
});
exports.listOrders = listOrders;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield __1.prismaClient.order.update({
            where: { id: +req.params.id },
            data: { status: "CANCELLED" }
        });
        yield __1.prismaClient.orderEvent.create({
            data: { orderId: order.id, status: "CANCELLED" }
        });
        res.json({ success: true, message: "Order cancelled successfully", data: order });
    }
    catch (error) {
        throw new not_found_exception_1.NotFoundException('Order not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
});
exports.cancelOrder = cancelOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield __1.prismaClient.order.findFirstOrThrow({
            where: { id: +req.params.id },
            include: {
                products: true,
                events: true,
            }
        });
        res.json({ success: true, message: "Order fetched successfully", data: order });
    }
    catch (error) {
        throw new not_found_exception_1.NotFoundException('Order not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
});
exports.getOrderById = getOrderById;
