import { ErrorCodes, HttpException } from "./root";

export class BadRequestsException extends HttpException {
    constructor(message: string, errorCodes: ErrorCodes) {
        super(message, errorCodes, 400, null);
    }
}