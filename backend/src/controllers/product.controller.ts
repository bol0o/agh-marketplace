import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { deleteImageFromCloudinary } from "./upload.controller";

const prisma = new PrismaClient();

// HELPER: Map DB Product to Frontend 'Product' Interface
const mapProduct = (p: any) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  price: p.price,
  image: p.imageUrl,

  category: p.category,
  condition: p.condition,

  type: p.isAuction ? "auction" : "buy_now",

  location: p.location,

  stock: p.stock,
  status: p.status,

  seller: {
    id: p.seller.id,
    name: `${p.seller.firstName} ${p.seller.lastName}`,
    avatar: p.seller.avatarUrl,
    rating: 0,
  },

  views: p.views,
  createdAt: p.createdAt,

  endsAt: p.auctionEnd,
});

// GET /api/products (With Pagination, Filtering & Social Feed logic)
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Pagination Params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;
    const skip = (page - 1) * limit;

    const {
      search,
      cat,
      minPrice,
      maxPrice,
      sort,
      type,
      location,
      condition,
      onlyFollowed,
    } = req.query;

    const where: any = {
      status: "active",
    };

    // 2. Build Search Filters
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
      ];
    }
    if (cat) {
      where.category = String(cat).toUpperCase();
    }
    // Filter by Condition (e.g., 'new', 'used')
    if (condition) {
      where.condition = String(condition);
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (type) {
      if (type === "auction") where.isAuction = true;
      if (type === "buy_now") where.isAuction = false;
    }

    if (location) {
      where.location = { contains: String(location), mode: "insensitive" };
    }

    // 3. Social Feed Logic (Filter by followed users)
    if (onlyFollowed === "true") {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: "Musisz być zalogowany, aby filtrować po obserwowanych.",
        });
      }

      // Get list of followed user IDs
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      const followingIds = following.map((f) => f.followingId);

      where.sellerId = { in: followingIds };
    }

    // 4. Sorting Logic
    let orderBy: any = { createdAt: "desc" };

    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "views_desc":
        orderBy = { views: "desc" };
        break;
      case "name_asc":
        orderBy = { title: "asc" };
        break;
      case "name_desc":
        orderBy = { title: "desc" };
        break;
      case "createdAt_asc":
        orderBy = { createdAt: "asc" };
        break;
      case "createdAt_desc":
        orderBy = { createdAt: "desc" };
        break;
      case "ending_soon":
        orderBy = { auctionEnd: "asc" };
        where.isAuction = true;
        where.auctionEnd = { gt: new Date() };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // 5. Database Transaction: Fetch Data + Count Total
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        take: limit,
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
      }),
      prisma.product.count({ where }),
    ]);

    // 6. Return Data with Pagination Metadata
    res.json({
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
      products: products.map(mapProduct),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd pobierania produktów" });
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
    res.status(404).json({ error: "Produkt nie znaleziony" });
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
      imageUrl,
      stock,
      type,
      endsAt,
    } = req.body;

    const isAuctionBool = type === "auction";

    let finalAuctionEnd = null;

    if (isAuctionBool) {
      if (!endsAt) {
        return res
          .status(400)
          .json({ error: "Aukcje muszą posiadać datę zakończenia" });
      }
      finalAuctionEnd = new Date(endsAt);
    }

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

        stock: stock ? Number(stock) : 1,
        status: "active",

        // Mapped values for DB
        isAuction: isAuctionBool,
        auctionEnd: finalAuctionEnd,
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
    res.status(500).json({ error: "Błąd podczas tworzenia produktu" });
  }
};

// PATCH /api/products/:id (Edit)
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const {
      title,
      description,
      price,
      category,
      condition,
      location,
      imageUrl,
      stock,
      type,
      endsAt,
    } = req.body;

    // Check ownership and current bids
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { bids: true }, // Need to check bids
    });

    if (!existing || existing.sellerId !== userId) {
      return res
        .status(403)
        .json({ error: "Możesz edytować tylko swoje produkty" });
    }

    // Prevent price editing if auction has bids
    if (existing.isAuction && existing.bids.length > 0) {
      // If user tries to change price
      if (price && Number(price) !== existing.price) {
        return res.status(400).json({
          error: "Nie można zmienić ceny aukcji, w której są już oferty",
        });
      }
    }

    // Mapping logic for updates
    const isAuctionBool = type ? type === "auction" : undefined;
    const auctionEndDate = endsAt ? new Date(endsAt) : undefined;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        category,
        condition,
        location,
        imageUrl,

        price: price ? Number(price) : undefined,
        stock: stock ? Number(stock) : undefined,

        isAuction: isAuctionBool,
        auctionEnd: auctionEndDate,
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

    res.json(mapProduct(updated));
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Błąd aktualizacji produktu" });
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

    // Logic: Delete image from Cloudinary
    if (product.imageUrl) {
      await deleteImageFromCloudinary(product.imageUrl);
    }

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Produkt został usunięty" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas usuwania produktu" });
  }
};
