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
exports.AdminMiddleware = void 0;
const unauthorized_exception_1 = require("../exceptions/unauthorized-exception");
const root_1 = require("../exceptions/root");
const AdminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return next(new unauthorized_exception_1.UnauthorizedException('User not authenticated', root_1.ErrorCodes.UNAUTHORIZED));
        }
        if (user.role == "ADMIN") {
            next();
        }
        else {
            next(new unauthorized_exception_1.UnauthorizedException('Restricted Access', root_1.ErrorCodes.UNAUTHORIZED));
        }
    }
    catch (err) {
        next(new unauthorized_exception_1.UnauthorizedException('Unauthorized request', root_1.ErrorCodes.UNAUTHORIZED));
    }
});
exports.AdminMiddleware = AdminMiddleware;
