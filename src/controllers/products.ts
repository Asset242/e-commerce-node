import { Request, Response } from "express";

import { productSchema } from "../schema/products";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found-exception";
import { ErrorCodes } from "../exceptions/root";
import { AuthenticatedRequest } from "../types/authenticated-request";

export const addProduct = async (req: Request, res: Response) => {

    productSchema.parse(req.body)
    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(','),
        }
    })
    res.json(product)

}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body
        if (product.tags) {
            product.tags = product.tags.join(',')
        }
        const updateProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id,
            },
            data: product
        })
        res.json(updateProduct)
    } catch(error:any) {
        throw new NotFoundException('Product not found', ErrorCodes.RESOURCE_NOT_FOUND)
    }
}

export const getProducts = async (req: Request, res: Response) => {
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const take = parseInt(req.query.take as string, 10) || 5;

    const counts = await prismaClient.product.count();
    const product = await prismaClient.product.findMany({
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' },
    })
    res.json({ data: product, totalCount: counts });
}

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })
        res.json(product);
    } catch(err) {
        throw new NotFoundException('Product not found', ErrorCodes.RESOURCE_NOT_FOUND)
    }

}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deleteProduct = await prismaClient.product.delete({
            where: {id: +req.params.id}
        })
        res.status(204).json({"success": true, "message": "Product deleted successfully"});
    }catch(error:any) {
        throw new NotFoundException('Product not found', ErrorCodes.RESOURCE_NOT_FOUND)
    }
}

export const searchProduct = async (req: AuthenticatedRequest, res: Response) => {
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const take = parseInt(req.query.take as string, 10) || 5;

    const product = await prismaClient.product.findMany({
        where: {
            OR: [
                { name: { contains: req.query.q as string } },
                { description: { contains: req.query.q as string } },
                { tags: { contains: req.query.q as string } },
            ],
        },
        skip: skip,
        take: take,
        orderBy: { createdAt: 'desc' },
    })
    res.json(product)
}