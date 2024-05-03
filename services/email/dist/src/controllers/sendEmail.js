"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/prisma"));
const schemas_1 = require("@/schemas");
const config_1 = require("@/config");
const sendEmail = async (req, res, next) => {
    try {
        // Validate the request body
        const parsedBody = schemas_1.EmailCreateSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ errors: parsedBody.error.errors });
        }
        // create mail option
        const { sender, recipient, subject, body, source } = parsedBody.data;
        const from = sender || config_1.defaultSender;
        const emailOption = {
            from,
            to: recipient,
            subject,
            text: body,
        };
        // send the email
        const { rejected } = await config_1.transporter.sendMail(emailOption);
        if (rejected.length) {
            console.log('Email rejected:', rejected);
            return res.status(500).json({ message: 'Failed' });
        }
        await prisma_1.default.email.create({
            data: {
                sender: from,
                recipient,
                subject,
                body,
                source,
            }
        });
        return res.status(200).json({ message: 'Email sent' });
    }
    catch (error) {
        next(error);
    }
};
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map