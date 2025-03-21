import { Router } from "express";
import { getProductStatus } from "../controllers/productStatusController";
import { isAuthVerifyToken } from "../middleware/isAuth";

const router = Router();

router.use(isAuthVerifyToken);

router.get("/", getProductStatus);

export default router;
