import { Router } from "express";
import { login, signup, getUser } from "../controllers/authController";
import { tryAndCatch } from "../error-handler";
import { AuthMiddleware } from "../middlewares/auth";


const authRoutes:Router = Router()

authRoutes.post('/login', tryAndCatch(login))
authRoutes.post('/signup', tryAndCatch(signup))
authRoutes.get('/user', [AuthMiddleware], getUser)


export default authRoutes;