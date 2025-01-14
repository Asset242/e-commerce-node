import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized-exception";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { prismaClient } from "..";


export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    if (!token) return next(new UnauthorizedException('Authorization Token Missing', ErrorCodes.UNAUTHORIZED));
    try {
        const payload = jwt.verify(token, JWT_SECRET) as any 
        const user = await prismaClient.user.findFirst({where: {id: payload.userId}})
        if (!user) return next(new UnauthorizedException('Invalid Token', ErrorCodes.UNAUTHORIZED));
        req.user = user;
        next()
    }
    catch (err) {
        next(new UnauthorizedException('Unauthorized request', ErrorCodes.UNAUTHORIZED));
    }
} 