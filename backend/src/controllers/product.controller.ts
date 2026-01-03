import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// HELPER: Map DB Product to Frontend 'Product' Interface
const mapProduct = (p: any) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  price: p.price,
  image: p.imageUrl, // Map imageUrl -> image

  category: p.category,
  condition: p.condition,
  type: p.isAuction ? "auction" : "buy_now", // Map boolean -> string

  location: p.location,
  stock: 1,

  seller: {
    id: p.seller.id,
    name: `${p.seller.firstName} ${p.seller.lastName}`,
    avatar: p.seller.avatarUrl,
    rating: 0, // Placeholder
  },

  views: p.views,
  createdAt: p.createdAt,
  endsAt: p.auctionEnd,
});

// GET /api/products (Filtering & Pagination)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      search,
      cat,
      minPrice,
      maxPrice,
      sort,
      status, // 'auction' or 'buy_now'
      location,
    } = req.query;

    const where: any = {};

    // 1. Build Filter Query
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
      ];
    }
    if (cat) {
      where.category = String(cat).toUpperCase();
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (status) {
      if (status === "auction") where.isAuction = true;
      if (status === "buy_now") where.isAuction = false;
    }
    if (location) {
      where.location = { contains: String(location), mode: "insensitive" };
    }

    // 2. Sorting
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "views") orderBy = { views: "desc" };

    // 3. Pagination
    const take = 20;
    const skip = (Number(page) - 1) * take;

    // 4. Fetch
    const products = await prisma.product.findMany({
      where,
      orderBy,
      take,
      skip,
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.json(products.map(mapProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas pobierania produktów" });
  }
};

// GET /api/products/:id (Details)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Increment view counter
    const product = await prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.json(mapProduct(product));
  } catch (error) {
    res.status(404).json({ error: "Produkt nie został znaleziony" });
  }
};

// POST /api/products (Create)
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Brak autoryzacji" });

    const {
      title,
      description,
      price,
      category,
      condition,
      location,
      isAuction,
      auctionEnd,
      imageUrl,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        sellerId: userId,
        title,
        description,
        price: Number(price),
        category,
        imageUrl: imageUrl || null,
        condition,
        location,
        isAuction: Boolean(isAuction),
        auctionEnd: auctionEnd ? new Date(auctionEnd) : null,
      },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(201).json(mapProduct(product));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nie udało się utworzyć produktu" });
  }
};

// PATCH /api/products/:id (Edit)
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Check ownership
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.sellerId !== userId) {
      return res
        .status(403)
        .json({ error: "Możesz edytować tylko własne produkty" });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: req.body,
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.json(mapProduct(updated));
  } catch (error) {
    res.status(500).json({ error: "Nie udało się zaktualizować produktu" });
  }
};

// DELETE /api/products/:id (Remove)
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const role = req.user?.role;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product)
      return res.status(404).json({ error: "Produkt nie istnieje" });

    // Allow owner OR admin to delete
    if (product.sellerId !== userId && role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Brak uprawnień do usunięcia tego produktu" });
    }

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Produkt został usunięty" });
  } catch (error) {
    res.status(500).json({ error: "Nie udało się usunąć produktu" });
  }
};
