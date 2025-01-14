import { NextFunction, Request, Response } from "express";
import { AddressSchema, updateUserSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found-exception";
import { ErrorCodes } from "../exceptions/root";
import { User } from "@prisma/client";
import { prismaClient } from "..";
import { UnauthorizedException } from "../exceptions/unauthorized-exception";
import { AuthenticatedRequest } from "../types/authenticated-request";
import { BadRequestsException } from "../exceptions/bad-requests";
import { string } from "zod";

export const addAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body)
    if (!req.user || !req.user.id) return new UnauthorizedException('Invalid User ID', ErrorCodes.UNAUTHORIZED)
    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: req.user.id,
        }
    })
    res.json(address);

}


export const listAddress = async (req: AuthenticatedRequest, res: Response) => {
    const addresses = await prismaClient.address.findMany({
        where: { userId: req.user.id },
        include: {
            user: false
        }
    })
    res.json(addresses);
}

export const deleteAddress = async (req: AuthenticatedRequest, res: Response) => {

    try {
        // if (!req.user || !req.user.id) return new UnauthorizedException('User not logged in', ErrorCodes.UNAUTHORIZED)
        await prismaClient.address.delete({ where: { id: +req.params.id, userId: req.user.id } })
        res.json({ success: true, message: 'Address Deleted Successfully' })
    } catch (err) {
        throw new NotFoundException('User Address not found', ErrorCodes.RESOURCE_NOT_FOUND)
    }

}

export const editUser = async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = updateUserSchema.parse(req.body)
    if (validatedData.defaultBillingAddressId) {
        try {
            const address = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: +validatedData.defaultBillingAddressId,
                    userId: req.user.id
                }
            })
            const updateInfo = await prismaClient.user.update({
                where: { id: req.user.id },
                data: +validatedData
            })
            res.json(updateInfo)
        } catch (err) {
            throw new BadRequestsException("Invalid Address ID", ErrorCodes.BAD_REQUEST)
        }
    }

    if (validatedData.defaultShippingAddressId) {
        try {
                await prismaClient.address.findFirstOrThrow({
                where: {
                    id: +validatedData.defaultShippingAddressId,
                    userId: req.user.id
                }
            })
            
            const updateInfo = await prismaClient.user.update({
                where: { id: req.user!.id },
                data: validatedData
            })
            res.json(updateInfo)
        } catch (err: any) {
            throw new BadRequestsException("An unexpected error occurred", ErrorCodes.BAD_REQUEST)
        }
    }
}

export const listUsers = async (req:AuthenticatedRequest, res:Response) => {
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const take = parseInt(req.query.take as string, 10) || 5;
    const user = await prismaClient.user.findMany({
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' },
    })
    res.json(user);
}
export const getUserById = async (req:AuthenticatedRequest, res:Response) => {
    try {
        const user = await prismaClient.user.findFirstOrThrow({
            where: { id: +req.params.id },
            include: {addresses: true }
        })
        res.json(user);

    } catch (err) {
        throw new NotFoundException('User not found', ErrorCodes.RESOURCE_NOT_FOUND)
    }

}
export const changeUserRole = async (req:AuthenticatedRequest, res:Response) => {
    try {
        const user = await prismaClient.user.update({
            where: { id: +req.params.id },
            data: {role: req.body.role }
        })
        res.json(user);
    } catch (err) {
        throw new NotFoundException('User not found', ErrorCodes.RESOURCE_NOT_FOUND)
    }
}

export const listAllOrders = async (req:AuthenticatedRequest, res: Response) => {
    const skip = parseInt(req.query.skip as string, 10) || 0;
    let whereClause = {}
    const status = req.query.status
    if (status) {
        whereClause = {status}
    }
    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: skip || 0,
        take: 5
    })
    res.json({orders})

}

export const changeStatus = async (req:AuthenticatedRequest, res: Response) => {
    return await prismaClient.$transaction(async (tx) => {
        try {
        const order = await tx.order.update({
          where : {id: +req.params.id},
          data: {
            status: req.body.status
          }
        })
        await tx.orderEvent.create({
            data: {
                orderId: order.id,
                status: req.body.status
            }

        })
        res.json({success: true, message: "Order status updated successfully", data: order})
      }
      catch (error) {
        throw new NotFoundException('Order not found', ErrorCodes.RESOURCE_NOT_FOUND)
      }

    })
    
   
}
export const listUserOrders = async (req:AuthenticatedRequest, res: Response) => {
    const skip = parseInt(req.query.skip as string, 10) || 0;
    let whereClause: any = {
        userId: +req.params.id
    }
    const status = req.params.status
    if (status) {
        whereClause = {
            ...whereClause,
            status
        }
    }
    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: skip || 0,
        take: 5
    })
    res.json({orders})
}