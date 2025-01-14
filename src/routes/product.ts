import { Router } from "express";
import { addProduct, deleteProduct, getProduct, getProducts, searchProduct, updateProduct } from "../controllers/products";
import { tryAndCatch } from "../error-handler";
import { AuthMiddleware } from "../middlewares/auth";
import { AdminMiddleware } from "../middlewares/admin";


const productRoute:Router = Router();

productRoute.post('/',[AuthMiddleware], tryAndCatch(addProduct))
productRoute.get('/',[AuthMiddleware], tryAndCatch(getProducts))
productRoute.get('/search', [AuthMiddleware], tryAndCatch(searchProduct))
productRoute.put('/:id', [AuthMiddleware, AdminMiddleware], tryAndCatch(updateProduct))
productRoute.get('/:id', [AuthMiddleware, AdminMiddleware], tryAndCatch(getProduct))
productRoute.delete('/:id', [AuthMiddleware, AdminMiddleware], tryAndCatch(deleteProduct))

export default productRoute