import { Router } from "express";
import { addAddress, changeStatus, changeUserRole, deleteAddress, editUser, getUserById, listAddress, listAllOrders, listUserOrders, listUsers } from "../controllers/user";
import { AuthMiddleware } from "../middlewares/auth";
import { tryAndCatch } from "../error-handler";
import { AdminMiddleware } from "../middlewares/admin";

const userRoutes:Router = Router();

userRoutes.post('/address', [AuthMiddleware], tryAndCatch(addAddress));
userRoutes.get('/address', [AuthMiddleware], tryAndCatch(listAddress));
userRoutes.delete('/address/:id', [AuthMiddleware], tryAndCatch(deleteAddress));
userRoutes.put('/edit-user', [AuthMiddleware], tryAndCatch(editUser));

userRoutes.get('/list-users', [AuthMiddleware, AdminMiddleware], tryAndCatch(listUsers));
userRoutes.get('/list-all-orders', [AuthMiddleware, AdminMiddleware], tryAndCatch(listAllOrders));
userRoutes.put('/change-user-role/:id', [AuthMiddleware, AdminMiddleware], tryAndCatch(changeUserRole));
userRoutes.get('/get-user-by-id/:id', [AuthMiddleware, AdminMiddleware], tryAndCatch(getUserById));
userRoutes.put('/change-order-status/:id', [AuthMiddleware, AdminMiddleware], tryAndCatch(changeStatus));
userRoutes.get('/list-user-orders/:id', [AuthMiddleware, AdminMiddleware], tryAndCatch(listUserOrders));




export default userRoutes;