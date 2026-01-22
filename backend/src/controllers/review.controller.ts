import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// Add review for user (seller)
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const reviewerId = req.user?.userId;
    const { revieweeId, rating, comment } = req.body;

    if (!reviewerId) {
      return res.status(401).json({ error: "Brak ID użytkownika" });
    }

    // Validation: cannot review self
    if (reviewerId === revieweeId) {
      return res.status(400).json({ error: "Nie można ocenić samego siebie" });
    }

    // Validation: check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: revieweeId },
    });
    if (!targetUser) {
      return res.status(404).json({ error: "Użytkownik nie istnieje" });
    }

    // Validation: check if already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId: reviewerId,
        revieweeId: revieweeId,
      },
    });
    if (existingReview) {
      return res.status(400).json({ error: "Już oceniłeś tego użytkownika" });
    }

    // Create review
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

// Get reviews for specific user
export const getReviewsForUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd pobierania opinii" });
  }
};

// Delete review (Author or Admin)
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.userId;
    const role = req.user?.role;

    // Find review to check permissions
    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) {
      return res.status(404).json({ error: "Opinia nie istnieje" });
    }

    // Check permissions: Author of the review OR Admin can delete
    const isAuthor = review.reviewerId === userId;
    const isAdmin = role === "ADMIN";

    if (!isAuthor && !isAdmin) {
      return res
        .status(403)
        .json({ error: "Brak uprawnień do usunięcia opinii" });
    }

    // Delete review
    await prisma.review.delete({ where: { id: reviewId } });

    res.json({ message: "Opinia usunięta pomyślnie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd usuwania opinii" });
  }
};
