import { Response } from "express";
import { PrismaClient, NotificationType } from "@prisma/client";
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

// GET /api/notifications (List with Pagination & Filtering)
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    // 1. Parse Query Params for Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // 2. Parse Query Params for Filtering
    const { type, unread } = req.query;

    // 3. Build Filter Object (Where clause)
    const where: any = { userId };

    // Filter by Type (ensure it matches the Enum)
    if (
      type &&
      Object.values(NotificationType).includes(type as NotificationType)
    ) {
      where.type = type as NotificationType;
    }

    // Filter by Read Status (if unread=true, show only unread messages)
    if (unread === "true") {
      where.isRead = false;
    }

    // 4. Database Transaction: Fetch Data + Count Total
    const [notifications, total] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.notification.count({ where }),
    ]);

    // 5. Return Response with Pagination Metadata
    res.json({
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
      notifications: notifications.map(mapNotification),
    });
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
        userId: userId,
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

// GET /api/notifications/unread-count
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Brak autoryzacji" });

    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    res.json({ count });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Błąd podczas pobierania liczby powiadomień" });
  }
};
