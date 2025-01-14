"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getUser = exports.signup = exports.login = void 0;
const __1 = require("..");
const bcrypt_1 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const secret_1 = require("../secret");
const bad_requests_1 = require("../exceptions/bad-requests");
const root_1 = require("../exceptions/root");
const users_1 = require("../schema/users");
const not_found_exception_1 = require("../exceptions/not-found-exception");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield __1.prismaClient.user.findFirst({ where: { email } });
    if (!user) {
        throw new not_found_exception_1.NotFoundException('Invalid Login Details', root_1.ErrorCodes.RESOURCE_NOT_FOUND);
    }
    if (!(0, bcrypt_1.compareSync)(password, user.password)) {
        throw new bad_requests_1.BadRequestsException("Invalid Login Details", root_1.ErrorCodes.USER_ALREADY_EXIST);
    }
    const token = jwt.sign({
        'userId': user.id
    }, secret_1.JWT_SECRET);
    res.json({ user, token });
});
exports.login = login;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    users_1.signupSchema.parse(req.body);
    const { email, password, name } = req.body;
    const user = yield __1.prismaClient.user.findFirst({ where: { email } });
    if (user) {
        throw new bad_requests_1.BadRequestsException("User already exist", root_1.ErrorCodes.USER_ALREADY_EXIST);
    }
    const newUser = yield __1.prismaClient.user.create({
        data: {
            email,
            name,
            password: (0, bcrypt_1.hashSync)(password, 10),
        }
    });
    res.json(newUser);
});
exports.signup = signup;
const getUser = (req, res, next) => {
    console.log(req);
    res.json(req.user);
};
exports.getUser = getUser;
