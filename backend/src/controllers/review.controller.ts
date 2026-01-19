import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

//Add review for user (seller)
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const reviewerId = req.user?.userId;
    const { revieweeId, rating, comment } = req.body;

    if (!reviewerId) {
      return res.status(401).json({ error: "Brak ID użytkownika" });
    }

    //Validiation: cannot review self
    if (reviewerId === revieweeId) {
      return res.status(400).json({ error: "Nie można ocenić samego siebie" });
    }

    //Validiation: check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: revieweeId },
    });
    if (!targetUser) {
      return res.status(404).json({ error: "Użytkownik nie istnieje" });
    }

    //Validiation: check if already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId: reviewerId,
        revieweeId: revieweeId,
      },
    });
    if (existingReview) {
      return res.status(400).json({ error: "Już oceniłeś tego użytkownika" });
    }

    //Create review
    const review = await prisma.review.create({
      data: {
        reviewerId,
        revieweeId,
        rating: Number(rating),
        comment,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd dodawania opinii" });
  }
};

// Get reviews for specific user (With Pagination)
export const getReviewsForUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    // 1. Pagination Parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    // 2. Fetch Data & Count
    const [reviews, totalItems] = await prisma.$transaction([
      prisma.review.findMany({
        where: { revieweeId: userId },
        take: limit,
        skip: skip,
        include: {
          reviewer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({
        where: { revieweeId: userId },
      }),
    ]);

    // 3. Return Response
    res.json({
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
      data: reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd pobierania opinii" });
  }
};

//Delete review (Author or Admin)
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.userId;
    const role = req.user?.role;

    //Fimnd review
    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      return res.status(404).json({ error: "Opinia nie istnieje" });
    }

    //Check permissions
    const isAuthor = review.reviewerId === userId;
    const isAdmin = role === "ADMIN";

    if (!isAuthor && !isAdmin) {
      return res
        .status(403)
        .json({ error: "Brak uprawnień do usunięcia opinii" });
    }

    //Delete
    await prisma.review.delete({ where: { id: reviewId } });

    res.json({ message: "Opinia usunięta" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd usuwania opinii" });
  }
};
