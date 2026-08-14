# TroysSafes

A vacation-rental marketplace: browse hotels and houses to rent for **vacation or work**,
see the price and pictures, book a stay, and get a **digital key** on your account. It also
includes a full staff back office — schedules, time clock, and a fictional in-app bank/credit
card feature.

## Features

### For guests

- Browse and filter listings by destination, stay type (hotel/house), and max price per night
- Listing detail pages with a photo gallery, description, amenities, and pricing
- Account signup/login (username or email + password)
- Book a stay by choosing dates and guest count; the total price is calculated
  from the number of nights
- After booking, a unique digital key code is generated and shown on the
  account page for every stay you've booked
- **Bank**: apply for a TroysSafes credit card; once an admin approves it, a
  10-digit card number and 4-digit PIN are generated automatically

### Roles

Accounts have one of four roles: `ADMIN`, `MANAGER`, `MEMBER`, `EMPLOYEE`.

- New staff (Manager/Employee) are hired via a one-time **Safe-Code**: an
  admin creates the account with no password, hands the code to the new
  hire, who visits `/activate`, enters the code, and sets their own password.
- **Employee area** (`/employee`, for Admin/Manager/Employee): a read-only
  monthly Schedule calendar, a Time Clock to clock in/out, and a Timesheet
  where employees can correct past entries (flagged for approval) or a
  manager/admin can edit and auto-approve.
- **Admin area** (`/admin`, Admin/Manager, some pages Admin-only):
  Dashboard, Listings (photo card grid, add/edit/toggle availability),
  Bookings (view/edit any booking), Manager Schedule (Admin-only — add,
  edit, and remove shifts for any staff member), Users (Admin-only —
  create accounts, generate Safe-Codes, edit roles), and Bank (Admin-only —
  approve/reject card applications, edit credit limits, freeze/unfreeze
  cards).

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) with Postgres for storage (works with Neon,
  Supabase, or any Postgres provider)
- Cookie-based sessions (`jose` for signed JWTs, `bcryptjs` for password hashing)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for listing photo uploads

## Getting started

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (a Postgres
   connection string) and `SESSION_SECRET` (`openssl rand -hex 32`).
2. Install dependencies and set up the database:

```bash
npm install
npx prisma migrate dev   # applies migrations to your database
npm run db:seed          # loads sample listings
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Use
`npm run db:make-admin -- <email>` to promote the first account to `ADMIN`
so you can reach `/admin`.

## Deploying

`npm run build` runs `prisma migrate deploy` before `next build`, so pushing
to a platform like Vercel automatically applies pending migrations as long as
`DATABASE_URL` and `SESSION_SECRET` are set as environment variables on the
project. Run `npm run db:seed` once (locally, pointed at the production
database) to load sample listings — it isn't run automatically on every
build since it clears and reloads the `Property` table.

## Project structure

- `app/` — pages, layouts, and server actions (App Router)
  - `app/actions/` — server actions (auth, account, bookings, admin,
    users/hire, schedule, timeclock, timesheet, bank)
  - `app/admin/` — admin area (listings, bookings, schedule, users, bank)
  - `app/employee/` — employee area (schedule, timeclock, timesheet)
  - `app/bank/` — guest-facing credit card application/status page
- `lib/` — database client, auth helpers, formatting/date helpers
- `prisma/schema.prisma` — data model (User, Property, Booking, Shift,
  TimeClockEntry, CreditCard)
- `prisma/migrations/` — hand-written SQL migrations
- `prisma/seed.ts` — sample listings
- `public/images/` — generated placeholder listing photos
