import { Request, Response } from "express";
import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

//Get all products with filtering
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;

    const products = await prisma.product.findMany({
      where: {
        //Search by name
        title: search
          ? { contains: String(search), mode: "insensitive" }
          : undefined,
        //Filter by category
        category: category ? (category as Category) : undefined,
      },
      include: {
        seller: { select: { firstName: true, lastName: true } }, //Include seller's name
      },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nie udało się pobrać produktów" });
  }
};

//Get specific product
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: { select: { firstName: true, lastName: true } },
        reviews: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Produkt nie znaleziony" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nie udało się pobrać produktu" });
  }
};
