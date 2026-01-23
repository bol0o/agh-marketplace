import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

//SECURITY CONFIGURATION
//Fail Fast
if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET is missing");
  process.exit(1);
}
if (!process.env.JWT_REFRESH_SECRET) {
  console.error("ERROR: JWT_REFRESH_SECRET is missing");
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// HELPER
const generateAuthResponse = (
  user: any,
  accessToken: string,
  refreshToken: string,
  soldCount: number = 0,
) => {
  return {
    token: accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatarUrl,
      role: user.role.toLowerCase(),

      address: {
        street: user.street || null,
        city: user.city || null,
        zipCode: user.zipCode || null,
        buildingNumber: user.buildingNumber || null,
        apartmentNumber: user.apartmentNumber || null,
        phone: user.phone || null,
      },

      studentInfo: {
        faculty: user.faculty || null,
        year: user.studentYear || 1,
      },
      rating: 0,
      ratingCount: 0,
      joinedAt: user.createdAt,
      listedProductsCount: 0,
      soldItemsCount: soldCount,
    },
  };
};

//REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    //acceptTerms is already validated by Zod schema
    const { email, password, firstName, lastName, studentId } = req.body;

    //AGH Validation
    if (!email.endsWith("@student.agh.edu.pl")) {
      return res.status(400).json({
        error:
          "Dostęp tylko dla studentów AGH (wymagany email @student.agh.edu.pl)",
      });
    }

    //Check if user exists
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

    //Auto-login after register
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    //Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken },
    });

    res.status(201).json(generateAuthResponse(user, accessToken, refreshToken));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Błąd serwera podczas rejestracji użytkownika" });
  }
};

//LOGIN (Generates Access & Refresh Tokens)
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Nieprawidłowy email lub hasło" });
    }

    //check if user is banned
    if (!user.isActive) {
      return res.status(403).json({
        error:
          "Twoje konto zostało zablokowane. Skontaktuj się z administratorem.",
      });
    }

    //Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Nieprawidłowy email lub hasło" });
    }

    const soldCount = await prisma.orderItem.count({
      where: {
        product: { sellerId: user.id },
        order: { status: "COMPLETED" },
      },
    });

    //Generate Access Token (15 min)
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" },
    );

    //Generate Refresh Token (7 days)
    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    //Save Refresh Token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken },
    });

    // Pass soldCount to the helper
    res.json(generateAuthResponse(user, accessToken, refreshToken, soldCount));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera podczas logowania" });
  }
};

//REFRESH TOKEN (Get new Access Token)
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) return res.sendStatus(401);

    //Verify signature
    jwt.verify(token, JWT_REFRESH_SECRET, async (err: any, decoded: any) => {
      if (err) return res.sendStatus(403); //Token invalid or expired

      //Find user and check if token matches DB
      //This prevents using an old refresh token after logout
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.refreshToken !== token) {
        return res.sendStatus(403);
      }

      //Generate new Access Token
      const newAccessToken = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "15m" },
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd odświeżania tokena" });
  }
};

//LOGOUT (Invalidate Refresh Token)
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (userId) {
      //Remove refresh token from DB
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    }

    res.json({ message: "Wylogowano pomyślnie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd wylogowywania" });
  }
};
