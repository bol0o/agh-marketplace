import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const createOrderSchema = z.object({
  body: z.object({
    address: z.object({
      street: z.string().min(1, { message: "Ulica jest wymagana" }),
      city: z.string().min(1, { message: "Miasto jest wymagane" }),
      zipCode: z.string().min(1, { message: "Kod pocztowy jest wymagany" }),
      phone: z.string().min(9, { message: "Numer telefonu jest wymagany" }),
    }),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus, {
      message: "Nieprawidłowy status zamówienia",
    }),
  }),
});
