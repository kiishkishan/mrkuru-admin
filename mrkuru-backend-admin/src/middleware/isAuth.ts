import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extend Request type to include 'user'
interface AuthRequest extends Request {
  user?: any; // Adjust type as needed
}

export const isAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decodedData || typeof decodedData === "string" || !decodedData.id) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    // Fetch user from database
    const user = await prisma.users.findUnique({
      where: { userId: decodedData.id },
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user; // Attach user to request
    next(); // Proceed to next middleware/controller
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Unauthorized Access, Please Login" });
    return;
  }
};
