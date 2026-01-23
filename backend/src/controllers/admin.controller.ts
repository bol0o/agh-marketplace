import { Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// GET /api/admin/stats (Dashboard)
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const activeListings = await prisma.product.count();

    // Calculate total revenue (sum of completed orders)
    const revenueAgg = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: { status: "COMPLETED" },
    });
    const totalRevenue = revenueAgg._sum.totalPrice || 0;

    const pendingReports = await prisma.report.count({
      where: { status: "open" },
    });

    res.json({
      totalUsers,
      activeListings,
      totalRevenue,
      pendingReports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd pobierania statystyk" });
  }
};

// GET /api/admin/reports (List)
export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reporter: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd pobierania zgłoszeń" });
  }
};

// PATCH /api/admin/reports/:id/resolve
export const resolveReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // Frontend wyśle: 'ban' lub 'dismiss'

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) {
      return res.status(404).json({ error: "Zgłoszenie nie istnieje" });
    }

    await prisma.$transaction(async (tx) => {
      const newStatus = action === "ban" ? "resolved" : "dismissed";

      await tx.report.update({
        where: { id },
        data: { status: newStatus },
      });

      if (action === "ban" && report.targetType === "user") {
        await tx.user.update({
          where: { id: report.targetId },
          data: { isActive: false },
        });
      }

      if (action === "ban" && report.targetType === "product") {
        await tx.product.update({
          where: { id: report.targetId },
          data: { status: "archived" },
        });
      }
    });

    res.json({
      message: `Zgłoszenie rozpatrzone: ${action === "ban" ? "Zablokowano obiekt" : "Odrzucono zgłoszenie"}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas rozpatrywania zgłoszenia" });
  }
};

// GET /api/admin/users (With Pagination)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Pagination Params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // 2. Database Transaction: Fetch Users + Count Total
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          _count: {
            select: { products: true, orders: true },
          },
        },
      }),
      prisma.user.count(),
    ]);

    // 3. Return Data with Pagination Metadata
    res.json({
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd pobierania użytkowników" });
  }
};
// PATCH /api/admin/users/:userId/status (Ban/Unban)
export const toggleBlockUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const currentAdminId = req.user?.userId;

    if (userId === currentAdminId) {
      return res
        .status(400)
        .json({ error: "Nie możesz zablokować własnego konta" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    const statusMessage = updatedUser.isActive ? "odblokowany" : "zablokowany";
    res.json({
      message: `Użytkownik został ${statusMessage}.`,
      user: { id: updatedUser.id, isActive: updatedUser.isActive },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd zmiany statusu użytkownika" });
  }
};

// PATCH /api/admin/users/:userId/role
export const changeUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const currentAdminId = req.user?.userId;

    if (userId === currentAdminId) {
      return res
        .status(400)
        .json({ error: "Nie możesz zmienić roli własnego konta" });
    }

    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({ error: "Nieprawidłowa rola użytkownika" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    res.json({
      message: "Rola użytkownika została zaktualizowana.",
      role: updatedUser.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd zmiany roli użytkownika" });
  }
};
