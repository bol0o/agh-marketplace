import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    avatarUrl: z.string().url().optional(),
    faculty: z.string().optional(),
    year: z.number().int().min(1).max(5).optional(),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    street: z.string().min(2),
    city: z.string().min(2),
    zipCode: z
      .string()
      .regex(/^\d{2}-\d{3}$/, "Invalid Zip Code format (XX-XXX)"),
    buildingNumber: z.string().min(1),
    apartmentNumber: z.string().optional(),
    phone: z.string().min(9),
  }),
});

export const updateSettingsSchema = z.object({
  body: z.object({
    email: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
  }),
});
