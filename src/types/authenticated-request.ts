// src/types/authenticatedRequest.ts
import { Request } from "express";
import { User } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
    user: User; // User is guaranteed here when using this type
}
