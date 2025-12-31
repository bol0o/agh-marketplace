import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

//Get cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Brak identyfikatora użytkownika" });
    }

    //Find cart and include products
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }

    //Calculate total price
    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    res.json({ ...cart, totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nie udało się pobrać koszyka" });
  }
};

//Add to cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId, quantity = 1 } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Brak identyfikatora użytkownika" });
    }

    //Find or create user cart
    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    //Check if product exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (existingItem) {
      //Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      //Create new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    res.json({ message: "Produkt dodany do koszyka" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd dodawania do koszyka" });
  }
};

//Remove from cart
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;

    //Delete item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    res.json({ message: "Usunięto z koszyka" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Nie udało się usunąć" });
  }
};
