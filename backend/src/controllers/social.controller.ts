import { Response } from "express";
import { PrismaClient, NotificationType } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// toggle follow user
export const toggleFollow = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.user?.userId;
    const { followingId } = req.body; //user to follow/unfollow

    if (!followerId) {
      return res.status(401).json({ message: "Nieautoryzowany dostęp" });
    }

    if (followerId === followingId) {
      return res
        .status(400)
        .json({ message: "Nie możesz obserwować samego siebie" });
    }

    //check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      //unfollow
      await prisma.follow.delete({ where: { id: existingFollow.id } });
      return res.status(200).json({
        message: "Przestałeś obserwować użytkownika",
        isFollowing: false,
      });
    } else {
      //follow
      await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });

      // Fetch follower details to create a notification message
      const followerUser = await prisma.user.findUnique({
        where: { id: followerId },
      });

      // Create notification for the user being followed
      if (followerUser) {
        await prisma.notification.create({
          data: {
            userId: followingId, // The user who receives the notification
            type: NotificationType.FOLLOW, // Using the Enum
            title: "Nowy obserwujący",
            message: `Użytkownik ${followerUser.firstName} ${followerUser.lastName} zaczął Cię obserwować.`,
            isRead: false,
          },
        });
      }

      return res.status(200).json({
        message: "Zacząłeś obserwować użytkownika",
        isFollowing: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Błąd zmiany statusu obserwowania" });
  }
};

//Get Feed (products of followed users)
export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Nieautoryzowany dostęp" });
    }

    //1. get list of IDs the user is following
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    //2. fetch products where sellerId in followingIds
    const products = await prisma.product.findMany({
      where: {
        sellerId: { in: followingIds },
      },
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Nie udało się pobrać feedu" });
  }
};

// GET /api/social/follow/status/:id
export const getFollowStatus = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.user?.userId;
    const { id: followingId } = req.params; // ID of the user we are checking

    if (!followerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if follow record exists in DB
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return res.status(200).json({
      isFollowing: !!follow, // Returns true if record exists, false otherwise
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error checking follow status" });
  }
};

// DELETE /api/social/unfollow/:id
export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.user?.userId;
    const { id: followingId } = req.params;

    if (!followerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attempt to delete the follow record
    // We use deleteMany to avoid errors if the record doesn't exist
    const deleteResult = await prisma.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });

    return res.status(200).json({
      message: "Successfully unfollowed user",
      isFollowing: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during unfollow process" });
  }
};
