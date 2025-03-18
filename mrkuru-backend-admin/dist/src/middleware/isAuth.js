"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthVerifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ✅ Protect routes by checking the access token
const isAuthVerifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Access token missing or invalid" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId, userName: decoded.userName };
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.isAuthVerifyToken = isAuthVerifyToken;
