"use strict";
//message, Status Code, Error Code, Error
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(message, errorCode, statusCode, error) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.error = error;
        this.success = false;
    }
}
exports.HttpException = HttpException;
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["RESOURCE_NOT_FOUND"] = 100] = "RESOURCE_NOT_FOUND";
    ErrorCodes[ErrorCodes["USER_ALREADY_EXIST"] = 101] = "USER_ALREADY_EXIST";
    ErrorCodes[ErrorCodes["INCORRECT_PASSWORD"] = 102] = "INCORRECT_PASSWORD";
    ErrorCodes[ErrorCodes["UNPROCESSABLE_ENTITY"] = 103] = "UNPROCESSABLE_ENTITY";
    ErrorCodes[ErrorCodes["INTERNAL_EXCEPTION"] = 105] = "INTERNAL_EXCEPTION";
    ErrorCodes[ErrorCodes["UNAUTHORIZED"] = 106] = "UNAUTHORIZED";
    ErrorCodes[ErrorCodes["BAD_REQUEST"] = 107] = "BAD_REQUEST";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
