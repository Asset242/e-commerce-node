import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { tryAndCatch } from "../error-handler";
import { addItemToCart, getCartItems, removeItemFromCart, updateCartItemQuantity } from "../controllers/cart";

const cartRoutes: Router = Router();

cartRoutes.post('/', [AuthMiddleware], tryAndCatch(addItemToCart))
cartRoutes.get('/', [AuthMiddleware], tryAndCatch(getCartItems))
cartRoutes.put('/:id', [AuthMiddleware], tryAndCatch(updateCartItemQuantity))
cartRoutes.delete('/:id', [AuthMiddleware], tryAndCatch(removeItemFromCart))

export default cartRoutes;