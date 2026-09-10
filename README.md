# 📚 Fable – Ebook Sharing Platform

## Project Overview

Fable is a full-stack digital platform that connects ebook lovers, readers, and collectors with talented independent writers. Readers can browse, discover, purchase, and read original ebooks across multiple genres. Writers can publish and manage their creations after a one-time verification payment, while an admin oversees users, content, and transactions system-wide.

Built with the **MERN + Next.js stack**, Fable demonstrates advanced web engineering concepts including role-based access control (RBAC), Stripe payment integration, JWT + BetterAuth authentication, interactive charts, Framer Motion animations, and a polished recruiter-friendly UI.

---

## 🌐 Live Site URL

> **Coming Soon** – Deployed on Vercel. Update this link before submission:
> `https://your-fable-app.vercel.app`

---

## ✨ Key Features

### Authentication & Security
- JWT-based authentication (7-day expiry)
- Email + password registration & login
- Google OAuth login via BetterAuth
- Role-based access: User (Reader), Writer, Admin
- Secure environment variables for all API keys and DB credentials
- BetterAuth session fallback + JWT token storage

### Home Page
- Stunning animated hero banner with digital-reading artwork
- Framer Motion fade-in / stagger animations throughout
- **Featured Ebooks** (6 randomly picked latest published ebooks via MongoDB `$sample`)
- **Top Writers** section (top 3 writers sorted by sales)
- **Ebook Genres** grid (Fiction, Mystery, Romance, Sci-Fi, Fantasy, Horror, etc.) linking to pre-filtered browse

### Browse Ebooks (Public Access)
- Responsive grid: 2 cols mobile → 3 cols tablet → 4 cols desktop
- **Search** by title / writer name / genre
- **Filter** by genre, price range (min–max), availability (in stock / sold)
- **Sort** by newest, price low→high, price high→low, title A→Z
- **Pagination** (6–12 items per page with nav controls)
- Skeleton loaders while fetching, friendly empty-state message
- Each card shows cover, title, writer, price, and a "Sold" badge if purchased

### Ebook Details Page (Public Preview + Authenticated Actions)
- High-resolution cover, title, writer (clickable), description, price, genre, status, upload date
- **Purchase Button** → Stripe Checkout
  - Auto-disabled if the buyer is the writer themselves
  - After payment: button becomes "Already Purchased" and full ebook content unlocks
- **Bookmark** ebooks to save for later (DB-backed bookmarks collection)
- 404 / Skeleton loader states

### Dashboards – Role-Specific

#### Reader Dashboard (`/dashboard/user`)
- Purchase history table (ebook name, writer, price, purchase date, status)
- Gallery view of purchased ebooks with links to details
- Profile management view
- Bookmark gallery page

#### Writer Dashboard (`/dashboard/writer`)
- Manage Ebooks: table of own works with publish / unpublish / edit / delete actions
- Add / Edit Ebook form (title, full content, price, genre, cover upload to imgBB)
- Sales History table (ebook title, buyer, date, amount)
- Bookmark gallery page

#### Admin Dashboard (`/dashboard/admin`)
- **Analytics overview cards** – total users, total writers, total ebooks sold, total revenue
- **Charts** – Monthly sales (bar/line) + Ebooks by genre (pie chart)
- Manage Users: change role (user / writer / admin) or delete any user
- Manage All Ebooks: publish / unpublish / delete any ebook
- View All Transactions: transaction ID, type (purchase / publishing fee), user/writer email, amount, date

### Payment & Content
- **Stripe Checkout** integration for ebook purchases + writer publishing fee
- **imgBB** API for storing ebook cover images and profile pictures
- After successful purchase: ebook marked as sold → purchase record stored → dummy email notification (console log)

### UX / System
- Global loading spinner, skeleton loaders for cards and table rows
- Custom 404 page with illustration + "Go Home" button
- Runtime Error Boundary fallback UI ("Something went wrong. Reload.")
- Dark mode toggle (next-themes) persisted in localStorage
- Fully responsive navbar with hamburger menu, active-route highlighting, and role-aware dashboard link
- Beautiful newsletter placeholder UI in footer

---

## 🛠️ NPM Packages Used

### Frontend (Next.js + React)
- **next** – React Framework (App Router)
- **react** **react-dom** – UI Runtime
- **@heroui/react** – Modern component library (Card, Button, etc.)
- **better-auth** – Secure authentication + Google OAuth
- **next-themes** – Dark / light mode with persistence
- **framer-motion** – Smooth animations and page transitions
- **lucide-react** – Beautiful, consistent SVG icons
- **recharts** – Analytics charts (monthly sales + genre pie)
- **stripe** – Server-side Stripe session creation
- **@stripe/react-stripe-js** **@stripe/stripe-js** – Client-side Stripe helpers
- **@imgbb/imgbb** (axios-based upload) – imgBB image hosting API
- **axios** – HTTP client (cover-image uploads)
- **clsx** **tailwind-merge** – Class-name composition utilities
- **sonner** / custom toast – API error toasts
- **jsonwebtoken** – JWT creation & verification helpers
- **bcryptjs** – Password hashing (server-compatible client typing)
- **tailwindcss** **postcss** **autoprefixer** – Tailwind CSS v3
- **@tailwindcss/typography** – Beautiful prose for ebook content

### Backend (Node.js + Express + MongoDB)
- **express** – HTTP Server
- **cors** – Production-friendly CORS (origin-allow list)
- **dotenv** – Environment variable management
- **mongodb** – Official MongoDB Node Driver
- **jsonwebtoken** – JWT auth middleware (7-day tokens)
- **bcryptjs** – Password hashing & comparison for email/password login
- **stripe** – Server-side Stripe payment verification helpers
- **nanoid** (if present) – Unique ID generation

---

## 📌 Submission Credentials

| Role   | Email               | Password      |
|--------|---------------------|---------------|
| Admin  | admin@fable.com     | Admin@123     |

> The admin account is seeded automatically the first time the server starts if it does not already exist in the database.

---

## 🚀 Deployment Notes

- **Frontend**: Next.js App Router → deploy on Vercel
  - Set all `NEXT_PUBLIC_*` variables in Vercel project settings
  - Enable rewrites for `api/auth/*` if proxying BetterAuth
- **Backend**: Express.js → deploy on Render / Railway / Vercel Edge
  - Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
  - Whitelist hosting IP in MongoDB Atlas Network Access (or use 0.0.0.0/0 for demo)
- **MongoDB Atlas**: Ensure cluster has Network Access + Database Access configured

Built with ❤️ for digital literature enthusiasts.
