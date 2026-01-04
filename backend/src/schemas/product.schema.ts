import { z } from "zod";
import { Category } from "@prisma/client";

export const createProductSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, { message: "Tytuł jest za krótki (min. 3 znaki)" }),
    description: z
      .string()
      .min(10, { message: "Opis jest za krótki (min. 10 znaków)" }),
    price: z.number().min(0, { message: "Cena nie może być ujemna" }),

    category: z.nativeEnum(Category, {
      message: "Nieprawidłowa kategoria",
    }),

    // Marketplace specific fields
    condition: z.enum(["new", "used", "damaged"], {
      message: "Nieprawidłowy stan (wybierz: new, used, damaged)",
    }),
    location: z.string().min(2, { message: "Lokalizacja jest wymagana" }),

    // Auction fields
    isAuction: z.boolean().optional(),
    auctionEnd: z
      .string()
      .datetime({ message: "Nieprawidłowy format daty" })
      .optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(3, { message: "Tytuł jest za krótki" }).optional(),
    description: z
      .string()
      .min(10, { message: "Opis jest za krótki" })
      .optional(),
    price: z
      .number()
      .min(0, { message: "Cena nie może być ujemna" })
      .optional(),
    category: z.nativeEnum(Category).optional(),
    condition: z.enum(["new", "used", "damaged"]).optional(),
    location: z.string().min(2).optional(),
  }),
});
