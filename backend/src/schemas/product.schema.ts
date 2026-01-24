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
    price: z.preprocess(
      (a) => parseFloat(z.string().parse(a)),
      z.number().min(0, { message: "Cena nie może być ujemna" }),
    ),

    category: z.nativeEnum(Category, {
      message: "Nieprawidłowa kategoria",
    }),

    condition: z.enum(["new", "used", "damaged"], {
      message: "Nieprawidłowy stan (wybierz: new, used, damaged)",
    }),
    location: z.string().min(2, { message: "Lokalizacja jest wymagana" }),

    type: z.enum(["auction", "buy_now"], {
      message: "Typ musi być 'auction' lub 'buy_now'",
    }),

    endsAt: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          return !isNaN(Date.parse(val));
        },
        { message: "Nieprawidłowy format daty zakończenia" },
      ),

    stock: z
      .preprocess((a) => parseInt(z.string().parse(a), 10), z.number().min(1))
      .optional(),
    imageUrl: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    price: z.preprocess(
      (a) => (a ? parseFloat(z.string().parse(a)) : undefined),
      z.number().min(0).optional(),
    ),
    category: z.nativeEnum(Category).optional(),
    condition: z.enum(["new", "used", "damaged"]).optional(),
    location: z.string().min(2).optional(),

    type: z.enum(["auction", "buy_now"]).optional(),
    endsAt: z.string().optional(),
    stock: z.preprocess(
      (a) => (a ? parseInt(z.string().parse(a), 10) : undefined),
      z.number().min(1).optional(),
    ),
  }),
});
