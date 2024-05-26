"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/prisma"));
//user/:id?field-id|authUserId
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const field = req.query.field;
        let user = null;
        if (field === 'authUserId') {
            user = await prisma_1.default.user.findUnique({ where: { authUserId: id } });
        }
        else {
            user = await prisma_1.default.user.findUnique({ where: { id } });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.default = getUserById;
//# sourceMappingURL=getUserById.js.map