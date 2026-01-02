import { Server as HttpServer } from "http";
import { Server } from "socket.io";

export let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    //enter user room (to get private notifications)
    socket.on("join_user_room", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their notification room`);
    });

    //Join auction room (to see live auction)
    socket.on("join_auction", (productId) => {
      socket.join(`auction_${productId}`);
      console.log(`User is watching auction: ${productId}`);
    });

    //Join chat room
    socket.on("join_chat", (chatRoomId) => {
      // chatRoomId can be, for example, a combined ID of two users: "user1_user2"
      socket.join(chatRoomId);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Helper function to get the IO instance in controllers
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};
