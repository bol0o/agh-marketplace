import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// HELPER: Map DB Notification to Frontend Interface
const mapNotification = (n: any) => ({
  id: n.id,
  type: n.type,
  title: n.title,
  message: n.message,
  timestamp: n.createdAt.toISOString(), // Frontend expects string
  isRead: n.isRead,
  link: n.link,
});

// GET /api/notifications (List)
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(notifications.map(mapNotification));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Wystąpił błąd podczas pobierania powiadomień" });
  }
};

// PATCH /api/notifications/mark-all-read (Mark ALL as read)
export const markAllRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Brak autoryzacji" });

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: "Wszystkie powiadomienia oznaczone jako przeczytane" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd aktualizacji powiadomień" });
  }
};

// PATCH /api/notifications/:id/read (Mark SINGLE as read)
export const markRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    // Use updateMany to ensure user owns the notification (security)
    const result = await prisma.notification.updateMany({
      where: { id: id, userId: userId },
      data: { isRead: true },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Powiadomienie nie znalezione" });
    }

    res.json({ message: "Zaktualizowano status" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Wystąpił błąd podczas aktualizacji powiadomienia" });
  }
};

// DELETE /api/notifications/:id (Remove)
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    // Use deleteMany to ensure ownership check
    const result = await prisma.notification.deleteMany({
      where: {
        id: id,
        userId: userId, // Ensure user can only delete their own
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Powiadomienie nie znalezione" });
    }

    res.json({ message: "Powiadomienie usunięte" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas usuwania powiadomienia" });
  }
};
