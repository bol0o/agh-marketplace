import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

//place a bid on product
export const placeBid = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId, amount } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Nieautoryzowany dostęp" });
    }

    //1. fetch product to check rules
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { bids: { orderBy: { amount: "desc" }, take: 1 } },
    });

    if (!product) {
      return res.status(404).json({ message: "Produkt nie istnieje" });
    }

    //check if it's an auction
    if (!product.isAuction) {
      return res
        .status(400)
        .json({ message: "Ten produkt nie jest na aukcji" });
    }

    //check if auction ended
    if (product.auctionEnd && new Date() > product.auctionEnd) {
      return res
        .status(400)
        .json({ message: "Aukcja dla tego produktu już się zakończyła" });
    }

    //prevent self bidding
    if (product.sellerId === userId) {
      return res
        .status(400)
        .json({ message: "Nie możesz licytować własnego produktu" });
    }

    //check bid amount logic
    const currentHighest = product.bids[0]?.amount || product.price;

    if (amount <= currentHighest) {
      return res
        .status(400)
        .json({
          message: `Twoja oferta musi być wyższa niż aktualna najwyższa oferta: ${currentHighest} PLN`,
        });
    }

    //2. create bid
    const bid = await prisma.bid.create({
      data: {
        userId,
        productId,
        amount,
      },
    });

    res.status(201).json({ message: "Oferta została złożona pomyślnie", bid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd podczas składania oferty" });
  }
};

//get bids for a product
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
