import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "key"; //czemu tutaj or key ?

//Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, studentId } = req.body;

    //AGH validiation
    if (!email.endsWith("@student.agh.edu.pl")) {
      return res.status(400).json({
        error:
          "Dostęp tylko dla studentów AGH (wymagany email @student.agh.edu.pl)",
      });
    }

    //Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Użytkownik już istnieje" });
    }

    //Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    //Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        studentId,
        role: "STUDENT",
      },
    });

    res.status(201).json({ message: "Użytkownik zarejestrowany pomyślnie" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Błąd serwera podczas rejestracji użytkownika" });
  }
};

//Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Nieprawidłowy email lub hasło" });
    }

    //Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Nieprawidłowy email lub hasło" });
    }

    //Generate JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
      message: "Zalogowano pomyślnie",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Błąd serwera podczas logowania użytkownika" });
  }
};
