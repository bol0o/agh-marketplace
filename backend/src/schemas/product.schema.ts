import { z } from "zod";
import { Category } from "@prisma/client";

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3, { message: "Tytuł jest za krótki" }),
    description: z.string().min(10, { message: "Opis jest za krótki" }),

    price: z.preprocess(
      (a) => {
        if (typeof a === "string") return parseFloat(a);
        if (typeof a === "number") return a;
        return undefined;
      },
      z.number().min(0, { message: "Cena musi być liczbą nieujemną" }),
    ),

    category: z.nativeEnum(Category, {
      message: "Nieprawidłowa kategoria",
    }),
    condition: z.enum(["new", "used", "damaged"], {
      message: "Wybierz stan: new, used lub damaged",
    }),
    location: z.string().min(2, { message: "Lokalizacja jest wymagana" }),

    type: z.enum(["auction", "buy_now"], {
      message: "Typ musi być 'auction' lub 'buy_now'",
    }),

    endsAt: z.string().optional(),

    imageUrl: z.string().optional(),

    stock: z
      .preprocess((a) => {
        if (typeof a === "string") return parseInt(a, 10);
        if (typeof a === "number") return a;
        return undefined;
      }, z.number().min(1))
      .optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),

    price: z.preprocess((a) => {
      if (typeof a === "string") return parseFloat(a);
      if (typeof a === "number") return a;
      return undefined;
    }, z.number().min(0).optional()),

    category: z.nativeEnum(Category).optional(),
    condition: z.enum(["new", "used", "damaged"]).optional(),
    location: z.string().min(2).optional(),

    type: z.enum(["auction", "buy_now"]).optional(),
    endsAt: z.string().optional(),

    imageUrl: z.string().optional(),

    stock: z.preprocess((a) => {
      if (typeof a === "string") return parseInt(a, 10);
      if (typeof a === "number") return a;
      return undefined;
    }, z.number().min(1).optional()),
  }),
});
