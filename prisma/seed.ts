import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

function img(slug: string, count: number) {
  return Array.from({ length: count }, (_, i) => `/images/${slug}-${i + 1}.svg`).join(",");
}

const properties = [
  {
    title: "Sunny Beachfront Villa",
    type: "HOUSE" as const,
    purpose: "VACATION" as const,
    city: "Malibu",
    country: "USA",
    pricePerNight: 420,
    description:
      "A bright, airy villa steps from the sand with panoramic ocean views, a private pool, and a sun-soaked deck perfect for long vacation mornings.",
    amenities: "Pool,Ocean view,WiFi,Kitchen,Free parking,Air conditioning",
    images: img("malibu-villa", 4),
    maxGuests: 8,
    bedrooms: 4,
    rating: 4.9,
  },
  {
    title: "Downtown Executive Suite",
    type: "HOTEL" as const,
    purpose: "WORK" as const,
    city: "Chicago",
    country: "USA",
    pricePerNight: 189,
    description:
      "A polished hotel suite in the heart of the financial district with a dedicated desk, fast WiFi, and 24-hour business center access.",
    amenities: "Fast WiFi,Work desk,Gym,Room service,Business center,Coffee maker",
    images: img("chicago-suite", 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.6,
  },
  {
    title: "Mountain Cabin Retreat",
    type: "HOUSE" as const,
    purpose: "VACATION" as const,
    city: "Aspen",
    country: "USA",
    pricePerNight: 310,
    description:
      "A cozy wood cabin surrounded by pine forest with a fireplace, hot tub, and easy access to hiking and ski trails.",
    amenities: "Hot tub,Fireplace,WiFi,Kitchen,Free parking,Mountain view",
    images: img("aspen-cabin", 4),
    maxGuests: 6,
    bedrooms: 3,
    rating: 4.8,
  },
  {
    title: "Quiet Remote-Work Loft",
    type: "HOUSE" as const,
    purpose: "WORK" as const,
    city: "Austin",
    country: "USA",
    pricePerNight: 145,
    description:
      "A minimalist loft with an ergonomic office setup, blazing-fast fiber internet, and a quiet street perfect for focused workdays.",
    amenities: "Fast WiFi,Work desk,Kitchen,Washer,Air conditioning,Free parking",
    images: img("austin-loft", 4),
    maxGuests: 3,
    bedrooms: 1,
    rating: 4.7,
  },
  {
    title: "Historic City Center Hotel",
    type: "HOTEL" as const,
    purpose: "BOTH" as const,
    city: "Boston",
    country: "USA",
    pricePerNight: 210,
    description:
      "A charming boutique hotel in a restored 19th-century building, blending old-world character with modern comfort for work or leisure.",
    amenities: "WiFi,Work desk,Gym,Breakfast included,Bar,Concierge",
    images: img("boston-hotel", 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.5,
  },
  {
    title: "Lakeside Family House",
    type: "HOUSE" as const,
    purpose: "VACATION" as const,
    city: "Lake Tahoe",
    country: "USA",
    pricePerNight: 275,
    description:
      "A spacious lakeside house with a private dock, large deck, and stunning sunset views over the water.",
    amenities: "Lake access,Dock,WiFi,Kitchen,BBQ grill,Free parking",
    images: img("tahoe-house", 4),
    maxGuests: 10,
    bedrooms: 5,
    rating: 4.8,
  },
  {
    title: "Skyline Business Hotel",
    type: "HOTEL" as const,
    purpose: "WORK" as const,
    city: "New York",
    country: "USA",
    pricePerNight: 265,
    description:
      "A high-rise hotel with skyline views, a full business center, meeting rooms, and quick access to the financial district.",
    amenities: "Fast WiFi,Work desk,Meeting rooms,Gym,Room service,City view",
    images: img("nyc-hotel", 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.7,
  },
  {
    title: "Desert Modern Retreat",
    type: "HOUSE" as const,
    purpose: "VACATION" as const,
    city: "Scottsdale",
    country: "USA",
    pricePerNight: 240,
    description:
      "A sleek modern home with floor-to-ceiling windows, a private pool, and unbeatable desert sunset views.",
    amenities: "Pool,Desert view,WiFi,Kitchen,Air conditioning,Free parking",
    images: img("scottsdale-house", 4),
    maxGuests: 6,
    bedrooms: 3,
    rating: 4.6,
  },
  {
    title: "Cozy Studio Near Campus",
    type: "HOUSE" as const,
    purpose: "WORK" as const,
    city: "Seattle",
    country: "USA",
    pricePerNight: 98,
    description:
      "A compact, efficient studio with a proper desk setup and reliable WiFi, ideal for a short work trip or extended stay.",
    amenities: "Fast WiFi,Work desk,Kitchenette,Washer,Coffee maker",
    images: img("seattle-studio", 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.4,
  },
  {
    title: "Tropical Garden Bungalow",
    type: "HOUSE" as const,
    purpose: "VACATION" as const,
    city: "Key West",
    country: "USA",
    pricePerNight: 190,
    description:
      "A private bungalow tucked in a lush tropical garden, with an outdoor shower, hammock, and short walk to the beach.",
    amenities: "Garden,Outdoor shower,WiFi,Kitchen,Bikes included,Free parking",
    images: img("keywest-bungalow", 4),
    maxGuests: 4,
    bedrooms: 2,
    rating: 4.9,
  },
  {
    title: "Airport Convenience Hotel",
    type: "HOTEL" as const,
    purpose: "WORK" as const,
    city: "Dallas",
    country: "USA",
    pricePerNight: 129,
    description:
      "A no-fuss, efficient hotel minutes from the airport with a business lounge, express checkout, and reliable WiFi for travelers between meetings.",
    amenities: "Fast WiFi,Work desk,Shuttle service,Gym,24-hour front desk",
    images: img("dallas-hotel", 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.3,
  },
  {
    title: "Vineyard Country House",
    type: "HOUSE" as const,
    purpose: "BOTH" as const,
    city: "Napa Valley",
    country: "USA",
    pricePerNight: 355,
    description:
      "An elegant country house surrounded by vineyards, with a quiet office nook, wraparound porch, and a wine cellar to explore in the evenings.",
    amenities: "Vineyard view,Work desk,WiFi,Kitchen,Wine cellar,Free parking",
    images: img("napa-house", 4),
    maxGuests: 8,
    bedrooms: 4,
    rating: 4.9,
  },
];

async function main() {
  console.log("Seeding properties…");
  await prisma.booking.deleteMany();
  await prisma.property.deleteMany();

  for (const property of properties) {
    await prisma.property.create({ data: property });
  }

  console.log(`Seeded ${properties.length} properties.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
