![motto](./images/motto.jpg)

### Made for AGH Intro to Web Applications course
📚 API Documentation
The project includes a comprehensive Endpoint documentation covering all endpoints.

Location: https://drive.google.com/file/d/1S0yf-Rf0bcQOEWZSD5GLgLc5s8Vrr3iM/view?usp=sharing

## 1. Overview

AGH Connect is a modern e-commerce platform made exclusively for AGH University students. It allows for safe buying and selling of items within the university community.

## 2. Setting up

### Prerequisites
- **Node v18+**
- **Docker Desktop**
- **npm** (comes with node)
- **git**

### Step 0:

First, clone the project to your local machine:

```bash
git clone https://github.com/bol0o/agh-marketplace.git
cd agh-marketplace/backend
```

### Step 1:

Create a `.env` file in both directories:

**Backend (`/backend/.env`)**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agh_marketplace?schema=public"
JWT_SECRET="key"
JWT_REFRESH_SECRET="key_refresh"
ADMIN_PASSWORD="admin123"
STUDENT_PASSWORD="student123"
PORT=3001

# Cloudinary variables (for uploading photos), you need to create an
# account and get them from https://cloudinary.com:
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

**Frontend (`/frontend/.env`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 2: Install dependencies

Install dependencies for both projects:

```bash
# Install backend dependencies
cd backend
npm install
```

```bash
# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Backend

**Make sure Docker Desktop is running**, then from /backend directory:

```bash
npm run db:up
# or: docker-compose up -d
```

Verify the database is running:

```bash
docker ps
# Should show a PostgreSQL container
```

If everything looks okay:

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
- Test data for some features (reviews, notifications)

And finally start the backend server:

```bash
npm run dev
# Server runs on: http://localhost:3001
```


### Frontend

In a new terminal, from the project root:

```bash
cd frontend
npm run dev
```

**Page will be available at:**
http://localhost:3000/

### Credentials for testing

**Admin accounts:**
1. bolek@student.agh.edu.pl
2. kaczmar@student.agh.edu.pl
3. prowadzacy@student.agh.edu.pl 

**Student accounts:**
When running `npm run setup:full`, at the end 3 example student emails are given.

**Password are set in /backend/.env file**

### Common issues

1. **Docker not starting**:

```bash
# Check Docker status
docker --version
docker-compose --version
```

2. **Database connection error**:

```bash
# Restart database
cd backend
npm run db:down
npm run db:up
```

3. **Prisma errors**:

```bash
cd backend
npx prisma generate
npx prisma db push
```

4. **Port already in use**:
Change PORT in backend .env or kill process on port 3001/3000

## 3. Techstack

### Frontend
- **Next.js 14** - Server-Side rendering and routing
- **React 19** - UI Framework
- **TypeScript** - Static Typing
- **SASS/SCSS** - CSS Preprocessor
- **Zustand** - State management
- **Axios** - HTTP Client
- **Socket.io** Client - Real-Time communication (used for chats)
- **Swiper** - Carousels
- **Lucide react** - Icons
- **Js-Cookie** - cookie management

### Backend
- **Node.js** + **Express 5** - API Server
- **TypeScript** - Static typing
- **Prisma ORM** - Database management
- **PostgreSQL** - Database
- **Socket.io** - Real-time communication
- **Cloudinary** - Image hosting
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Form validation
- **Multer** - File upload
- **Express Rate Limit** - Protection

### Dev tools
- **Docker** & **Docker Compose** - Database containerization
- **ESLint** - Linting

## 5. Main functionalities

### Marketplace Features

- Buy Now - Instant purchase of items
- Auction System - Bidding on items with time limits
- Bidding - Real-time bid updates and notifications
- Product Categories - Organized by student needs (Books, Electronics, etc.)

### User Features
- User Profiles with ratings and reviews
- Follow System - Follow other users
- Order History - Track purchases and sales
- Address Management - Shipping information

### Communication
- Real-Time Chat - Direct messaging between buyers and sellers
- Notifications - Instant updates for bids, messages, and orders
- Inbox System - Organized message threads

### Shopping Experience
- Shopping Cart - Add multiple items before checkout
- Order Tracking - Monitor order status
- Review System - Rate transactions and sellers

### Security & Moderation
- Reporting System - Report suspicious users or products
- User Roles - Admin and standard user permissions
 - Content Moderation - Flag inappropriate content

## 6. Authors
- **Paweł Bolek** - Design & Frontend Development
- **Kamil Kaczmarczyk** - Backend Development & Database Architecture
