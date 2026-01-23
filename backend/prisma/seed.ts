import "dotenv/config"; // 1. Load env vars first
import { PrismaClient, Role, Category, NotificationType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { fakerPL as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding process...");

  //PASSWORDS FROM ENV
  const rawAdminPass = process.env.ADMIN_PASSWORD;
  const rawStudentPass = process.env.STUDENT_PASSWORD;

  //Validation: Ensure passwords exist in .env
  if (!rawAdminPass || !rawStudentPass) {
    throw new Error(
      "Error: ADMIN_PASSWORD or STUDENT_PASSWORD missing in .env file",
    );
  }

  /// CLEAR DATABASE
  console.log("Cleaning database...");

  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.review.deleteMany();
  await prisma.follow.deleteMany();

  await prisma.chat.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();

  await prisma.cart.deleteMany();
  await prisma.order.deleteMany();

  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared.");

  //HASH PASSWORDS FROM ENV
  const studentPassword = await bcrypt.hash(rawStudentPass, 10);
  const adminPassword = await bcrypt.hash(rawAdminPass, 10);

  //Create Lecturer Account (Admin)
  const lecturer = await prisma.user.create({
    data: {
      email: "prowadzacy@agh.edu.pl",
      passwordHash: adminPassword,
      firstName: "Prowadzący",
      lastName: "Zajęcia",
      role: Role.ADMIN,
    },
  });
  console.log("Created Lecturer (Admin): prowadzacy@agh.edu.pl");

  const kaczmar = await prisma.user.create({
    data: {
      email: "kaczmar@student.agh.edu.pl",
      passwordHash: adminPassword,
      firstName: "Kaczmar",
      lastName: "Dev",
      studentId: "111111",
      role: Role.ADMIN,
    },
  });
  console.log("Created Your Account (Admin): kaczmar@student.agh.edu.pl");

  const bolek = await prisma.user.create({
    data: {
      email: "bolek@student.agh.edu.pl",
      passwordHash: adminPassword,
      firstName: "Bolek",
      lastName: "Programista",
      studentId: "222222",
      role: Role.ADMIN,
    },
  });
  console.log("Created Bolek's Account (Admin): bolek@student.agh.edu.pl");

  //STUDENTS

  // 8. Generate 20 random students
  const users = [kaczmar, bolek, lecturer];

  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({
          firstName,
          lastName,
          provider: "student.agh.edu.pl",
        }),
        passwordHash: studentPassword,
        firstName,
        lastName,
        studentId: faker.string.numeric(6),
        role: Role.STUDENT,
      },
    });
    users.push(user);
  }

  //PRODUCTS

  // 9. Generate 50 products
  const categories = Object.values(Category);

  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    let title = faker.commerce.productName();
    let imageText = "Produkt";

    if (randomCategory === "BOOKS") {
      title = "Podręcznik: " + faker.lorem.words(3);
      imageText = "Ksiazka";
    } else if (randomCategory === "ELECTRONICS") {
      title =
        faker.commerce.productAdjective() + " " + faker.commerce.product();
      imageText = "Elektronika";
    } else if (randomCategory === "CLOTHING") {
      title = "Bluza " + faker.commerce.productMaterial();
      imageText = "Ciuchy";
    }

    await prisma.product.create({
      data: {
        title: title,
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
        category: randomCategory,
        imageUrl: `https://placehold.co/600x400/png?text=${imageText}+${i}`,
        sellerId: randomUser.id,
        createdAt: faker.date.past(),
        views: faker.number.int({ min: 0, max: 500 }),
      },
    });
  }

  //notifications
  console.log("Seeding notifications...");

  for (const user of users) {
    // 1. SYSTEM
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: NotificationType.SYSTEM,
        title: "Witaj w AGH Marketplace!",
        message: "Cieszymy się, że dołączyłeś do naszej społeczności.",
        isRead: true,
        createdAt: faker.date.past({ years: 1 }),
      },
    });

    // 2. FOLLOW
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: NotificationType.FOLLOW,
        title: "Ktoś Cię obserwuje!",
        message: "Użytkownik z Twojego wydziału zaczął obserwować Twój profil.",
        isRead: false,
        createdAt: faker.date.recent({ days: 2 }),
      },
    });

    // 3. OFFER
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: NotificationType.OFFER,
        title: "Nowa oferta w kategorii Elektronika",
        message: "Sprawdź nowe laptopy dodane przez studentów WIEiT.",
        isRead: Math.random() > 0.5,
        createdAt: faker.date.recent({ days: 5 }),
      },
    });
  }

  //6 reviews per user
  console.log("Seeding reviews (6 per user)...");
  for (const user of users) {
    const potentialReviewers = users.filter((u) => u.id !== user.id);
    const selectedReviewers = faker.helpers.arrayElements(
      potentialReviewers,
      6,
    );

    for (const reviewer of selectedReviewers) {
      await prisma.review.create({
        data: {
          reviewerId: reviewer.id,
          revieweeId: user.id,
          rating: faker.number.int({ min: 2, max: 5 }),
          comment: faker.lorem.sentences(2),
          createdAt: faker.date.past(),
        },
      });
    }
  }

  console.log("Seeding finished successfully!");
  console.log(`Admin Password: ${rawAdminPass}`);
  console.log(`Student Password: ${rawStudentPass}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
