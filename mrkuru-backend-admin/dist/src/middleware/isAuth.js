"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Received Headers:", req.headers); // Debugging
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized Access, Please Login" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res
                .status(401)
                .json({ message: "Unauthorized Access, No token available" });
            return;
        }
        // Decode token
        const decodedData = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decodedData || typeof decodedData === "string" || !decodedData.id) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        // Fetch user from database
        const user = yield prisma.users.findUnique({
            where: { userId: decodedData.id },
        });
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.user = user; // Attach user to request
        next(); // Proceed to next middleware/controller
    }
    catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({ message: "Unauthorized Access, Please Login" });
        return;
    }
});
exports.isAuth = isAuth;
