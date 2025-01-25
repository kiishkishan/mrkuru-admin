import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient(); // Prisma Client instance

export const getProducts = async (
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

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productId, name, price, rating, stockQuantity, details } = req.body;
  try {
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
        details,
        ProductStatus: {
          connect: { productStatusId: "0d9921b7-df37-4d8d-89a0-31a00259ca8b" }, // Always set to 'In Stock'
        },
      },
    });
    res.status(201).json(product);
  } catch (error: any) {
    console.error("Error creating product:", error); // Logs the complete error to the console
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": // Unique constraint violation to find the exact issue
          res.status(400).json({
            message:
              "A product with the same unique identifier already exists.",
          });
          break;
        default:
          res.status(400).json({
            message: `Prisma error: ${error.message}`,
          });
      }
    } else {
      res.status(500).json({
        message: "An unexpected error occurred.",
        error: error.message,
      });
    }
  }
};

export const holdSellingProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.body;

    // Validate the request
    if (!productId) {
      res.status(400).json({ message: "Product ID is required." });
      return;
    }

    // Fetch the current product's status and stock quantity
    const currentProduct = await prisma.products.findUnique({
      where: { productId },
      select: {
        stockQuantity: true,
        ProductStatus: {
          select: {
            productStatusId: true,
            status: true,
          },
        },
      },
    });

    if (!currentProduct) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    const { stockQuantity, ProductStatus } = currentProduct;

    // Determine the target status and productStatusId based on current status and stock quantity
    let targetStatus = "";
    let targetStatusId = "";

    if (ProductStatus.status === "On Hold") {
      if (stockQuantity === 0) {
        targetStatus = "Out of Stock";
        targetStatusId = "062cd848-4ab5-4ba1-a9c7-e503ffe02bd0";
      } else {
        targetStatus = "In Stock";
        targetStatusId = "0d9921b7-df37-4d8d-89a0-31a00259ca8b";
      }
    } else {
      targetStatus = "On Hold";
      targetStatusId = "34aebdf5-fe10-4f15-97ea-e7be5dac6082";
    }

    // Update the product's status
    const updatedProduct = await prisma.products.update({
      where: { productId },
      data: {
        ProductStatus: {
          connect: {
            productStatusId: targetStatusId,
            status: targetStatus,
          },
        },
      },
    });

    res.status(200).json({
      message: `Product status updated to "${targetStatus}" successfully.`,
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error updating product status:", error);
    if (error.code === "P2025") {
      res.status(404).json({ message: "Product not found." });
    } else {
      res.status(500).json({
        message: "An unexpected error occurred.",
        error: error.message,
      });
    }
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.body;

    console.log("deleteProduct productId", productId);

    // Step 1: Validate the productId
    if (!productId) {
      res.status(400).json({ message: "Product ID is required." });
      return;
    }

    // Step 2: Check if the product exists
    const existingProduct = await prisma.products.findUnique({
      where: { productId },
    });

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    // Step 3: Delete the product
    await prisma.products.delete({
      where: { productId },
    });

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};
