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
      },
    });
    res.status(200).json(purchases);
  } catch (error) {
    console.error("Error retrieving purchases:", error);
    res.status(500).json({ message: "Error retrieving purchases" });
  }
};
