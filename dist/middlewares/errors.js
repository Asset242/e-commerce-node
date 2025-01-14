"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (error, req, res, next) => {
    // console.log("Control reach here")
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errorcode: error.errorCode,
        error: Array.isArray(error.error) ? error.error : undefined,
    });
};
exports.errorMiddleware = errorMiddleware;
