import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// HELPER: Map DB Product to Frontend Interface
const mapProduct = (p: any) => ({
  id: p.id,
  title: p.title,
  price: p.price,
  image: p.imageUrl, // Map imageUrl -> image
  category: p.category,
  condition: p.condition,
  location: p.location,
  seller: {
    id: p.seller.id,
    name: `${p.seller.firstName} ${p.seller.lastName}`,
    avatar: p.seller.avatarUrl,
  },
});

// GET /api/cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Brak identyfikatora użytkownika" });
    }

    // Find cart and include products with seller info
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: true, // Needed for frontend product display
              },
            },
          },
          orderBy: { createdAt: "asc" }, // Keep order consistent
        },
      },
    });

    if (!cart) {
      return res.json({ items: [] });
    }

    // Map to Frontend 'CartItemType' structure
    const response = {
      items: cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: mapProduct(item.product),
      })),
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nie udało się pobrać koszyka" });
  }
};

// POST /api/cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId, quantity = 1 } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    // Find or create user cart
    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Check if product exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    let resultItem;

    if (existingItem) {
      // Update quantity
      resultItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new item
      resultItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    res.json({ message: "Produkt dodany do koszyka", cartItem: resultItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd dodawania do koszyka" });
  }
};

// PATCH /api/cart/:itemId
export const updateCartItemQuantity = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.userId;

    // Verify if cart belongs to user (Security)
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      return res.status(404).json({ error: "Element koszyka nie znateziony" });
    }

    // Update
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    res.json({ message: "Zaktualizowano ilość", item: updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd aktualizacji koszyka" });
  }
};

// DELETE /api/cart/:itemId
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?.userId;

    // Verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      return res.status(404).json({ error: "Element nie istnieje" });
    }

    // Delete item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    res.json({ message: "Usunięto z koszyka" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nie udało się usunąć produktu" });
  }
};
