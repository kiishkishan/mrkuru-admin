"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const router = (0, express_1.Router)();
router.post("/login", authController_1.loginUser); // http://localhost:3000/auth/login
router.post("/refresh", authController_1.refreshToken); // http://localhost:3000/auth/refreshToken
router.post("/signup", multerConfig_1.default.single("profileImage"), authController_1.signUpUser); // http://localhost:3000/auth/signup
router.post("/logout", authController_1.logoutUser); // http://localhost:3000/auth/logout
exports.default = router;
