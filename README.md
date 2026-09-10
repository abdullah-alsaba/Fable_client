# Fable — Ebook Sharing Platform

## Overview

Fable is a full-stack digital publishing platform that connects readers with independent writers. Readers can browse, purchase, and read original ebooks across a range of genres; writers can publish and manage their work after a one-time verification payment; and administrators oversee users, content, and transactions across the platform.

Built on the **MERN stack with Next.js**, Fable demonstrates production-grade engineering practices, including role-based access control, Stripe payment processing, JWT and BetterAuth authentication, data visualization, and a polished, responsive UI.

**Live site:** [https://fable-nine-ashy.vercel.app](https://fable-nine-ashy.vercel.app)

---

## Key Features

### Authentication & Security
- JWT-based authentication with 7-day token expiry
- Email/password registration and login
- Google OAuth via BetterAuth, with JWT/session fallback
- Role-based access control for Reader, Writer, and Admin roles
- Environment-variable management for all API keys and database credentials

### Home Page
- Animated hero section with Framer Motion transitions
- Featured Ebooks: six randomly selected published titles via MongoDB `$sample`
- Top Writers: top three writers ranked by sales
- Genre grid (Fiction, Mystery, Romance, Sci-Fi, Fantasy, Horror, and more) linking to pre-filtered browse views

### Browse Ebooks (Public)
- Responsive grid layout (2 columns on mobile, 3 on tablet, 4 on desktop)
- Search by title, writer name, or genre
- Filters for genre, price range, and availability
- Sort by newest, price (ascending/descending), or title
- Pagination with configurable page size
- Skeleton loading states and an empty-state message

### Ebook Details Page
- Cover image, title, writer (linked), description, price, genre, status, and upload date
- Stripe Checkout integration for purchases
  - Purchase button disabled for the writer's own listings
  - Post-purchase, the button updates to "Already Purchased" and unlocks full content
- Bookmarking, backed by a dedicated collection
- 404 and loading states

### Role-Based Dashboards

**Reader Dashboard** (`/dashboard/user`)
- Purchase history (title, writer, price, date, status)
- Gallery of purchased ebooks
- Profile management
- Bookmarks

**Writer Dashboard** (`/dashboard/writer`)
- Ebook management: publish, unpublish, edit, and delete listings
- Add/edit ebook form with cover image upload via imgBB
- Sales history (title, buyer, date, amount)
- Bookmarks

**Admin Dashboard** (`/dashboard/admin`)
- Analytics overview: total users, writers, ebooks sold, and revenue
- Charts: monthly sales and ebook distribution by genre
- User management: role assignment and account removal
- Ebook management: publish, unpublish, or delete any listing
- Transaction log: ID, type, associated user, amount, and date

### Payments & Content
- Stripe Checkout for ebook purchases and writer verification fees
- imgBB integration for cover and profile image storage
- Post-purchase workflow: ebook marked as sold, purchase record created, notification logged

### UX & Reliability
- Global loading spinner and skeleton loaders
- Custom 404 page
- Error boundary with fallback UI
- Dark mode via next-themes, persisted in local storage
- Responsive navigation with active-route highlighting and role-aware dashboard links
- Newsletter signup placeholder in the footer

---

## Tech Stack

### Frontend (Next.js / React)
| Package | Purpose |
|---|---|
| `next`, `react`, `react-dom` | Application framework and UI runtime |
| `@heroui/react` | Component library |
| `better-auth` | Authentication, including Google OAuth |
| `next-themes` | Dark/light mode persistence |
| `framer-motion` | Animation and page transitions |
| `lucide-react` | Icon set |
| `recharts` | Analytics charts |
| `stripe`, `@stripe/react-stripe-js`, `@stripe/stripe-js` | Payment processing |
| `axios` | HTTP client for image uploads |
| `clsx`, `tailwind-merge` | Class-name composition |
| `sonner` | Toast notifications |
| `jsonwebtoken`, `bcryptjs` | Token handling and password hashing (client-side typing) |
| `tailwindcss`, `postcss`, `autoprefixer` | Styling |
| `@tailwindcss/typography` | Typography for ebook content |

### Backend (Node.js / Express / MongoDB)
| Package | Purpose |
|---|---|
| `express` | HTTP server |
| `cors` | Origin-restricted CORS policy |
| `dotenv` | Environment variable management |
| `mongodb` | Official MongoDB driver |
| `jsonwebtoken` | Auth middleware |
| `bcryptjs` | Password hashing and comparison |
| `stripe` | Server-side payment verification |
| `nanoid` | Unique ID generation (where applicable) |

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@fable.com | Admin@123 |

The admin account is seeded automatically on first server start if it does not already exist in the database.

---

## Deployment

**Frontend** (Next.js App Router → Vercel)
- Configure all `NEXT_PUBLIC_*` environment variables in project settings
- Enable rewrites for `api/auth/*` if proxying BetterAuth requests

**Backend** (Express → Render, Railway, or Vercel Edge)
- Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`
- Whitelist the hosting provider's IP in MongoDB Atlas Network Access (or allow `0.0.0.0/0` for demo purposes)

**Database** (MongoDB Atlas)
- Confirm Network Access and Database Access are properly configured before deployment