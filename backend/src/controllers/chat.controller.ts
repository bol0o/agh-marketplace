import { Response } from "express";
import { PrismaClient, NotificationType } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { getIO } from "../socket";

const prisma = new PrismaClient();

// HELPER: Map DB Chat to Frontend 'Chat' Interface
const mapChat = (chat: any, currentUserId: string) => {
  // Determine if I am the seller or the buyer
  const isSeller = chat.product.sellerId === currentUserId;

  // The "other" user is: if I'm seller -> buyer; if I'm buyer -> seller
  const otherUser = isSeller ? chat.buyer : chat.product.seller;

  // Count unread messages (sent by the OTHER user)
  const unreadCount = chat.messages.filter(
    (m: any) => m.senderId !== currentUserId && !m.isRead,
  ).length;

  // Get last message text
  const lastMsg = chat.messages[0]?.text || "Rozpoczęto czat";

  return {
    id: chat.id,
    updatedAt: chat.updatedAt.toISOString(),
    lastMessage: lastMsg,
    unreadCount,

    // Who am I talking to?
    user: {
      id: otherUser.id,
      name: `${otherUser.firstName} ${otherUser.lastName}`,
      avatar: otherUser.avatarUrl,
      isOnline: false, // Placeholder for socket status
      lastSeen: new Date().toISOString(),
    },

    // Product Context
    product: {
      id: chat.product.id,
      title: chat.product.title,
      price: chat.product.price,
      image: chat.product.imageUrl,
      // Status mapping: if I own the product -> 'selling', else 'buying'
      status: isSeller ? "selling" : "buying",
    },
  };
};

// GET /api/chats (Sidebar list)
export const getChats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Brak autoryzacji" });

    // Find chats where user is Buyer OR Seller (via Product)
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { buyerId: userId }, // User is buying
          { product: { sellerId: userId } }, // User is selling
        ],
      },
      include: {
        buyer: true,
        product: { include: { seller: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // We only need the last message for the sidebar
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json(chats.map((chat) => mapChat(chat, userId)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd pobierania rozmów" });
  }
};

// POST /api/chats (Start new conversation)
export const createChat = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId, initialMessage } = req.body;

    if (!userId) return res.status(401).json({ error: "Brak autoryzacji" });

    let chat = await prisma.chat.findUnique({
      where: {
        productId_buyerId: {
          productId,
          buyerId: userId,
        },
      },
      include: { product: true },
    });

    if (!chat) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (product?.sellerId === userId) {
        return res.status(400).json({ error: "Nie możesz pisać do siebie" });
      }

      chat = await prisma.chat.create({
        data: {
          productId,
          buyerId: userId,
        },
        include: { product: true },
      });

      if (initialMessage) {
        await prisma.message.create({
          data: {
            chatId: chat.id,
            senderId: userId,
            text: initialMessage,
          },
        });

        const sender = await prisma.user.findUnique({ where: { id: userId } });

        await prisma.notification.create({
          data: {
            userId: chat.product.sellerId,
            type: NotificationType.MESSAGE,
            title: `Nowe zapytanie: ${chat.product.title}`,
            message: `${
              sender?.firstName || "Kupujący"
            }: ${initialMessage.substring(0, 50)}...`,
            link: `/messages/${chat.id}`,
            isRead: false,
          },
        });
      }
    }
    res.status(201).json({ id: chat.id, message: "Rozmowa gotowa" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd tworzenia czatu" });
  }
};

// GET /api/chats/:chatId/messages (Chat history)
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.userId;

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    // Mark incoming messages as read
    await prisma.message.updateMany({
      where: {
        chatId,
        senderId: { not: userId }, // Messages sent by OTHERS
        isRead: false,
      },
      data: { isRead: true },
    });

    // Map to frontend interface
    const response = messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      text: m.text,
      timestamp: m.createdAt.toISOString(),
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Błąd pobierania wiadomości" });
  }
};

// POST /api/chats/:chatId/messages (Send message)
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // 1. Create message
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        text,
      },
    });

    // 2. Update Chat timestamp (to move it to top of sidebar)
    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
      include: {
        buyer: true,
        product: true,
      }, // Include relations to find recipient
    });

    // Determine recipient: if I am buyer -> recipient is seller
    const recipientId =
      userId === chat.buyerId ? chat.product.sellerId : chat.buyerId;

    // 3. Real-time Notification (Socket.io)
    try {
      const io = getIO();

      // Emit to recipient's room
      io.to(recipientId).emit("new_message", {
        chatId: chat.id,
        text: message.text,
        senderId: userId,
        senderName: "Użytkownik", // Can fetch real name if needed
        productTitle: chat.product.title,
      });
    } catch (socketError) {
      console.error("Socket emit failed", socketError);
    }

    const sender = await prisma.user.findUnique({ where: { id: userId } });

    await prisma.notification.create({
      data: {
        userId: recipientId, // Notify the Recipient
        type: NotificationType.MESSAGE,
        title: `Nowa wiadomość: ${chat.product.title}`,
        message: `${sender?.firstName || "Użytkownik"}: ${text.substring(
          0,
          50,
        )}${text.length > 50 ? "..." : ""}`,
        link: `/messages/${chat.id}`,
        isRead: false,
      },
    });

    res.status(201).json({
      id: message.id,
      senderId: message.senderId,
      text: message.text,
      timestamp: message.createdAt.toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Błąd wysyłania wiadomości" });
  }
};
