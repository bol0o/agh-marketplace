import { Response } from "express";
import { PrismaClient, NotificationType } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { getIO } from "../socket";

const prisma = new PrismaClient();

// place a bid on product
export const placeBid = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId, amount } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Nieautoryzowany dostęp" });
    }

    // 1. fetch product to check rules
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { bids: { orderBy: { amount: "desc" }, take: 1 } },
    });

    if (!product) {
      return res.status(404).json({ message: "Produkt nie istnieje" });
    }

    // check if it's an auction
    if (!product.isAuction) {
      return res
        .status(400)
        .json({ message: "Ten produkt nie jest na aukcji" });
    }

    // check if auction ended
    if (product.auctionEnd && new Date() > product.auctionEnd) {
      return res
        .status(400)
        .json({ message: "Aukcja dla tego produktu już się zakończyła" });
    }

    // prevent self bidding (seller cannot bid)
    if (product.sellerId === userId) {
      return res
        .status(400)
        .json({ message: "Nie możesz licytować własnego produktu" });
    }

    const currentHighestBid = product.bids[0];

    // Check if the user is already the highest bidder
    if (currentHighestBid && currentHighestBid.userId === userId) {
      return res.status(400).json({
        message: "Już prowadzisz w tej licytacji",
      });
    }

    // check bid amount logic
    const currentHighestAmount = currentHighestBid?.amount || product.price;

    if (amount <= currentHighestAmount) {
      return res.status(400).json({
        message: `Twoja oferta musi być wyższa niż aktualna najwyższa oferta: ${currentHighestAmount} PLN`,
      });
    }

    // 2. create bid AND update product price (Transaction)
    const bid = await prisma.$transaction(async (tx) => {
      // Create the bid
      const newBid = await tx.bid.create({
        data: {
          userId,
          productId,
          amount,
        },
      });

      // Update the product price to reflect the new highest bid
      await tx.product.update({
        where: { id: productId },
        data: { price: amount },
      });

      return newBid;
    });

    // Notify the Seller
    await prisma.notification.create({
      data: {
        userId: product.sellerId,
        type: NotificationType.BID,
        title: "Nowa oferta licytacji",
        message: `Ktoś zaoferował ${amount} PLN za Twój produkt "${product.title}".`,
        isRead: false,
      },
    });

    // Notify the previous highest bidder (You have been outbid)
    if (currentHighestBid && currentHighestBid.userId !== userId) {
      await prisma.notification.create({
        data: {
          userId: currentHighestBid.userId,
          type: NotificationType.BID,
          title: "Zostałeś przelicytowany!",
          message: `Ktoś przebił Twoją ofertę w aukcji "${product.title}". Nowa kwota: ${amount} PLN.`,
          isRead: false,
        },
      });
    }

    // Socket
    try {
      const io = getIO();
      // send event to all in auction room about new bid
      io.to(`auction_${productId}`).emit("bid_update", {
        amount: bid.amount,
      });
    } catch (socketError) {
      console.error("Socket.io error:", socketError);
    }

    res.status(201).json({ message: "Oferta została złożona pomyślnie", bid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd podczas składania oferty" });
  }
};

// get bids for a product
export const getBidsForProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const bids = await prisma.bid.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { amount: "desc" },
    });

    res.json(bids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Nie udało się pobrać ofert" });
  }
};
