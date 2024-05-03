"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/prisma"));
const schemas_1 = require("@/schemas");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createLoginHistory = async (info) => {
    await prisma_1.default.loginHistory.create({
        data: {
            userId: info.userId,
            userAgent: info.userAgent,
            ipAddress: info.ipAddress,
            attempt: info.attempt,
        }
    });
};
const userLogin = async (req, res, next) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.ip || '';
        const userAgent = req.headers['user-agent'] || '';
        // Validate the request Body
        const parsedBody = schemas_1.UserLoginSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: parsedBody.error.errors });
        }
        // check if the user exists
        const user = await prisma_1.default.user.findFirst({
            where: { email: parsedBody.data.email },
        });
        if (!user) {
            await createLoginHistory({
                userId: "Guest",
                userAgent,
                ipAddress,
                attempt: 'FAILED'
            });
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        //compare password
        const isMatch = await bcryptjs_1.default.compare(parsedBody.data.password, user.password);
        if (!isMatch) {
            await createLoginHistory({
                userId: 'user.id',
                userAgent,
                ipAddress,
                attempt: 'FAILED'
            });
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // check if the user is verified
        if (!user.verified) {
            await createLoginHistory({
                userId: 'user.id',
                userAgent,
                ipAddress,
                attempt: 'FAILED'
            });
            return res.status(400).json({ message: 'User not verified' });
        }
        // check if the account is active
        if (user.status !== 'ACTIVE') {
            await createLoginHistory({
                userId: 'user.id',
                userAgent,
                ipAddress,
                attempt: 'FAILED'
            });
            return res.status(400).json({
                message: 'Your account is ${user.status.toLocaleLowerCase'
            });
        }
        //Generate Access Token
        const accessToken = jsonwebtoken_1.default.sign({
            userId: user.id, email: user.email, name: user.name, role: user.role
        }, process.env.JWT_SECRET ?? 'My_Secret_key', { expiresIn: '2h' });
        await createLoginHistory({
            userId: 'user.id',
            userAgent,
            ipAddress,
            attempt: 'SUCCESS'
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
//# sourceMappingURL=userLogin.js.map