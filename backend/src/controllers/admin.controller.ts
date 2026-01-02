import { Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

//get all users
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    //fetch users excluding sensitive data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        studentId: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd pobierania listy użytkowników" });
  }
};

// toggle user block status (ban/unban)
export const toggleBlockUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const currentAdminId = req.user?.userId;

    // Prevent admin from banning themselves
    if (userId === currentAdminId) {
      return res
        .status(400)
        .json({ error: "Nie możesz zablokować własnego konta" });
    }

    // check if target user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    }

    //toggle the status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    const statusMessage = updatedUser.isActive ? "odblokowany" : "zablokowany";
    res.json({
      message: `Użytkownik został ${statusMessage}.`,
      user: {
        id: updatedUser.id,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd zmiany statusu użytkownika" });
  }
};

//change user role
export const changeUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const currentAdminId = req.user?.userId;

    // Prevent admin from changing their own role
    if (userId === currentAdminId) {
      return res
        .status(400)
        .json({ error: "Nie możesz zmienić roli własnego konta" });
    }

    //validate role enum
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
