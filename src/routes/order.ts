import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { cancelOrder, createOrder, getOrderById, listOrders } from "../controllers/order";
import { tryAndCatch } from "../error-handler";
const orderRoutes:Router = Router();

orderRoutes.post('/', [AuthMiddleware], tryAndCatch(createOrder));
orderRoutes.get('/', [AuthMiddleware], tryAndCatch(listOrders));
orderRoutes.get('/:id', [AuthMiddleware], tryAndCatch(getOrderById));
orderRoutes.put('/:id', [AuthMiddleware], tryAndCatch(cancelOrder));

export default orderRoutes;