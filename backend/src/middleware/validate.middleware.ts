import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const zodError = result.error as ZodError;

      return res.status(400).json({
        error: "Błąd walidacji danych",
        details: zodError.issues.map((issue: any) => ({
          field: issue.path[1] || issue.path[0],
          message: issue.message,
        })),
      });
    }

    next();
  };
