import { Router } from "express";
import { getProductStatus } from "../controllers/productStatusController";
import { isAuth } from "../middleware/isAuth";

const router = Router();

router.use(isAuth);

router.get("/", getProductStatus);

export default router;
