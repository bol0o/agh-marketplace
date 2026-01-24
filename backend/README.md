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
- **Real-time:** Socket.io
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

### Authentication (/api/auth)

1. POST /register - Register new user (AGH email required)

2. POST /login - Login (returns Access & Refresh Token)

3. POST /refresh - Refresh access token

4. POST /logout - Logout

### Users (/api/users)

1. GET /me - Get private profile details

2. PATCH /me - Update profile info (Name, Avatar, Faculty)

3. PATCH /me/address - Update shipping address

4. PATCH /me/settings - Update notification settings

5. GET /:id - Get public user profile (Ratings, Stats)

### Products (/api/products)

1. GET / - List products (Pagination, Filtering, Sorting)

2. GET /:id - Get product details

3. POST / - Create product (Auction or Buy Now)

4. PATCH /:id - Update product (Owner only)

5. DELETE /:id - Delete product (Owner or Admin)

### Bids / Auctions (/api/bids)

1. GET /product/:productId - Get bid history

2. POST / - Place a bid

### Cart (/api/cart)

1. GET / - Get current user cart

2. POST / - Add item to cart

3. PATCH /:itemId - Update item quantity

4. DELETE /:itemId - Remove item from cart

5. DELETE / - Clear entire cart

### Orders (/api/orders)

1. GET / - Get my purchase history

2. GET /sales - Get my sales history

3. GET /:id - Get order details (Buyer/Seller/Admin only)

4. POST / - Create order from cart

5. POST /:id/pay - Simulate payment

6. PATCH /:id/status - Update order status (Shipped/Delivered)

7. PATCH /:id/cancel - Cancel pending order

### Chat (/api/chats)

1. GET / - Get list of conversations (Inbox)

2. POST / - Start new conversation

3. GET /:chatId/messages - Get message history (marks as read)

4. POST /:chatId/messages - Send message

### Notifications (/api/notifications)

1. GET / - Get notifications list

2. GET /unread-count - Get count of unread notifications

3. PATCH /mark-all-read - Mark all as read

4. PATCH /:id/read - Mark single notification as read

5. DELETE /:id - Delete notification

### Social (/api/social)

1. POST /follow - Toggle follow user

2. GET /feed - Get products from followed users

3. GET /follow/status/:id - Check if following a specific user

4. DELETE /unfollow/:id - Explicitly unfollow user

### Reviews (/api/reviews)

1. GET /:userId - Get reviews received by user

2. POST / - Add review for a user (Seller)

3. DELETE /:reviewId - Delete review (Author or Admin)

### Reports (/api/reports)

1. POST / - Create report (User or Product)

2. Upload (/api/upload)

3. POST / - Upload image to Cloudinary

### Admin Panel (/api/admin) - Admin role required

1. GET /stats - Dashboard statistics (Revenue, Users, Listings)

2. GET /reports - List all reports

3. PATCH /reports/:id/resolve - Resolve report (Ban target or Dismiss)

4. GET /users - List all users (Pagination)

5. PATCH /users/:userId/status - Ban/Unban user

6. PATCH /users/:userId/role - Change user role

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

✅ Auction system

✅ Private chat system between buyers and sellers (socket)

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
2. Socket.io is used for real-time chat
3. All user emails must end with @student.agh.edu.pl (AGH students only)
4. Background jobs automatically close expired auctions and send notifications
5. Admin accounts can ban users and manage reports

## 📚 API Documentation

The project includes a comprehensive **Endpoint documentation** covering all endpoints.

**Location:** `https://drive.google.com/file/d/1S0yf-Rf0bcQOEWZSD5GLgLc5s8Vrr3iM/view?usp=sharing`
