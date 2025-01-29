import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient(); // Prisma Client instance

export const getProductStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();

    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      select: {
        productId: true,
        name: true,
        price: true,
        rating: true,
        stockQuantity: true,
        details: true,
        imageUrl: true,
        ProductStatus: {
          select: {
            productStatusId: true,
            status: true,
          },
        },
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};
