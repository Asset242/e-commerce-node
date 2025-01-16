import { Router } from "express";
import { login, signup, getUser, getSingleUser } from "../controllers/authController";
import { tryAndCatch } from "../error-handler";
import { AuthMiddleware } from "../middlewares/auth";


const authRoutes:Router = Router()

authRoutes.post('/login', tryAndCatch(login))
authRoutes.post('/signup', signup)
authRoutes.get('/user', [AuthMiddleware], getUser)
authRoutes.get('/user/:id', tryAndCatch(getSingleUser))


export default authRoutes;