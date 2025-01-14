"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const root_1 = require("./root");
class NotFoundException extends root_1.HttpException {
    constructor(message, errorCodes) {
        super(message, errorCodes, 404, null);
    }
}
exports.NotFoundException = NotFoundException;
