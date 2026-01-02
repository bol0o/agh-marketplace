import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Tytuł musi mieć min. 3 znaki").max(100),
    description: z.string().min(10, "Opis musi mieć min. 10 znaków"),

    price: z
      .string()
      .min(1, "Cena jest wymagana")
      .refine((val) => !isNaN(Number(val)), {
        message: "Cena musi być liczbą",
      }),

    category: z.enum([
      "BOOKS",
      "ELECTRONICS",
      "ACCESSORIES",
      "CLOTHING",
      "OTHER",
    ]),

    isAuction: z.enum(["true", "false"]).optional(),

    auctionEnd: z
      .string()
      .datetime({ message: "Nieprawidłowy format daty (wymagane ISO)" })
      .optional(),
  }),
});
