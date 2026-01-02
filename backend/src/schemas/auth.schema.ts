import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email({ message: "Nieprawidłowy format email" })
      .endsWith("@student.agh.edu.pl", {
        message: "Wymagany email w domenie @student.agh.edu.pl",
      }),
    password: z
      .string()
      .min(6, { message: "Hasło musi mieć minimum 6 znaków" }),
    firstName: z.string().min(2, { message: "Imię jest za krótkie" }),
    lastName: z.string().min(2, { message: "Nazwisko jest za krótkie" }),
    studentId: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "To nie jest poprawny email" }),
    password: z.string().min(1, { message: "Hasło jest wymagane" }),
  }),
});
