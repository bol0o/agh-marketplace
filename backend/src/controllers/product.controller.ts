import { Request, Response } from "express";
import { PrismaClient, Category } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

//Get all products with filtering
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    const where: any = {};

    //Search by name or description
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
      ];
    }

    //Filter by category
    if (category) {
      where.category = category as Category;
    }

    //Filter by price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        //Include seller's info
        seller: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nie udało się pobrać produktów" });
  }
};

//Get specific product
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        //Include seller's info (needed to review them later)
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
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

//Create new product
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, category, imageUrl } = req.body;
    const sellerId = req.user?.userId;

    if (!sellerId) {
      return res.status(401).json({ error: "Musisz być zalogowany" });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        category,
        imageUrl,
        sellerId,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nie udało się dodać produktu" });
  }
};

//Delete product
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const role = req.user?.role;

    //Check if product exists
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ error: "Produkt nie istnieje" });
    }

    //Check permissions (Owner or Admin)
    if (product.sellerId !== userId && role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Brak uprawnień do usunięcia tego produktu" });
    }

    //Delete product
    await prisma.product.delete({ where: { id } });

    res.json({ message: "Produkt usunięty" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nie udało się usunąć produktu" });
  }
};
