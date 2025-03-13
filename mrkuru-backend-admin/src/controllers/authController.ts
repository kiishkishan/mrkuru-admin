import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
        expiresIn: "15m",
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

    res.json({
      message: "Product created successfully",
      newUser,
    });
  } catch (error) {
    console.error("Error processing product:", error);
    next(error);
  }
};
