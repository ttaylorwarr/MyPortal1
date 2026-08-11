# KeyStay

A vacation-rental marketplace: browse hotels and houses to rent for **vacation or work**,
see the price and pictures, book a stay, and get a **digital key** on your account.

## Features

- Browse and filter listings by destination, trip type (vacation/work), stay type
  (hotel/house), and max price per night
- Listing detail pages with a photo gallery, description, amenities, and pricing
- Account signup/login (email + password)
- Book a stay by choosing dates and guest count; the total price is calculated
  from the number of nights
- After booking, a unique digital key code is generated and shown on the
  account page for every stay you've booked

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) with SQLite for storage
- Cookie-based sessions (`jose` for signed JWTs, `bcryptjs` for password hashing)

## Getting started

```bash
npm install
npx prisma migrate dev   # creates the local SQLite database
npx prisma db seed       # loads sample listings
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/` — pages, layouts, and server actions (App Router)
- `app/actions/` — server actions for auth and bookings
- `lib/` — database client, auth helpers, formatting helpers
- `prisma/schema.prisma` — data model (User, Property, Booking)
- `prisma/seed.ts` — sample listings
- `public/images/` — generated placeholder listing photos
