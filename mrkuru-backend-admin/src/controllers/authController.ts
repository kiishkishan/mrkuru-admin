import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

const prisma = new PrismaClient();

// Configure the S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ message: "No user found with this email" });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(401).json({ message: "JWT Secret Key Error" });
      return;
    }

    const token = jwt.sign(
      { id: user.userId, userName: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      }
    );

    const { password: userPassword, ...userDetails } = user;

    res.status(201).json({
      message: "User logged in successfully",
      token,
      user: userDetails,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const signUpUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("File:", req.file);
    console.log("Body:", req.body);

    const { userId, userName, email, password, confirmPassword } = req.body;

    if (!userId || !userName || !email || !password || !confirmPassword) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Check if user exist
    const user = await prisma.users.findUnique({
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
      const compressedImageBuffer = await sharp(req.file.buffer)
        .resize(800) // Resize width to 800px
        .toFormat("webp") // Convert to WebP
        .webp({ quality: 80 }) // Set quality (0-100)
        .toBuffer();

      // Generate unique filename
      const fileKey = `profileImage_${userName}.webp`;

      // Upload to S3
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: fileKey,
          Body: compressedImageBuffer,
          ContentType: "image/webp",
        })
      );

      imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    } else {
      res.status(400).json({ error: "Profile image is required" });
      return;
    }

    // Store product in DB
    const newUser = await prisma.users.create({
      data: {
        userId,
        name: userName,
        email,
        password: await bcrypt.hash(password, 10),
        profileImage: imageUrl,
      },
    });

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_USER!,
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

    transporter.sendMail(mailOptions, (err: any, info: { response: any }) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({
      message: "Product created successfully",
      newUser,
    });
  } catch (error) {
    console.error("Error processing product:", error);
    next(error);
  }
};
