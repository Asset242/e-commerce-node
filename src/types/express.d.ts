import { User } from "@prisma/client";
import express from "express";

declare module 'express' {
    export interface Request {
        user?: User;
    }
}
// 
// import { User } from "@prisma/client";
// 
// declare global {
    // namespace Express {
        // interface Request {
            // user?: User;
        // }
    // }
// }
// 
// export {};