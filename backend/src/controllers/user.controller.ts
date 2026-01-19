import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

//HELPER: Map DB User to Frontend 'User' Interface
const formatUserResponse = (user: any) => {
  //Calculate average rating
  const reviewsCount = user.reviewsReceived.length;
  const ratingSum = user.reviewsReceived.reduce(
    (acc: number, r: any) => acc + r.rating,
    0,
  );
  const avgRating = reviewsCount > 0 ? ratingSum / reviewsCount : 0;

  return {
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    avatar: user.avatarUrl,
    role: user.role.toLowerCase(), // 'student' | 'admin'

    studentInfo: {
      faculty: user.faculty || null,
      year: user.studentYear || null,
    },

    rating: parseFloat(avgRating.toFixed(1)),
    ratingCount: reviewsCount,
    joinedAt: user.createdAt,

    //Map flat DB columns to 'Address' object
    address: user.city
      ? {
          street: user.street,
          city: user.city,
          zipCode: user.zipCode,
          buildingNumber: user.buildingNumber,
          apartmentNumber: user.apartmentNumber,
          phone: user.phone,
        }
      : undefined,

    //Map flat DB columns to 'Settings' object
    settings: {
      notifications: {
        email: user.notifyEmail,
        push: user.notifyPush,
        marketing: user.marketing,
      },
    },

    //Statistics
    listedProductsCount: user._count.products,
    soldItemsCount: 0,
  };
};

// GET /api/users/me
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reviewsReceived: { select: { rating: true } }, // To calculate rating
        _count: { select: { products: true } }, // To count listed items
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(formatUserResponse(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching profile" });
  }
};

// PATCH /api/users/me (Avatar, Name, Faculty)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { firstName, lastName, avatarUrl, faculty, year } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        avatarUrl,
        faculty,
        studentYear: year,
      },
      include: {
        reviewsReceived: { select: { rating: true } },
        _count: { select: { products: true } },
      },
    });

    res.json(formatUserResponse(updatedUser));
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
};

// PATCH /api/users/me/address
export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { street, city, zipCode, buildingNumber, apartmentNumber, phone } =
      req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        street,
        city,
        zipCode,
        buildingNumber,
        apartmentNumber,
        phone,
      },
      include: {
        reviewsReceived: { select: { rating: true } },
        _count: { select: { products: true } },
      },
    });

    res.json(formatUserResponse(updatedUser));
  } catch (error) {
    res.status(500).json({ error: "Error updating address" });
  }
};

// PATCH /api/users/me/settings
export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { email, push, marketing } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        notifyEmail: email,
        notifyPush: push,
        marketing: marketing,
      },
      include: {
        reviewsReceived: { select: { rating: true } },
        _count: { select: { products: true } },
      },
    });

    res.json(formatUserResponse(updatedUser));
  } catch (error) {
    res.status(500).json({ error: "Error updating settings" });
  }
};

// GET /api/users/:id (Public Profile)
export const getPublicProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // fetch
    const [user, soldCount] = await prisma.$transaction([
      // 1. Get User Data
      prisma.user.findUnique({
        where: { id },
        include: {
          reviewsReceived: { select: { rating: true } },
          _count: { select: { products: true } },
        },
      }),
      // 2. Count items sold by this user
      prisma.product.count({
        where: {
          sellerId: id,
          status: "SOLD",
        },
      }),
    ]);

    if (!user) {
      return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    }

    // Calculate average rating
    const reviewsCount = user.reviewsReceived.length;
    const ratingSum = user.reviewsReceived.reduce(
      (acc, r) => acc + r.rating,
      0,
    );
    const avgRating = reviewsCount > 0 ? ratingSum / reviewsCount : 0;

    // Map to 'PublicUserProfile' interface
    const publicProfile = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatarUrl,
      studentInfo: {
        faculty: user.faculty || null,
        year: user.studentYear || null,
      },
      rating: parseFloat(avgRating.toFixed(1)),
      ratingCount: reviewsCount,
      joinedAt: user.createdAt,
      listedProductsCount: user._count.products,
      soldItemsCount: soldCount,
    };

    res.json(publicProfile);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Błąd podczas pobierania profilu użytkownika" });
  }
};
