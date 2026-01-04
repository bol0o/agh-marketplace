import { z } from "zod";

export const createChatSchema = z.object({
  body: z.object({
    productId: z.string().uuid({ message: "Nieprawidłowe ID produktu" }),
    initialMessage: z.string().optional(),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    text: z.string().min(1, { message: "Wiadomość nie może być pusta" }),
  }),
});
