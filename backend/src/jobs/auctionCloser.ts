import cron from "node-cron";
import { PrismaClient, NotificationType } from "@prisma/client";

const prisma = new PrismaClient();

export const startAuctionJob = () => {
  // Schedule the job to run every minute
  cron.schedule("* * * * *", async () => {
    console.log("Running auction closer job...");

    try {
      const now = new Date();

      // Find all auctions that have ended and are still open
      const expiredAuctions = await prisma.product.findMany({
        where: {
          isAuction: true,
          auctionEnd: {
            lte: now, // date of end is in the past
          },
          isAuctionClosed: false,
        },
        include: {
          bids: {
            orderBy: {
              amount: "desc",
            },
            take: 1, // Get the highest bid
            include: {
              user: true,
            },
          },
          seller: true,
        },
      });

      if (expiredAuctions.length === 0) {
        return;
      }

      console.log(`Found ${expiredAuctions.length} expired auctions.`);

      // Process each expired auction
      for (const product of expiredAuctions) {
        // Use transaction to ensure order creation, notification, and closing happen together
        await prisma.$transaction(async (tx) => {
          const winnerBid = product.bids[0];

          if (winnerBid) {
            const winner = winnerBid.user;
            const SHIPPING_COST = 15.0;

            console.log(
              `Auction for product ${product.id} won by user ${winnerBid.userId} with bid ${winnerBid.amount}.`,
            );

            // 1. Create a PENDING order for the winner using their profile address
            await tx.order.create({
              data: {
                userId: winner.id,
                totalPrice: winnerBid.amount + SHIPPING_COST,
                shippingCost: SHIPPING_COST,
                status: "PENDING",
                // Map winner's profile address to the order snapshot
                shippingStreet: winner.street || "Address not provided",
                shippingBuildingNumber: winner.buildingNumber || "N/A",
                shippingApartmentNumber: winner.apartmentNumber || null,
                shippingCity: winner.city || "Not provided",
                shippingZipCode: winner.zipCode || "00-000",
                shippingPhone: winner.phone || "000000000",
                items: {
                  create: {
                    productId: product.id,
                    quantity: 1,
                    priceAtTime: winnerBid.amount,
                    snapshotTitle: product.title,
                    snapshotImage: product.imageUrl,
                  },
                },
              },
            });

            // 2. Notify the winner
            await tx.notification.create({
              data: {
                userId: winnerBid.userId,
                type: NotificationType.ORDER,
                title: "Wygrałeś aukcję!",
                message: `Gratulacje! Wygrałeś aukcję produktu "${product.title}" za ${winnerBid.amount} PLN. Przejdź do zamówienia, aby opłacić produkt.`,
                isRead: false,
              },
            });

            // 3. Notify the seller
            await tx.notification.create({
              data: {
                userId: product.sellerId,
                type: NotificationType.ORDER,
                title: "Aukcja zakończona sukcesem",
                message: `Twoja aukcja produktu "${product.title}" zakończyła się sukcesem. Kwota: ${winnerBid.amount} PLN.`,
                isRead: false,
              },
            });

            // 4. Update product status to SOLD and set stock to 0
            await tx.product.update({
              where: { id: product.id },
              data: {
                isAuctionClosed: true,
                status: "SOLD",
                stock: 0,
              },
            });
          } else {
            console.log(
              `Auction for product ${product.id} ended with no bids.`,
            );

            // 5. Notify the seller about no bids
            await tx.notification.create({
              data: {
                userId: product.sellerId,
                type: NotificationType.BID,
                title: "Aukcja zakończona bez ofert",
                message: `Twoja aukcja produktu "${product.title}" zakończyła się bez złożonych ofert.`,
                isRead: false,
              },
            });

            // 6. Mark the auction as closed
            await tx.product.update({
              where: { id: product.id },
              data: { isAuctionClosed: true },
            });
          }
        });
      }
      console.log(
        "Auction closer job completed. All expired auctions processed.",
      );
    } catch (error) {
      console.error("Error running auction closer job:", error);
    }
  });
};
