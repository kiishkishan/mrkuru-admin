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
exports.signUpUser = exports.loginUser = void 0;
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
        const token = jsonwebtoken_1.default.sign({ id: user.userId, userName: user.name }, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });
        const { password: userPassword } = user, userDetails = __rest(user, ["password"]);
        res.status(201).json({
            message: "User logged in successfully",
            token,
            user: userDetails,
        });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});
exports.loginUser = loginUser;
const signUpUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("File:", req.file);
        console.log("Body:", req.body);
        const { userId, userName, email, password, confirmPassword } = req.body;
        if (!userId || !userName || !email || !password || !confirmPassword) {
            res.status(400).json({ error: "Missing required fields" });
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
            subject: "Welcome to Our Platform!",
            html: `
        <h1>Welcome, ${userName}!</h1>
        <p>We're excited to have you on board. Start exploring and enjoy your journey with us.</p>
        <p>If you have any questions, feel free to contact us.</p>
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
