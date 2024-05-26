"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("@/prisma"));
const schemas_1 = require("@/schemas");
const createLoginHistory = async (info) => {
    await prisma_1.default.loginHistory.create({
        data: {
            userId: info.userId,
            userAgent: info.userAgent,
            ipAddress: info.ipAddress,
            attempt: info.attempt,
        },
    });
};
const userLogin = async (req, res, next) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.ip || '';
        const userAgent = req.headers['user-agent'] || '';
        // Validate the request body
        const parsedBody = schemas_1.UserLoginSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ errors: parsedBody.error.errors });
        }
        // check if the user exists
        const user = await prisma_1.default.user.findUnique({
            where: {
                email: parsedBody.data.email,
            },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // compare password
        const isMatch = await bcryptjs_1.default.compare(parsedBody.data.password, user.password);
        if (!isMatch) {
            await createLoginHistory({
                userId: user.id,
                userAgent,
                ipAddress,
                attempt: 'FAILED',
            });
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // check if the user is verified
        if (!user.verified) {
            await createLoginHistory({
                userId: user.id,
                userAgent,
                ipAddress,
                attempt: 'FAILED',
            });
            return res.status(400).json({ message: 'User not verified' });
        }
        // check if the account is active
        if (user.status !== 'ACTIVE') {
            await createLoginHistory({
                userId: user.id,
                userAgent,
                ipAddress,
                attempt: 'FAILED',
            });
            return res.status(400).json({
                message: `Your account is ${user.status.toLocaleLowerCase()}`,
            });
        }
        console.log("JWT_SECRET", process.env.JWT_SECRET);
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET ?? 'My_Secret_Key', { expiresIn: '2h' });
        await createLoginHistory({
            userId: user.id,
            userAgent,
            ipAddress,
            attempt: 'SUCCESS',
        });
        return res.status(200).json({
            accessToken,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = userLogin;
// import { Response, Request,NextFunction } from "express";
// import prisma from '@/prisma';
// import { UserLoginSchema} from '@/schemas';
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import { LoginAttempt } from "@prisma/client";
// type LoginHistory = {
//     userId: string;
//     userAgent: string | undefined;
//     ipAddress: string | undefined;
//     attempt: LoginAttempt
// };
// const createLoginHistory = async (info: LoginHistory) => {
//     await prisma.loginHistory.create({
//         data: {
//             userId: info.userId,
//             userAgent: info.userAgent,
//             ipAddress: info.ipAddress,
//             attempt: info.attempt,
//         }
//     })
// }
// const userLogin = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const ipAddress = req.headers['x-forwarded-for'] as string || req.ip || '';
//         const userAgent = req.headers['user-agent'] || '';
//         // Validate the request Body
//         const parsedBody = UserLoginSchema.safeParse(req.body);
//         if (!parsedBody.success) {
//             return res.status(400).json({ errors: parsedBody.error.errors})
//         }
//         // check if the user exists
//         const user = await prisma.user.findFirst({
//             where: {
//                 email: parsedBody.data.email,
//             }  
//           });
//         if (!user) {
//             await createLoginHistory({
//                 userId: "Guest",
//                 userAgent,
//                 ipAddress,
//                 attempt: 'FAILED'
//             })
//             return res.status(400).json({ message: 'Invalid credentials'})
//         }
//         //compare password
//         const isMatch = await bcrypt.compare(parsedBody.data.password, user.password);
//         if (!isMatch) {
//                 await createLoginHistory({
//                     userId: user.id,
//                     userAgent,
//                     ipAddress,
//                     attempt: 'FAILED',
//                 })
//             return res.status(400).json({message: "Invalid credentials"})
//         }
//         // check if the user is verified
//         if (!user.verified) {
//             await createLoginHistory({
//                 userId: user.id,
//                 userAgent,
//                 ipAddress,
//                 attempt: 'FAILED',
//             });
//             return res.status(400).json({message: 'User not verified'})
//         }
//         // check if the account is active
//         if (user.status !== 'ACTIVE') {
//             await createLoginHistory({
//                 userId: user.id,
//                 userAgent,
//                 ipAddress,
//                 attempt: 'FAILED',
//             })
//             return res.status(400).json({ 
//                 message: 'Your account is ${user.status.toLocaleLowerCase()}',});
//     }
//         //Generate Access Token
//         const accessToken = jwt.sign(
//             {
//                 userId: user.id, email: user.email, name: user.name, role: user.role },
//                 process.env.JWT_SECRET ?? 'My_Secret_key',
//                 {expiresIn: '2h'}
//             );
//             await createLoginHistory({
//                 userId: user.id,
//                 userAgent,
//                 ipAddress,
//                 attempt: 'SUCCESS'
//             })
//             return res.status(200).json({
//                 accessToken,
//             });
//         } catch (error) {
//             next(error)
//         }
//     }
// export default userLogin;
//# sourceMappingURL=userLogin.js.map