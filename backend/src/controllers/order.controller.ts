import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// HELPER: Format Order to match Frontend Contract
const formatOrderResponse = (order: any) => {
  return {
    id: order.id,
    createdAt: order.createdAt,
    status: order.status.toLowerCase(), // Frontend expects lowercase status
    buyerId: order.userId,

    // Map DB 'totalPrice' to Frontend 'totalAmount'
    totalAmount: order.totalPrice,
    shippingCost: order.shippingCost,

    // Reconstruct Address Object from flat DB structure
    shippingAddress: {
      street: order.shippingStreet,
      city: order.shippingCity,
      zipCode: order.shippingZipCode,
      phone: order.shippingPhone,
    },

    // Map Items and Snapshots
    items: order.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      snapshot: {
        title: item.snapshotTitle,
        image: item.snapshotImage, // Cloudinary URL
        price: item.priceAtTime,
      },
    })),

    paymentId: "mock_payment_id", // Placeholder
  };
};

// POST /api/orders (Create Order)
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { address } = req.body; // Expecting address object

    if (!userId) return res.status(401).json({ error: "Brak autoryzacji" });

    // 1. Fetch Cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Twój koszyk jest pusty" });
    }

    // 2. Calculate Totals
    const SHIPPING_COST = 15.0; // Hardcoded for MVP
    const itemsTotal = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);
    const totalAmount = itemsTotal + SHIPPING_COST;

    // 3. Transaction (Order + Items + Clear Cart)
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          totalPrice: totalAmount,
          shippingCost: SHIPPING_COST,
          status: "PENDING",

          // Save Address Snapshot
          shippingStreet: address.street,
          shippingCity: address.city,
          shippingZipCode: address.zipCode,
          shippingPhone: address.phone,

          // Create Items with Snapshots
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtTime: item.product.price,

              // CRITICAL: Snapshot current title and image
              snapshotTitle: item.product.title,
              snapshotImage: item.product.imageUrl,
            })),
          },
        },
        include: { items: true },
      });

      // Clear Cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    res.status(201).json(formatOrderResponse(order));
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ error: "Błąd podczas składania zamówienia" });
  }
};

// GET /api/orders (My Purchases)
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders.map(formatOrderResponse));
  } catch (error) {
    res.status(500).json({ error: "Błąd pobierania historii zamówień" });
  }
};

// GET /api/orders/sales (My Sales History)
export const getSales = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Find orders containing items sold by this user
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: { sellerId: userId },
          },
        },
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders.map(formatOrderResponse));
  } catch (error) {
    res.status(500).json({ error: "Błąd pobierania historii sprzedaży" });
  }
};

// GET /api/orders/:id (Order Details)
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order)
      return res.status(404).json({ error: "Zamówienie nie istnieje" });

    // Security: Only buyer or admin can access details
    if (order.userId !== userId && req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Brak dostępu do tego zamówienia" });
    }

    res.json(formatOrderResponse(order));
  } catch (error) {
    res.status(500).json({ error: "Błąd serwera" });
  }
};

// POST /api/orders/:id/pay (Simulate Payment)
export const payOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: "Zamówienie nie istnieje" });
    }

    if (order.status !== "PENDING") {
      return res
        .status(400)
        .json({ error: "Zamówienie zostało już opłacone lub anulowane" });
    }

    // Update status to COMPLETED
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: "COMPLETED" },
      include: { items: true },
    });

    res.json(formatOrderResponse(updatedOrder));
  } catch (error) {
    res.status(500).json({ error: "Błąd przetwarzania płatności" });
  }
};

// PATCH /api/orders/:id/status (Change Status)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // For MVP, we assume permissions are handled (or admin only)
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    res.json(formatOrderResponse(updatedOrder));
  } catch (error) {
    res.status(500).json({ error: "Błąd aktualizacji statusu" });
  }
};
