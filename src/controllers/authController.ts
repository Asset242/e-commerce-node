import { NextFunction, request, Request, Response } from "express"
import { prismaClient } from "..";
// import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secret";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";
import UnproccessableRequest from "../exceptions/validationException";
import { signupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found-exception";
import { json } from "stream/consumers";
import { getUserById } from "./user";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prismaClient.user.findFirst({ where: { email } })

    if (!user) {
        throw new NotFoundException('Invalid Login Details', ErrorCodes.RESOURCE_NOT_FOUND)
    }

    // if (!compareSync(password, user.password)) {
    //     throw new BadRequestsException("Invalid Login Details", ErrorCodes.USER_ALREADY_EXIST)
    // }

    const token = jwt.sign({
        'userId': user.id
    }, JWT_SECRET)

    res.json({ user, token })
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
            // password: hashSync(password, 10),
            password,
        }
    })
    res.json(newUser);
    } catch (err: any) {
        // next(new UnproccessableRequest(err, "Invalid Signup Details", ErrorCodes.UNPROCESSABLE_ENTITY))
        res.status(400).json({
            error: err.message,
            message: "Error occurred",
            statusCode: 422
        })
    }
    
}

export const getUser = (req:Request, res:Response, next:NextFunction) => {
    // console.log(req)
    res.json(req.user)
}

export const getSingleUser = async (req:Request, res:Response, next:NextFunction) => {
    const userId = parseInt(req.params.id)
    const user = await prismaClient.user.findUnique({ where: { id: userId } })
    res.json(user)
}

