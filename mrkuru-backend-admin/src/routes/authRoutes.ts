import { Router } from "express";
import { loginUser, signUpUser } from "../controllers/authController";
import upload from "../config/multerConfig";

const router = Router();

router.post("/login", loginUser); // http://localhost:3000/auth/login
router.post("/signup", upload.single("profileImage"), signUpUser); // http://localhost:3000/auth/signup

export default router;
