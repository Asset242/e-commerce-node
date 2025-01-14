import { ErrorCodes, HttpException } from "./root";

export default class UnproccessableRequest extends HttpException {
    constructor(error: any, message: string, errorCode:ErrorCodes) {
        super(message, errorCode, 422, error)
    }
}