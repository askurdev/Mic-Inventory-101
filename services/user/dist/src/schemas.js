"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateSchema = exports.UserCreateSchema = void 0;
const zod_1 = require("zod");
exports.UserCreateSchema = zod_1.z.object({
    authUserId: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    address: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
});
// export const UserUpdateSchema = z.object({
//     id: z.string(),
//     name: z.string().optional(),
//     email: z.string().email().optional(),
//     address: z.string().optional(),
//     phone: z.string().optional(),
// });
exports.UserUpdateSchema = exports.UserCreateSchema.omit({
    authUserId: true,
}).partial();
//# sourceMappingURL=schemas.js.map