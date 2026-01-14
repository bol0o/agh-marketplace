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
      status,
      location,
      condition,
      onlyFollowed,
    } = req.query;

    const where: any = {
      status: "active", // Default: show only active products
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
    if (status) {
      if (status === "auction") where.isAuction = true;
      if (status === "buy_now") where.isAuction = false;
    }
    if (location) {
      where.location = { contains: String(location), mode: "insensitive" };
    }

    // 3. Social Feed Logic (Filter by followed users)
    if (onlyFollowed === "true") {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: "You must be logged in to filter by followed users",
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
    res.status(500).json({ error: "Error fetching products" });
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
    res.status(404).json({ error: "Product not found" });
  }
};

// POST /api/products (Create)
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

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
      stock,
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

        stock: stock ? Number(stock) : 1,
        status: "active",

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
    res.status(500).json({ error: "Failed to create product" });
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
      isAuction,
      auctionEnd,
    } = req.body;

    // Check ownership
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.sellerId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only edit your own products" });
    }

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

        isAuction: isAuction !== undefined ? Boolean(isAuction) : undefined,
        auctionEnd: auctionEnd ? new Date(auctionEnd) : undefined,
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
    res.status(500).json({ error: "Failed to update product" });
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
      return res.status(404).json({ error: "Product does not exist" });

    // Allow owner OR admin to delete
    if (product.sellerId !== userId && role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this product" });
    }

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
