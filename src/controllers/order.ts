import { Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found-exception";
import { ErrorCodes } from "../exceptions/root";

export const createOrder = async (req:AuthenticatedRequest, res:Response) => {

  return await prismaClient.$transaction(async (tx: any) => {
    const cart = await tx.cartItem.findMany({
      where: {userId: req.user.id},
      include: {product: true}
    })
    if (cart.length == 0) {
      return res.status(400).json({message: "Cart is empty"})
    }

    const price = cart.reduce((prev:any, current:any) => {
      return prev + (current.quantity * Number(current.product.price))
    }, 0)
    // return res.status(200).json(price)

    const address = req.user.defaultShippingAddressId ? await tx.address.findFirst({where: {id: req.user.defaultShippingAddressId}}) : null
    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address? address.formattedAddress : '',
        status: "CREATION",
        products: {
          create: cart.map((item:any) => {
            return {
              productId: item.productId,
              quantity: item.quantity
            }                  
            })
        }
      }
    })

    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      }
    })
    await prismaClient.cartItem.deleteMany({
      where: { userId: req.user.id }
    })
    return res.json({mesaage: "Order placed successfully", data: order})
  })

}
export const listOrders = async (req:AuthenticatedRequest, res:Response) => {
  const orders = await prismaClient.order.findMany({
    where: { userId: req.user.id },
    include: {
      products: true,
      events: true,
    }
  })
  res.json({success: true, message: "Orders fetched successfully", data: orders})

}

export const cancelOrder = async (req:AuthenticatedRequest, res:Response) => {
  try {
    const order = await prismaClient.order.update({
      where: { id: +req.params.id },
      data: { status: "CANCELLED" }
    })
    await prismaClient.orderEvent.create({
      data: { orderId: order.id, status: "CANCELLED" }
    })
    res.json({success: true, message: "Order cancelled successfully", data: order})
  }
  catch (error) {
    throw new NotFoundException('Order not found', ErrorCodes.RESOURCE_NOT_FOUND)
  }
}
export const getOrderById = async (req:AuthenticatedRequest, res:Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where : {id: +req.params.id},
      include: {
        products: true,
        events: true,
      }
    })
    res.json({success: true, message: "Order fetched successfully", data: order})
  }
  catch (error) {
    throw new NotFoundException('Order not found', ErrorCodes.RESOURCE_NOT_FOUND)
  }
}