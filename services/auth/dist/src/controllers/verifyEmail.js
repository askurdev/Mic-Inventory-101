"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/prisma"));
const schemas_1 = require("@/schemas");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("@/config");
const verifyEmail = async (req, res, next) => {
    try {
        // Validate the request body
        const parsedBody = schemas_1.EmailVerificationSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ errors: parsedBody.error.errors });
        }
        // check if the user with email exists
        const user = await prisma_1.default.user.findUnique({
            where: { email: parsedBody.data.email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // find the verification code
        const verificationCode = await prisma_1.default.verificationCode.findFirst({
            where: {
                userId: user.id,
                code: parsedBody.data.code,
            },
        });
        if (!verificationCode) {
            return res.status(404).json({ message: 'Invalid verification code' });
        }
        // if the code has expired
        if (verificationCode.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Verification code expired' });
        }
        // update user status to verified
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { verified: true, status: 'ACTIVE' },
        });
        // update verification code status to used
        await prisma_1.default.verificationCode.update({
            where: { id: verificationCode.id },
            data: { status: 'USED', verifiedAt: new Date() },
        });
        // send success email
        await axios_1.default.post(`${config_1.EMAIL_SERVICE}/emails/send`, {
            recipient: user.email,
            subject: 'Email Verified',
            body: 'Your email has been verified successfully',
            source: 'verify-email',
        });
        return res.status(200).json({ message: 'Email verified successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.default = verifyEmail;
// import { Request, Response, NextFunction } from "express";
// import prisma from '@/prisma'
// import { EmailVerificationSchema } from "@/schemas";
// import axios from "axios";
// import { EMAIL_SERVICE } from '@/config';
// const verifyEmail = async (
//     req: Request,
//     res: Response,
//     next:NextFunction
// ) => {
//     try {
//         // validate the request body
//         const parsedBody = EmailVerificationSchema.safeParse(req.body);
//         if (!parsedBody.success) {
//             return res.status(400).json({errors: parsedBody.error.errors});
//         }
//         // check if the user with email exists
//         const user = await prisma.user.findFirst({
//             where: {email: parsedBody.data.email},
//         });
//         if (!user) {
//             return res.status(404).json({message: 'User not found'})
//         }
//         //find the verification code
//         const verificationCode = await prisma.verificationCode.findFirst({
//             where: {
//                 userId: user.id,
//                 code: parsedBody.data.code,
//             }
//         });
//         if (!verificationCode) {
//             return res.status(404).json({message: 'Invalid Verification code'})
//         }
//         // if the code has expired
//         if (verificationCode.expiresAt <new Date()) {
//             return res.status(404).json({message: 'Verification code expired'})
//         }
//         // update user status to verified
//         await prisma.user.update({
//             where: {id:user.id},
//             data: {verified:true,status:'ACTIVE'}
//         });
//         // update verification code status to used
//         await prisma.verificationCode.update({
//             where: {id: verificationCode.id},
//             data: {status: 'USED',verifiedAt: new Date()},
//         })
//         // send success email
//         await axios.post(`${EMAIL_SERVICE}/emails/send`,{
//             recipient: user.email,
//             subject: 'Email Verified',
//             body: 'Your email has been verified successfully',
//             source: 'verify-email',
//         });
//         return res.status(200).json({message: 'Email verified successfully'})
//     } catch (error) {
//         next(error);
//     }
// }
// export default verifyEmail;
//# sourceMappingURL=verifyEmail.js.map