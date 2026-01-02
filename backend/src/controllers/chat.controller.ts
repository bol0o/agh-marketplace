import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// get history of chat messages with specific user
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { otherUserId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Wystąpił błąd podczas pobierania wiadomości" });
  }
};

//send a message
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user?.userId;
    const { recipientId, content } = req.body;

    if (!senderId) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }

    //Validation: cannot send empty message
    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Wiadomość nie może być pusta" });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        recipientId,
        content,
      },
    });

    // TODO : Emit socket event to recipient for real-time update

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Wystąpił błąd podczas wysyłania wiadomości" });
  }
};
