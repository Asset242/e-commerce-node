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
exports.listUserOrders = exports.changeStatus = exports.listAllOrders = exports.changeUserRole = exports.getUserById = exports.listUsers = exports.editUser = exports.deleteAddress = exports.listAddress = exports.addAddress = void 0;
const users_1 = require("../schema/users");
const not_found_exception_1 = require("../exceptions/not-found-exception");
const root_1 = require("../exceptions/root");
const __1 = require("..");
const unauthorized_exception_1 = require("../exceptions/unauthorized-exception");
const bad_requests_1 = require("../exceptions/bad-requests");
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    users_1.AddressSchema.parse(req.body);
    if (!req.user || !req.user.id)
        return new unauthorized_exception_1.UnauthorizedException('Invalid User ID', root_1.ErrorCodes.UNAUTHORIZED);
    const address = yield __1.prismaClient.address.create({
        data: Object.assign(Object.assign({}, req.body), { userId: req.user.id })
    });
    res.json(address);
});
exports.addAddress = addAddress;
const listAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const addresses = yield __1.prismaClient.address.findMany({
        where: { userId: req.user.id },
        include: {
            user: false
        }
    });
    res.json(addresses);
});
exports.listAddress = listAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // if (!req.user || !req.user.id) return new UnauthorizedException('User not logged in', ErrorCodes.UNAUTHORIZED)
        yield __1.prismaClient.address.delete({ where: { id: +req.params.id, userId: req.user.id } });
        res.json({ success: true, message: 'Address Deleted Successfully' });
    }
    catch (err) {
        throw new not_found_exception_1.NotFoundException('User Address not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
});
exports.deleteAddress = deleteAddress;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = users_1.updateUserSchema.parse(req.body);
    if (validatedData.defaultBillingAddressId) {
        try {
            const address = yield __1.prismaClient.address.findFirstOrThrow({
                where: {
                    id: +validatedData.defaultBillingAddressId,
                    userId: req.user.id
                }
            });
            const updateInfo = yield __1.prismaClient.user.update({
                where: { id: req.user.id },
                data: +validatedData
            });
            res.json(updateInfo);
        }
        catch (err) {
            throw new bad_requests_1.BadRequestsException("Invalid Address ID", root_1.ErrorCodes.BAD_REQUEST);
        }
    }
    if (validatedData.defaultShippingAddressId) {
        try {
            yield __1.prismaClient.address.findFirstOrThrow({
                where: {
                    id: +validatedData.defaultShippingAddressId,
                    userId: req.user.id
                }
            });
            const updateInfo = yield __1.prismaClient.user.update({
                where: { id: req.user.id },
                data: validatedData
            });
            res.json(updateInfo);
        }
        catch (err) {
            throw new bad_requests_1.BadRequestsException("An unexpected error occurred", root_1.ErrorCodes.BAD_REQUEST);
        }
    }
});
exports.editUser = editUser;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = parseInt(req.query.skip, 10) || 0;
    const take = parseInt(req.query.take, 10) || 5;
    const user = yield __1.prismaClient.user.findMany({
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' },
    });
    res.json(user);
});
exports.listUsers = listUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield __1.prismaClient.user.findFirstOrThrow({
            where: { id: +req.params.id },
            include: { addresses: true }
        });
        res.json(user);
    }
    catch (err) {
        throw new not_found_exception_1.NotFoundException('User not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
});
exports.getUserById = getUserById;
const changeUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield __1.prismaClient.user.update({
            where: { id: +req.params.id },
            data: { role: req.body.role }
        });
        res.json(user);
    }
    catch (err) {
        throw new not_found_exception_1.NotFoundException('User not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
});
exports.changeUserRole = changeUserRole;
const listAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = parseInt(req.query.skip, 10) || 0;
    let whereClause = {};
    const status = req.query.status;
    if (status) {
        whereClause = { status };
    }
    const orders = yield __1.prismaClient.order.findMany({
        where: whereClause,
        skip: skip || 0,
        take: 5
    });
    res.json({ orders });
});
exports.listAllOrders = listAllOrders;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield __1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const order = yield tx.order.update({
                where: { id: +req.params.id },
                data: {
                    status: req.body.status
                }
            });
            yield tx.orderEvent.create({
                data: {
                    orderId: order.id,
                    status: req.body.status
                }
            });
            res.json({ success: true, message: "Order status updated successfully", data: order });
        }
        catch (error) {
            throw new not_found_exception_1.NotFoundException('Order not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
        }
    }));
});
exports.changeStatus = changeStatus;
const listUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = parseInt(req.query.skip, 10) || 0;
    let whereClause = {
        userId: +req.params.id
    };
    const status = req.params.status;
    if (status) {
        whereClause = Object.assign(Object.assign({}, whereClause), { status });
    }
    const orders = yield __1.prismaClient.order.findMany({
        where: whereClause,
        skip: skip || 0,
        take: 5
    });
    res.json({ orders });
});
exports.listUserOrders = listUserOrders;
