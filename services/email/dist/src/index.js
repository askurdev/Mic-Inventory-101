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
app.get('/health', (req, res) => {
    res.status(200).json({ status: "UP" });
});
// Route
app.post('/emails/send', controllers_1.sendEmail);
app.get('/emails', controllers_1.getEmail);
// // 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: "not found" });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});
const port = process.env.PORT || 4002;
const serviceName = process.env.SERVICE_NAME || 'Email-Service';
app.listen(port, () => {
    console.log(`${serviceName} is running port ${port}`);
});
//# sourceMappingURL=index.js.map