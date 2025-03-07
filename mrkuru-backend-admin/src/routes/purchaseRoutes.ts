import { Router } from "express";
import {
  getAllPurchases,
  getPurchaseStatus,
  getSuppliers,
  createPurchaseStatus,
  createSuppliers,
  deleteSupplier,
  deletePurchaseStatus,
  updatePurchaseStatus,
} from "../controllers/purchaseController";
import { loginUser } from "../controllers/authController";

const router = Router();

router.get("/suppliers", getSuppliers);
router.post("/suppliers", createSuppliers);
router.delete("/suppliers", deleteSupplier);
router.get("/purchaseStatus", getPurchaseStatus);
router.post("/purchaseStatus", createPurchaseStatus);
router.put("/purchaseStatus", updatePurchaseStatus);
router.delete("/purchaseStatus", deletePurchaseStatus);
router.get("/", getAllPurchases);

export default router;
