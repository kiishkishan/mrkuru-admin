import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  holdSellingProduct,
  // uploadImagetoS3,
} from "../controllers/productController";
import upload from "../config/multerConfig";

const router = Router();

router.get("/", getProducts);
// router.get("/uploadImagetoS3", uploadImagetoS3);
router.post("/", upload.single("image"), createProduct);
router.put("/hold-selling", holdSellingProduct);
router.delete("/", deleteProduct);

export default router;
