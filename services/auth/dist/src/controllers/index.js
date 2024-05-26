"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.userLogin = exports.userRegistration = exports.verifyToken = void 0;
var verifyToken_1 = require("./verifyToken");
Object.defineProperty(exports, "verifyToken", { enumerable: true, get: function () { return __importDefault(verifyToken_1).default; } });
var userRegistration_1 = require("./userRegistration");
Object.defineProperty(exports, "userRegistration", { enumerable: true, get: function () { return __importDefault(userRegistration_1).default; } });
var userLogin_1 = require("./userLogin");
Object.defineProperty(exports, "userLogin", { enumerable: true, get: function () { return __importDefault(userLogin_1).default; } });
var verifyEmail_1 = require("./verifyEmail");
Object.defineProperty(exports, "verifyEmail", { enumerable: true, get: function () { return __importDefault(verifyEmail_1).default; } });
// export { default as verifyToken} from './verifyToken';
// export { default as userRegistration} from './userRegistration';
// export { default as userLogin} from './userLogin';
// export { default as verifyEmail } from './verifyEmail';
//# sourceMappingURL=index.js.map