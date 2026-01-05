# 🛒 AGH Marketplace - Backend

Final Project: AGH Marketplace with auctions.
The application enables trading products, real-time bidding, and communication between buyers and sellers exclusively for AGH students.

## 👥 Authors

- **Kamil Kaczmarczyk** - Backend & Database
- **Paweł Bolek** - Frontend

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Real-time:** Socket.io (bidding, chat, notifications)
- **Auth:** JWT (Access + Refresh Token)
- **Other:** Zod (validation), Docker (database containerization)

## ⚙️ Prerequisites

To run this project, you need:

1. **Node.js** (v18+)
2. **Docker Desktop** (to run the database container)

## 🛠️ Installation & Setup (Tutorial)

### Step 0: Clone the Repository

First, clone the project to your local machine:

```bash
git clone https://github.com/bol0o/agh-marketplace.git
cd agh-marketplace/backend
```

### Step 1: Environment Configuration

Create a `.env` file in the root directory and paste the following configuration:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agh_marketplace?schema=public"
JWT_SECRET="key"
JWT_REFRESH_SECRET="key_refresh"
ADMIN_PASSWORD="admin123"
STUDENT_PASSWORD="student123"
PORT=3001
# Optional (for images):
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start Database

Start the PostgreSQL container using Docker (ensure Docker Desktop is running):

```bash
npm run db:up
# or: docker-compose up -d
```

### Step 4: Database Setup & seeding

Run this single command to fix Prisma versions, push the schema to the database, and seed it with test data:

```bash
npm run setup:full
```

### Step 5: Start the Server

```bash
npm run dev
```

### Step 6: Database Preview (Optional)

To see your data (users, products, bids) in a browser, run:

```bash
npx prisma studio
```

The server should now be running at `http://localhost:3001`.

## 🌟 Features (Backend)

1. 👤 Users & Authentication

Registration and Login (JWT + Refresh Token).

Account banning by Administrator.

Profile editing (avatar, student data).

Role system (STUDENT, ADMIN).

2. 📦 Products & Auctions

Product CRUD (Create, Read, Update, Delete).

Auctions: Real-time bidding system (Socket.io).

Filtering, sorting, and searching products.

3. 🛒 Cart & Orders

Full shopping cart support.

Order placement (atomic transactions).

Purchase and sales history.

4. 💬 Community & Social

Chat: Private messages within product context (Real-time).

Notifications: System notifications for won auctions/new messages.

Reviews: User ratings and comments.

Following: Feed of products from followed users.

5. 🛡️ Admin Panel

Service statistics dashboard.

User management.

Report handling.

📚 API Documentation
