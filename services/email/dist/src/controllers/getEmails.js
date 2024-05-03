"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/prisma"));
const getEmail = async (_req, res, next) => {
    try {
        const emails = await prisma_1.default.email.findMany();
        res.json(emails);
    }
    catch (error) {
        next(error);
    }
};
exports.default = getEmail;
//# sourceMappingURL=getEmails.js.map