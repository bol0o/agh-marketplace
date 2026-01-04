import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid({ message: "Nieprawidłowe ID produktu" }),
    quantity: z
      .number()
      .int()
      .min(1, { message: "Ilość musi wynosić minimum 1" }),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z
      .number()
      .int()
      .min(1, { message: "Ilość musi wynosić minimum 1" }),
  }),
});
