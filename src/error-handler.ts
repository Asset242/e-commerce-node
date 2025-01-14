import { NextFunction, Request, Response } from "express"
import { ErrorCodes, HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-exception"
import { ZodError } from "zod"
import UnproccessableRequest from "./exceptions/validationException"

export const tryAndCatch = (method: Function) => {
    return async (req:Request, res:Response, next:NextFunction) => {
        try {
           await method(req, res, next)
        }
        catch (err: any) {
            let exception: HttpException;
            if (err instanceof HttpException) {
                exception = err;
            } else if (err instanceof ZodError){
                const errors = err.errors.map(e => {
                    const field = e.path.join(".");
                    return `${field.charAt(0).toUpperCase() + field.slice(1)} ${e.message.toLowerCase()}.`;
                });
                exception = new UnproccessableRequest(errors, "validationErrors", ErrorCodes.UNPROCESSABLE_ENTITY);
            }else {
                exception = new InternalException("Something went wrong", err, ErrorCodes.INTERNAL_EXCEPTION)
            }
            next(exception)
        }
    }
}