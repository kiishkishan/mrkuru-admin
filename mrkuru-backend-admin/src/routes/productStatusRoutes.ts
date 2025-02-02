import { Router } from "express";
import { getProductStatus } from "../controllers/productStatusController";

const router = Router();

router.get("/", getProductStatus);

export default router;
