import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized-exception";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { prismaClient } from "..";


export const AdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return next(new UnauthorizedException('User not authenticated', ErrorCodes.UNAUTHORIZED));
        }
        if (user.role == "ADMIN") {
            next()
        } else {
            next(new UnauthorizedException('Restricted Access', ErrorCodes.UNAUTHORIZED))
        }
    }
    catch (err) {
        next(new UnauthorizedException('Unauthorized request', ErrorCodes.UNAUTHORIZED));
    }
} 