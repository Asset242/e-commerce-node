"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const error_handler_1 = require("../error-handler");
const auth_1 = require("../middlewares/auth");
const authRoutes = (0, express_1.Router)();
authRoutes.post('/login', (0, error_handler_1.tryAndCatch)(authController_1.login));
authRoutes.post('/signup', (0, error_handler_1.tryAndCatch)(authController_1.signup));
authRoutes.get('/user', [auth_1.AuthMiddleware], authController_1.getUser);
exports.default = authRoutes;
