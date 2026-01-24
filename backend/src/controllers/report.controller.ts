import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// POST /api/reports
export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const reporterId = req.user?.userId;
    const { targetId, targetType, reason, description } = req.body;
    // targetType: 'user' lub 'product'

    if (!reporterId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    const report = await prisma.report.create({
      data: {
        reporterId,
        targetId,
        targetType,
        reason,
        description,
        status: "open",
      },
    });

    res.status(201).json({ message: "Zgłoszenie zostało wysłane", report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas tworzenia zgłoszenia" });
  }
};
