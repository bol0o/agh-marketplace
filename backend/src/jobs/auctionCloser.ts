import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const startAuctionJob = () => {
  // Schedule the job to run every minute
  cron.schedule("* * * * *", async () => {
    console.log("Running auction closer job...");

    try {
      const now = new Date();

      //Find all auctions that have ended and are still open
      const expiredAuctions = await prisma.product.findMany({
        where: {
          isAuction: true,
          auctionEnd: {
            lte: now, //date of end is in the past
          },
          isAuctionClosed: false,
        },
        include: {
          bids: {
            orderBy: {
              amount: "desc",
            },
            take: 1, // Get the highest bid
          },
          seller: true,
        },
      });

      if (expiredAuctions.length === 0) {
        return;
      }

      console.log(`Found ${expiredAuctions.length} expired auctions.`);

      //Process each expired auction
      for (const product of expiredAuctions) {
        //use transaction to ensure notification and auction closing happen together or neither od them happen
        await prisma.$transaction(async (tx) => {
          const winnerBid = product.bids[0];

          if (winnerBid) {
            console.log(
              `Auction for product ${product.id} won by user ${winnerBid.userId} with bid ${winnerBid.amount}.`
            );

            // A. Notify the winner
            await tx.notification.create({
              data: {
                userId: winnerBid.userId,
                type: "AUCTION_WON",
                message: `Congratulations! You have won the auction for product "${product.title}" with a bid of ${winnerBid.amount}.`,
              },
            });

            // B. Notify the seller
            await tx.notification.create({
              data: {
                userId: product.sellerId,
                type: "AUCTION_ENDED",
                message: `Your auction for product "${product.title}" has ended. The winning bid is ${winnerBid.amount}.`,
              },
            });
          } else {
            console.log(
              `Auction for product ${product.id} ended with no bids.`
            );

            // C. Notify the seller about no bids
            await tx.notification.create({
              data: {
                userId: product.sellerId,
                type: "AUCTION_FAILED",
                message: `Your auction for product "${product.title}" has ended with no bids.`,
              },
            });
          }

          // D. Mark the auction as closed (ACHTUNG)
          await tx.product.update({
            where: { id: product.id },
            data: { isAuctionClosed: true },
          });
        });
      }
      console.log(
        "Auction closer job completed. All expired auctions processed."
      );
    } catch (error) {
      console.error("Error running auction closer job:", error);
    }
  });
};
