"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const secret_1 = require("./secret");
const routes_1 = __importDefault(require("./routes"));
const client_1 = require("@prisma/client");
const errors_1 = require("./middlewares/errors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', routes_1.default);
exports.prismaClient = new client_1.PrismaClient({
    log: ['query']
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: (addr) => {
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}, ${addr.pincode}`;
                }
            }
        }
    }
});
app.use(errors_1.errorMiddleware);
app.listen(secret_1.PORT, () => { console.log(`Server is running on port ${secret_1.PORT}`); });
