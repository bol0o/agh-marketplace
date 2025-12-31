import { Response } from "express";
import { PrismaClient, OrderStatus } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

//Buy
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: "Brak ID użytkownika" });

    //Download cart with products
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Koszyk jest pusty" });
    }

    //total amount
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    //Transaction (create Order + Many OrderItems + Clear cart)
    const order = await prisma.$transaction(async (tx) => {
      //create Order with OrderItems (nested write)
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          totalPrice: totalAmount,
          status: OrderStatus.PENDING,

          //create OrderItems
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtTime: item.product.price,
            })),
          },
        },
      });

      //Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    res.status(201).json({ message: "Zamówienie złożone!", orderId: order.id });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ error: "Błąd podczas składania zamówienia" });
  }
};

//my orders
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Brak ID" });

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd pobierania historii" });
  }
};
