import { Response } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request";
import { createCartSchema, updateQuantitySchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found-exception";
import { ErrorCodes } from "../exceptions/root";
import { prismaClient } from "..";

export const addItemToCart = async (req: AuthenticatedRequest, res: Response) => {
  const validatedData = createCartSchema.parse(req.body)
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: { id: validatedData.productId }
    })
  } catch (err) {
    throw new NotFoundException('Product not found', ErrorCodes.RESOURCE_NOT_FOUND)
  }
  const itemExist = await prismaClient.cartItem.findFirst({
    where: {
      userId: req.user.id,
      productId: validatedData.productId
    }
  })
  if (itemExist) {
    const updateQuantity = await prismaClient.cartItem.update({ 
      where: {
        id: itemExist.id
      },
      data: {
        quantity: itemExist.quantity + 1
      }
    })
    return res.json(updateQuantity)
  }

  const cartItems = await prismaClient.cartItem.create({
    data: {
      productId: validatedData.productId,
      userId: req.user.id,
      quantity: validatedData.quantity
    }
  })
  res.json(cartItems)
}

export const removeItemFromCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
      await prismaClient.cartItem.delete({
        where: {
          id: +req.params.id,
          userId: req.user.id
        }
      })
      res.json({ success: true, message: 'Item removed from cart' })
  } catch (err) { 
    throw new NotFoundException('Cart Item not found', ErrorCodes.RESOURCE_NOT_FOUND)
  }

}

export const updateCartItemQuantity = async (req: AuthenticatedRequest, res: Response) => {

  const validatedData = updateQuantitySchema.parse(req.body)
  try {
  const updateCart = await prismaClient.cartItem.update({
    where: { id: +req.params.id },
    data: { quantity: validatedData.quantity }
  })
  res.json({sucess: true, message:"Cart Item quantity updated successfully", data: updateCart})
  }
  catch (err) {
    throw new NotFoundException('Cart Item not found', ErrorCodes.RESOURCE_NOT_FOUND)
  }
}
export const getCartItems = async (req: AuthenticatedRequest, res: Response) => {
  const cartItems = await prismaClient.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true }
  })
  res.status(200).json({"success": true, "message": "Items Fetched Successfully", "data": cartItems})

}

 