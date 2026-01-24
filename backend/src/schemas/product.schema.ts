import { z } from "zod";
import { Category } from "@prisma/client";

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),

    // POPRAWKA: Akceptujemy number LUB string (i zamieniamy na number)
    price: z.preprocess(
      (a) => {
        if (typeof a === "string") return parseFloat(a);
        if (typeof a === "number") return a;
        return undefined;
      },
      z.number().min(0, { message: "Cena musi być liczbą nieujemną" }),
    ),

    category: z.nativeEnum(Category),
    condition: z.enum(["new", "used", "damaged"]),
    location: z.string().min(2),

    // POPRAWKA: isAuction może być booleanem (JSON) lub stringiem "true" (FormData)
    isAuction: z
      .preprocess((val) => {
        if (typeof val === "string") return val === "true";
        return val;
      }, z.boolean())
      .optional(),

    auctionEnd: z.string().optional(),

    imageUrl: z.string().optional(),

    // POPRAWKA: stock tak samo jak price
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
