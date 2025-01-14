import { NextFunction, Request, Response } from "express"
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";
import UnproccessableRequest from "../exceptions/validationException";
import { signupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found-exception";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prismaClient.user.findFirst({ where: { email } })

    if (!user) {
        throw new NotFoundException('Invalid Login Details', ErrorCodes.RESOURCE_NOT_FOUND)
    }

    if (!compareSync(password, user.password)) {
        throw new BadRequestsException("Invalid Login Details", ErrorCodes.USER_ALREADY_EXIST)
    }

    const token = jwt.sign({
        'userId': user.id
    }, JWT_SECRET)

    res.json({ user, token })
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    signupSchema.parse(req.body)
    const { email, password, name } = req.body;

    const user = await prismaClient.user.findFirst({ where: { email } })

    if (user) {
        throw new BadRequestsException("User already exist", ErrorCodes.USER_ALREADY_EXIST)
    }

    const newUser = await prismaClient.user.create({
        data: {
            email,
            name,
            password: hashSync(password, 10),
        }
    })
    res.json(newUser);
}

export const getUser = (req:Request, res:Response, next:NextFunction) => {
    console.log(req)
    res.json(req.user)
}

