import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { userId: string; userName: string };
}

// ✅ Protect routes by checking the access token
export const isAuthVerifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access token missing or invalid" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      userName: string;
    };
    req.user = { userId: decoded.userId, userName: decoded.userName };
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
