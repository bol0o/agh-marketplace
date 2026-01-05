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
- **Validation:** Zod
- **File Upload:** Cloudinary + Multer
- **Background Jobs:** node-cron
- **Containerization:** Docker (PostgreSQL)

📁 Project Structure

```text
backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data generator
├── src/
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Auth, validation, rate limiting
│   ├── routes/              # API routes
│   ├── schemas/             # Zod validation schemas
│   ├── jobs/                # Background jobs (auction closer)
│   ├── socket/              # Socket.io setup
│   └── index.ts             # Main application file
├── docker-compose.yml       # Database container setup
├── package.json
└── README.md
```

## ⚙️ Prerequisites

To run this project, you need:

1. **Node.js** (v18+)
2. **Docker Desktop** (to run the database container)
3. **npm** (comes with Node.js)

## 🛠️ Installation & Setup (Tutorial)

### Step 0: Clone the Repository and navigate

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

Verify the database is running:

```bash
docker ps
# Should show a PostgreSQL container
```

### Step 4: Database Setup & seeding

Run the complete setup command:

```bash
npm run setup:full
```

This command will:

1. Generate Prisma Client
2. Push the database schema
3. Seed the database with:

- Admin accounts (prowadzacy, kaczmar, bolek)
- 20 random student accounts
- 50 sample products
- Test data for all features

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

## 📡 API Endpoints

### Authentication

1. POST /api/auth/register - Register new user

2. POST /api/auth/login - Login

3. POST /api/auth/refresh - Refresh access token

4. POST /api/auth/logout - Logout

### Products

1. GET /api/products - List products with filters

2. GET /api/products/:id - Get product details

3. POST /api/products - Create product (authenticated)

4. PATCH /api/products/:id - Update product (owner/admin)

5. DELETE /api/products/:id - Delete product (owner/admin)

### Cart

1. GET /api/cart - Get user's cart

2. POST /api/cart - Add item to cart

3. PATCH /api/cart/:itemId - Update quantity

4. DELETE /api/cart/:itemId - Remove item

### Orders

1. GET /api/orders - Get user's orders

2. GET /api/orders/sales - Get user's sales

3. POST /api/orders - Create order from cart

4. GET /api/orders/:id - Get order details

### Auctions & Bids

1. GET /api/bids/product/:productId - Get bids for product

2. POST /api/bids - Place a bid (authenticated)

### Social Features

1. GET /api/social/feed - Get feed from followed users

2. POST /api/social/follow - Follow/unfollow user

### Chat

1. GET /api/chat - Get user's chats

2. POST /api/chat - Start new chat

3. GET /api/chat/:chatId/messages - Get chat messages

4. POST /api/chat/:chatId/messages - Send message

### User Management

1. GET /api/users/me - Get current user profile

2. PATCH /api/users/me - Update profile

3. GET /api/users/:id - Get public profile

### Admin (Admin role required)

1. GET /api/admin/stats - Dashboard statistics

2. GET /api/admin/users - List all users

3. PATCH /api/admin/users/:userId/status - Ban/unban user

4. GET /api/admin/reports - List reports

## 🔐 Authentication Flow

1. Registration/Login → Returns accessToken (15min) and refreshToken (7 days)

2. API Requests → Include header: Authorization: Bearer <accessToken>

3. Token Expiry → Call /api/auth/refresh with refreshToken to get new accessToken

4. Logout → Invalidates refreshToken

## 🎯 Features Implemented

## Core Requirements

✅ User registration/login with JWT + Refresh Token

✅ Product CRUD operations

✅ Shopping cart functionality

✅ Order management

✅ Product reviews and ratings

### Extended Features

✅ Auction system with real-time bidding (Socket.io)

✅ Private chat system between buyers and sellers

✅ User following and personalized feed

✅ Notifications system

✅ Admin panel with user management

✅ Background job for auction closing

✅ File upload to Cloudinary

✅ Input validation with Zod

✅ Rate limiting for security

## 🧪 Testing Credentials

### After seeding, you can log in with:

Admin Accounts (Role: ADMIN)
Email: prowadzacy@agh.edu.pl | Password: admin123

Email: kaczmar@student.agh.edu.pl | Password: admin123

Email: bolek@student.agh.edu.pl | Password: admin123

Student Accounts (Role: STUDENT)
20 randomly generated accounts with emails like firstName.lastName@student.agh.edu.pl

Password for all: student123

## 📦 Available Scripts

### Development

1. npm run dev - Start development server with hot reload using ts-node
2. npm run build - Compile TypeScript to JavaScript
3. npm start - Start production server from compiled code
4. npm run lint - Run ESLint to check code quality

### Database Management

1. npm run db:up - Start PostgreSQL container using Docker Compose
2. npm run db:down - Stop and remove PostgreSQL container
3. npm run db:reset - Reset database (drop all tables and re-run migrations)

### Prisma ORM

1. npm run prisma:generate - Generate Prisma Client from schema
2. npm run prisma:push - Push schema changes to database (no migrations)
3. npm run seed - Seed database with test data

### Setup & Maintenance

npm run fix:prisma - Fix Prisma version conflicts and regenerate client

1. Installs specific versions: prisma@5.22.0 and @prisma/client@5.22.0
2. Runs npx prisma generate to regenerate client

npm run setup:full - Complete setup for new development environment

1. Fix Prisma versions and generate client
2. Push schema to database
3. Seed with test data

## ⚠️ Troubleshooting

### Database Connection Issues

1. Ensure Docker Desktop is running
2. Check if container is up: docker ps
3. Verify DATABASE_URL in .env matches docker-compose.yml

### Prisma Errors

1. Run npx prisma generate after schema changes
2. Use npm run setup:full for fresh setup

## 📝 Notes

1. The backend is designed to work with a separate frontend application
2. Socket.io is used for real-time features: bidding, chat, and notifications
3. All user emails must end with @student.agh.edu.pl (AGH students only)
4. Background jobs automatically close expired auctions and send notifications
5. Admin accounts can ban users and manage reports

## 📚 API Documentation

The project includes a comprehensive **Postman Collection** covering all endpoints, authentication flows, and real-time socket events.

**Location:** `postman/AGH_marketplace.postman_collection.json`

### How to use:

1. Open **Postman**.
2. Click **Import** (top left corner).
3. Drag and drop the `.json` file from the `postman/` folder.
4. The collection includes:
   - Automated token management (scripts for login/refresh).
   - Example request bodies and responses.
   - Detailed descriptions of business logic.

**Note:** Ensure your Postman environment variable `{{baseURL}}` is set to `http://localhost:3001` (or use the default configuration provided in the collection).
