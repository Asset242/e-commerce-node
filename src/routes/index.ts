import { Router } from "express";
import authRoutes from "./auth";
import productRoute from "./product";
import userRoutes from "./user";
import cartRoutes from "./cart";
import orderRoutes from "./order";

const rootRoutes:Router = Router();

rootRoutes.use('/auth',  authRoutes)
rootRoutes.use('/products', productRoute)
rootRoutes.use('/user', userRoutes)
rootRoutes.use('/cart', cartRoutes)
rootRoutes.use('/order', orderRoutes)

export default rootRoutes;