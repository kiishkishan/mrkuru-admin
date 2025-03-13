import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  holdSellingProduct,
} from "../controllers/productController";
import upload from "../config/multerConfig";
import { isAuth } from "../middleware/isAuth";

const router = Router();

router.use(isAuth);

router.get("/", getProducts);
router.post("/", upload.single("image"), createProduct);
router.put("/hold-selling", holdSellingProduct);
router.delete("/", deleteProduct);

export default router;
