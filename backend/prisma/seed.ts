import { PrismaClient, Category, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Wyczyść bazę
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Baza wyczyszczona");

  // 2. Haszowanie hasła (hasło: "student123")
  const passwordHash = await bcrypt.hash("student123", 10);

  // 3. Tworzenie użytkowników
  const admin = await prisma.user.create({
    data: {
      email: "admin@agh.edu.pl",
      passwordHash,
      firstName: "Admin",
      lastName: "Systemowy",
      role: Role.ADMIN,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student@student.agh.edu.pl",
      passwordHash,
      firstName: "Jan",
      lastName: "Kowalski",
      studentId: "123456",
      role: Role.STUDENT,
    },
  });

  const teacher = await prisma.user.create({
    data: {
      email: "prow@agh.edu.pl",
      passwordHash,
      firstName: "Dr",
      lastName: "Prowadzący",
      role: Role.TEACHER,
    },
  });

  console.log("👥 Utworzono użytkowników (Hasło: student123)");

  // 4. Tworzenie produktów
  const products = await prisma.product.createMany({
    data: [
      {
        title: "Analiza Matematyczna - Krysicki Włodarski",
        description:
          "Klasyk. Stan dobry, trochę popłakana na stronach z całkami.",
        price: 45.0,
        category: Category.BOOKS,
        sellerId: student.id,
        imageUrl: "https://placehold.co/600x400/png?text=Ksiazka",
      },
      {
        title: "Kalkulator Casio FX-991EX",
        description: "Liczy macierze i całki. Niezbędny na egzamin.",
        price: 80.0,
        category: Category.ELECTRONICS,
        sellerId: student.id,
        imageUrl: "https://placehold.co/600x400/png?text=Kalkulator",
      },
      {
        title: "Bluza Wydziałowa WIEiT",
        description: "Rozmiar L, nowa, nieśmigana.",
        price: 120.0,
        category: Category.CLOTHING,
        sellerId: student.id,
        imageUrl: "https://placehold.co/600x400/png?text=Bluza",
      },
    ],
  });

  console.log("📦 Dodano produkty");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
