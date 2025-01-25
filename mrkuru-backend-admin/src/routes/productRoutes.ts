import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  holdSellingProduct,
} from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/hold-selling", holdSellingProduct);
router.delete("/", deleteProduct);

export default router;
