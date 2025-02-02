import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Prisma Client instance

export const getProductStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productStatuses = await prisma.productStatus.findMany({
      select: {
        productStatusId: true,
        status: true,
      },
    });

    res.json(productStatuses);
  } catch (error) {
    console.error("Error retrieving product statuses:", error);
    res.status(500).json({ message: "Error retrieving product statuses" });
  }
};
