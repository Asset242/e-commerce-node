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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryAndCatch = void 0;
const root_1 = require("./exceptions/root");
const internal_exception_1 = require("./exceptions/internal-exception");
const zod_1 = require("zod");
const validationException_1 = __importDefault(require("./exceptions/validationException"));
const tryAndCatch = (method) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield method(req, res, next);
        }
        catch (err) {
            let exception;
            if (err instanceof root_1.HttpException) {
                exception = err;
            }
            else if (err instanceof zod_1.ZodError) {
                const errors = err.errors.map(e => {
                    const field = e.path.join(".");
                    return `${field.charAt(0).toUpperCase() + field.slice(1)} ${e.message.toLowerCase()}.`;
                });
                exception = new validationException_1.default(errors, "validationErrors", root_1.ErrorCodes.UNPROCESSABLE_ENTITY);
            }
            else {
                exception = new internal_exception_1.InternalException("Something went wrong", err, root_1.ErrorCodes.INTERNAL_EXCEPTION);
            }
            next(exception);
        }
    });
};
exports.tryAndCatch = tryAndCatch;
