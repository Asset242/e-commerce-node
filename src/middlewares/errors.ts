import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/root";

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    // console.log("Control reach here")
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errorcode: error.errorCode,
        error: Array.isArray(error.error) ? error.error : undefined,
    });
}