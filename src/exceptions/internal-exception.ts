import { ErrorCodes, HttpException } from "./root";

export class InternalException extends HttpException {
    constructor (message: string, error: any, errorCodes: ErrorCodes) {
        super(message, errorCodes, 500, error)
    }
}