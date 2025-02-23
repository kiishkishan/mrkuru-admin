import { Router } from "express";
import {
  getAllPurchases,
  getPurchaseStatus,
  getSuppliers,
} from "../controllers/purchaseController";

const router = Router();

router.get("/suppliers", getSuppliers);
router.get("/purchaseStatus", getPurchaseStatus);
router.get("/", getAllPurchases);

export default router;
