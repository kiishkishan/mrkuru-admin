import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const search = req.query.search?.toString();
    const suppliers = await prisma.suppliers.findMany({
      where: {
        supplierName: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        supplierName: "asc",
      },
      select: {
        supplierId: true,
        supplierName: true,
        supplierContact: true,
        supplierAddress: true,
      },
    });
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error retrieving suppliers:", error);
    res.status(500).json({ message: "Error retrieving suppliers" });
  }
};

export const createSuppliers = async (req: Request, res: Response) => {
  try {
    const { supplierId, supplierName, supplierContact, supplierAddress } =
      req.body;

    console.log("createSuppliers", req.body);

    if (!supplierId || !supplierName || !supplierContact || !supplierAddress) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const newSupplier = await prisma.suppliers.create({
      data: {
        supplierId,
        supplierName,
        supplierContact,
        supplierAddress,
      },
    });
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error("Error creating supplier:", error);
    res.status(500).json({ message: "Error creating supplier" });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const { supplierId } = req.body;

    console.log("deleteSupplier supplierId", supplierId);

    if (!supplierId) {
      res.status(400).json({ error: "Missing required field: supplierId" });
      return;
    }

    // Check if any purchase exists linked to this supplier
    const existingPurchase = await prisma.purchases.findFirst({
      where: {
        Suppliers: {
          supplierId: supplierId,
        },
      },
    });

    if (existingPurchase) {
      res
        .status(400)
        .send(
          "Cannot delete supplier. There are purchases linked to this supplier."
        );
      return;
    }

    const deletedSupplier = await prisma.suppliers.delete({
      where: {
        supplierId,
      },
    });
    res.status(200).json(deletedSupplier);
  } catch (error: any) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({
      message: "Error deleting supplier",
      error: error.message,
    });
  }
};

export const deletePurchaseStatus = async (req: Request, res: Response) => {
  try {
    const { purchaseStatusId } = req.body;

    console.log("deletePurchaseStatus purchaseStatusId", purchaseStatusId);

    if (!purchaseStatusId) {
      res
        .status(400)
        .json({ error: "Missing required field: purchaseStatusId" });
      return;
    }

    // Check if any purchase exists linked to this Purchase Status
    const existingPurchase = await prisma.purchases.findFirst({
      where: {
        PurchaseStatus: {
          purchaseStatusId: purchaseStatusId,
        },
      },
    });
    console.log("existingPurchase", existingPurchase);

    if (existingPurchase) {
      res
        .status(400)
        .send(
          "Cannot delete purchase status. There are purchases linked to this purchase status."
        );
      return;
    }

    const deletedPurchaseStatus = await prisma.purchaseStatus.delete({
      where: {
        purchaseStatusId,
      },
    });
    res.status(200).json(deletedPurchaseStatus);
  } catch (error: any) {
    console.error("Error deleting Purchase Status:", error);
    res.status(500).json({
      message: "Error deleting Purchase Status",
      error: error.message,
    });
  }
};

export const getPurchaseStatus = async (req: Request, res: Response) => {
  try {
    const search = req.query.search?.toString();
    const purchaseStatus = await prisma.purchaseStatus.findMany({
      where: {
        status: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        status: "asc",
      },
      select: {
        purchaseStatusId: true,
        status: true,
      },
    });
    res.status(200).json(purchaseStatus);
  } catch (error) {
    console.error("Error retrieving purchaseStatuses:", error);
    res.status(500).json({ message: "Error retrieving purchaseStatuses" });
  }
};

export const createPurchaseStatus = async (req: Request, res: Response) => {
  try {
    const { purchaseStatusId, status } = req.body;

    if (!purchaseStatusId || !status) {
      res.status(400).json({ error: "Missing required field: status" });
      return;
    }

    const newPurchaseStatus = await prisma.purchaseStatus.create({
      data: {
        purchaseStatusId,
        status,
      },
    });
    res.status(201).json(newPurchaseStatus);
  } catch (error) {
    console.error("Error creating purchase status:", error);
    res.status(500).json({ message: "Error creating purchase status" });
  }
};

export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await prisma.purchases.findMany({
      orderBy: {
        timeStamp: "desc",
      },
      select: {
        purchaseId: true,
        timeStamp: true,
        Suppliers: {
          select: {
            supplierId: true,
            supplierName: true,
            supplierAddress: true,
            supplierContact: true,
          },
        },
        PurchaseStatus: {
          select: {
            purchaseStatusId: true,
            status: true,
          },
        },
        PurchaseDetails: {
          select: {
            purchaseDetailsId: true,
            unitPrice: true,
            quantity: true,
            totalPrice: true,
            Products: {
              select: {
                productId: true,
                name: true,
                price: true,
                stockQuantity: true,
              },
            },
          },
        },
        subTotal: true,
        amountPaid: true,
        shippingFee: true,
        totalAmount: true,
      },
    });
    res.status(200).json(purchases);
  } catch (error) {
    console.error("Error retrieving purchases:", error);
    res.status(500).json({ message: "Error retrieving purchases" });
  }
};
