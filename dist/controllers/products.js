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
exports.searchProduct = exports.deleteProduct = exports.getProduct = exports.getProducts = exports.updateProduct = exports.addProduct = void 0;
const products_1 = require("../schema/products");
const __1 = require("..");
const not_found_exception_1 = require("../exceptions/not-found-exception");
const root_1 = require("../exceptions/root");
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    products_1.productSchema.parse(req.body);
    const product = yield __1.prismaClient.product.create({
        data: Object.assign(Object.assign({}, req.body), { tags: req.body.tags.join(',') })
    });
    res.json(product);
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',');
        }
        const updateProduct = yield __1.prismaClient.product.update({
            where: {
                id: +req.params.id,
            },
            data: product
        });
        res.json(updateProduct);
    }
    catch (error) {
        throw new not_found_exception_1.NotFoundException('Product not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
});
exports.updateProduct = updateProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = parseInt(req.query.skip, 10) || 0;
    const take = parseInt(req.query.take, 10) || 5;
    const counts = yield __1.prismaClient.product.count();
    const product = yield __1.prismaClient.product.findMany({
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' },
    });
    res.json({ data: product, totalCount: counts });
});
exports.getProducts = getProducts;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield __1.prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        });
        res.json(product);
    }
    catch (err) {
        throw new not_found_exception_1.NotFoundException('Product not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
});
exports.getProduct = getProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteProduct = yield __1.prismaClient.product.delete({
            where: { id: +req.params.id }
        });
        res.status(204).json({ "success": true, "message": "Product deleted successfully" });
    }
    catch (error) {
        throw new not_found_exception_1.NotFoundException('Product not found', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
});
exports.deleteProduct = deleteProduct;
const searchProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = parseInt(req.query.skip, 10) || 0;
    const take = parseInt(req.query.take, 10) || 5;
    const product = yield __1.prismaClient.product.findMany({
        where: {
            OR: [
                { name: { contains: req.query.q } },
                { description: { contains: req.query.q } },
                { tags: { contains: req.query.q } },
            ],
        },
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' },
    });
    res.json(product);
});
exports.searchProduct = searchProduct;
