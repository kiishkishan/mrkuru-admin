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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.signUpUser = exports.refreshToken = exports.loginUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sharp_1 = __importDefault(require("sharp"));
const client_s3_1 = require("@aws-sdk/client-s3");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const prisma = new client_1.PrismaClient();
// Configure the S3 client
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
// Set Refresh Token as HTTP-Only Cookie
const setRefreshTokenCookie = (res, token) => {
    res.cookie("refreshToken", token, {
        httpOnly: true, // Set to true for production
        secure: process.env.COOKIE_SECURE === "true", // Uses a dedicated env variable
        sameSite: "none",
        path: "/auth/refresh",
        // domain: process.env.COOKIE_DOMAIN || "http://localhost:3000", // Set to your domain in production
        maxAge: 5 * 60 * 60 * 1000, // 5 hours
    });
};
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        // Find user by email
        const user = yield prisma.users.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(400).json({ message: "No user found with this email" });
            return;
        }
        // Verify password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }
        if (!process.env.JWT_SECRET) {
            res.status(401).json({ message: "JWT Secret Key Error" });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.userId, userName: user.name }, process.env.JWT_SECRET, {
            expiresIn: "10m",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.userId, userName: user.name }, process.env.REFRESH_SECRET, {
            expiresIn: "5h",
        });
        setRefreshTokenCookie(res, refreshToken);
        const { password: userPassword } = user, userDetails = __rest(user, ["password"]);
        res.status(201).json({
            message: "User logged in successfully",
            accessToken,
            refreshToken, // only in development
            user: userDetails,
        });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});
exports.loginUser = loginUser;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { refreshToken } = req.cookies; // for local
        const cookies = req.cookies;
        const refreshToken = Object.values(cookies).find((cookie) => cookie.includes(".") // JWT always contains dots (.)
        );
        console.log("Detected refreshToken:", refreshToken);
        if (!refreshToken) {
            res.status(401).json({ message: "No refresh token found from request" });
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json({ message: "Invalid refresh token" });
                return;
            }
            const accessToken = jsonwebtoken_1.default.sign({ id: decoded.userId, userName: decoded.name }, process.env.JWT_SECRET, { expiresIn: "15m" });
            console.log("refreshToken func accessToken", accessToken);
            return res.json({ accessToken });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.refreshToken = refreshToken;
const signUpUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("File:", req.file);
        console.log("Body:", req.body);
        const { userId, userName, email, password, confirmPassword } = req.body;
        if (!userId || !userName || !email || !password || !confirmPassword) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        // Check if user exist
        const user = yield prisma.users.findUnique({
            where: { email },
        });
        console.log(user, "User");
        if (user) {
            res.status(400).json({ error: "User already exists" });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({ error: "Passwords do not match" });
            return;
        }
        let imageUrl = "";
        if (req.file) {
            const compressedImageBuffer = yield (0, sharp_1.default)(req.file.buffer)
                .resize(800) // Resize width to 800px
                .toFormat("webp") // Convert to WebP
                .webp({ quality: 80 }) // Set quality (0-100)
                .toBuffer();
            // Generate unique filename
            const fileKey = `profileImage_${userName}.webp`;
            // Upload to S3
            yield s3.send(new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileKey,
                Body: compressedImageBuffer,
                ContentType: "image/webp",
            }));
            imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        }
        else {
            res.status(400).json({ error: "Profile image is required" });
            return;
        }
        // Store product in DB
        const newUser = yield prisma.users.create({
            data: {
                userId,
                name: userName,
                email,
                password: yield bcryptjs_1.default.hash(password, 10),
                profileImage: imageUrl,
            },
        });
        // Send welcome email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `🎉 Welcome to Our Platform, ${userName}! 🚀`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; text-align: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #4CAF50;">Welcome to Our Portal, ${userName}! 🎊</h1>
          <p style="font-size: 16px; color: #333;">We're absolutely thrilled to have you onboard! 🌟</p>
          <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" alt="Welcome GIF" width="100" />
          <p style="font-size: 14px; color: #555; margin-top: 10px;">
            🚀 Get ready to explore amazing features and unlock exciting opportunities.<br />
            Need help? Our team is here for you. Don't hesitate to <a href="mailto:mrkuru07@gmail.com" style="color: #4CAF50; text-decoration: none;">reach out</a>. 💡
          </p>
          <div style="margin-top: 20px;">
            <a href="https://mrkuru-admin-frontend-rho.vercel.app//dashboard" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Go to Dashboard</a>
          </div>
          <p style="font-size: 12px; color: #777; margin-top: 20px;">Happy Exploring!<br/>- The Team 🚀</p>
        </div>
      `,
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error sending email:", err);
            }
            else {
                console.log("Email sent:", info.response);
            }
        });
        res.json({
            message: "Product created successfully",
            newUser,
        });
    }
    catch (error) {
        console.error("Error processing product:", error);
        next(error);
    }
});
exports.signUpUser = signUpUser;
const logoutUser = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: "strict",
        path: "/auth/refresh",
        domain: process.env.COOKIE_DOMAIN || undefined,
    });
    res.json({ message: "Logged out successfully" });
};
exports.logoutUser = logoutUser;
