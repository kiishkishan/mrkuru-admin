import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshToken,
  signUpUser,
} from "../controllers/authController";
import upload from "../config/multerConfig";

const router = Router();

router.post("/login", loginUser); // http://localhost:3000/auth/login
router.post("/refresh", refreshToken); // http://localhost:3000/auth/refreshToken
router.post("/signup", upload.single("profileImage"), signUpUser); // http://localhost:3000/auth/signup
router.post("/logout", logoutUser); // http://localhost:3000/auth/logout

export default router;
