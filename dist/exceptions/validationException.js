"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const root_1 = require("./root");
class UnproccessableRequest extends root_1.HttpException {
    constructor(error, message, errorCode) {
        super(message, errorCode, 422, error);
    }
}
exports.default = UnproccessableRequest;
