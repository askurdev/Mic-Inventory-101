"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const controllers_1 = require("./controllers");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'UP' });
});
// app.use((req, res, next) => {
// 	const allowedOrigins = ['http://localhost:8081', 'http://127.0.0.1:8081'];
// 	const origin = req.headers.origin || '';
// 	if (allowedOrigins.includes(origin)) {
// 		res.setHeader('Access-Control-Allow-Origin', origin);
// 		next();
// 	} else {
// 		res.status(403).json({ message: 'Forbidden' });
// 	}
// });
// routes
app.post('/auth/register', controllers_1.userRegistration);
app.post('/auth/login', controllers_1.userLogin);
app.post('/auth/verify-token', controllers_1.verifyToken);
app.post('/auth/verify-email', controllers_1.verifyEmail);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Not found' });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});
const port = process.env.PORT || 3003;
const serviceName = process.env.SERVICE_NAME || 'Auth-Service';
app.listen(port, () => {
    console.log(`${serviceName} is running on port ${port}`);
});
// import express, { Request, Response, NextFunction } from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import morgan from 'morgan';
// import { userRegistration, verifyEmail, verifyToken,userLogin } from './controllers';
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(morgan('dev'));
// app.get('/health', (req, res) => {
//     res.status(200).json({ status: "UP" });
// });
// // Routes
// app.post('/auth/register', userRegistration);
// app.post('/auth/login', userLogin);
// app.post('/auth/verify-token', verifyToken)
// app.post('/auth/verify-email', verifyEmail);
// // // 404 handler
// app.use((_req, res) => {
//     res.status(404).json({ message: "not found" });
// });
// // Error handler
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(err.stack);
//     res.status(500).json({ message: "Internal server error" });
// });
// const port = process.env.PORT || 3003;
// const serviceName = process.env.SERVICE_NAME || 'Auth-Service';
// app.listen(port, () => {
//     console.log(`${serviceName} is running port ${port}`);
// });
//# sourceMappingURL=index.js.map