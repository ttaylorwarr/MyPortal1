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

// Real hotel-room photos, keyed by a stable "lock" so each listing always
// gets the same set of images instead of a random one on every request.
function hotelImg(keywords: string, lockSeed: number, count: number) {
  return Array.from(
    { length: count },
    (_, i) => `https://loremflickr.com/1200/800/${keywords}?lock=${lockSeed + i}`
  ).join(",");
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
    images: hotelImg("hotel,suite", 100, 4),
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
    images: hotelImg("hotel,lobby", 110, 4),
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
    images: hotelImg("hotel,skyline", 120, 4),
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
    images: hotelImg("hotel,airport", 130, 4),
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
  {
    title: "Oceanview King Suite",
    type: "HOTEL" as const,
    purpose: "VACATION" as const,
    city: "Miami",
    country: "USA",
    pricePerNight: 275,
    description:
      "A bright king suite with floor-to-ceiling windows facing the Atlantic, a soaking tub, and a private balcony perfect for sunrise coffee.",
    amenities: "Ocean view,Balcony,King bed,Soaking tub,WiFi,Room service",
    images: hotelImg("hotel,ocean,room", 140, 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.8,
  },
  {
    title: "Downtown Business Room",
    type: "HOTEL" as const,
    purpose: "WORK" as const,
    city: "Denver",
    country: "USA",
    pricePerNight: 165,
    description:
      "An efficient room built for work trips, with a dedicated desk, ergonomic chair, and blackout curtains for resetting between meetings.",
    amenities: "Work desk,Fast WiFi,Coffee maker,Ergonomic chair,Gym access",
    images: hotelImg("hotel,office,room", 150, 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.5,
  },
  {
    title: "Skyline Corner Suite",
    type: "HOTEL" as const,
    purpose: "BOTH" as const,
    city: "Toronto",
    country: "Canada",
    pricePerNight: 230,
    description:
      "A wraparound corner suite with two walls of windows overlooking the skyline, a lounge area, and a well-lit desk for daytime work.",
    amenities: "City view,Work desk,Lounge area,Minibar,Fast WiFi",
    images: hotelImg("hotel,room,city", 160, 4),
    maxGuests: 3,
    bedrooms: 1,
    rating: 4.7,
  },
  {
    title: "Garden Terrace Room",
    type: "HOTEL" as const,
    purpose: "VACATION" as const,
    city: "Charleston",
    country: "USA",
    pricePerNight: 195,
    description:
      "A ground-floor room opening onto a private garden terrace, filled with morning light and the smell of jasmine in bloom.",
    amenities: "Private terrace,Garden view,WiFi,Coffee maker,Free parking",
    images: hotelImg("hotel,garden,room", 170, 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.7,
  },
  {
    title: "Rooftop Pool Suite",
    type: "HOTEL" as const,
    purpose: "VACATION" as const,
    city: "Las Vegas",
    country: "USA",
    pricePerNight: 245,
    description:
      "Steps from the rooftop pool and bar, this suite has a plush king bed, a soaking tub, and floor-to-ceiling views of the Strip at night.",
    amenities: "Pool access,Strip view,King bed,Minibar,Room service",
    images: hotelImg("hotel,pool,room", 180, 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.6,
  },
  {
    title: "Classic Queen Room",
    type: "HOTEL" as const,
    purpose: "VACATION" as const,
    city: "Savannah",
    country: "USA",
    pricePerNight: 149,
    description:
      "A warm, traditionally furnished room in a historic property, with antique details, soft lighting, and a queen bed dressed in linen.",
    amenities: "WiFi,Coffee maker,Breakfast included,Antique furnishings",
    images: hotelImg("hotel,bedroom,classic", 190, 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.5,
  },
  {
    title: "Loft Suite with City View",
    type: "HOTEL" as const,
    purpose: "WORK" as const,
    city: "Philadelphia",
    country: "USA",
    pricePerNight: 179,
    description:
      "A tall-ceilinged loft-style suite with exposed brick, a spacious work lounge, and big windows looking out over downtown.",
    amenities: "Work desk,City view,Fast WiFi,Lounge area,Coffee maker",
    images: hotelImg("hotel,loft,room", 200, 4),
    maxGuests: 3,
    bedrooms: 1,
    rating: 4.6,
  },
  {
    title: "Spa Retreat Room",
    type: "HOTEL" as const,
    purpose: "VACATION" as const,
    city: "Sedona",
    country: "USA",
    pricePerNight: 265,
    description:
      "A calming retreat room with a deep soaking tub, candlelit ambiance, and red-rock desert views right outside the window.",
    amenities: "Soaking tub,Desert view,Spa access,WiFi,Free parking",
    images: hotelImg("hotel,spa,room", 210, 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.9,
  },
  {
    title: "Family Suite with Bunk",
    type: "HOTEL" as const,
    purpose: "VACATION" as const,
    city: "Orlando",
    country: "USA",
    pricePerNight: 210,
    description:
      "A playful two-room suite with a built-in bunk nook for the kids, a separate king bed for parents, and a TV in each room.",
    amenities: "Bunk beds,Two TVs,Mini fridge,WiFi,Pool access",
    images: hotelImg("hotel,family,room", 220, 4),
    maxGuests: 5,
    bedrooms: 2,
    rating: 4.7,
  },
  {
    title: "Presidential Suite",
    type: "HOTEL" as const,
    purpose: "BOTH" as const,
    city: "Beverly Hills",
    country: "USA",
    pricePerNight: 495,
    description:
      "The top-floor suite, with a private dining area, a stocked bar cart, framed art, and sweeping views over the hills.",
    amenities: "Private dining,Bar cart,City view,Butler service,Fast WiFi",
    images: hotelImg("hotel,luxury,suite", 230, 4),
    maxGuests: 4,
    bedrooms: 2,
    rating: 5,
  },
  {
    title: "Cozy Single Room",
    type: "HOTEL" as const,
    purpose: "WORK" as const,
    city: "Portland",
    country: "USA",
    pricePerNight: 109,
    description:
      "A compact, well-designed single room with a comfortable reading nook, a proper desk, and a big window over a quiet street.",
    amenities: "Work desk,WiFi,Coffee maker,Reading nook",
    images: hotelImg("hotel,room,cozy", 240, 4),
    maxGuests: 1,
    bedrooms: 1,
    rating: 4.4,
  },
  {
    title: "Riverside Double Room",
    type: "HOTEL" as const,
    purpose: "VACATION" as const,
    city: "San Antonio",
    country: "USA",
    pricePerNight: 159,
    description:
      "A double room just steps from the River Walk, with two queen beds and a small balcony overlooking the water.",
    amenities: "River view,Balcony,Two queen beds,WiFi,Free parking",
    images: hotelImg("hotel,river,room", 250, 4),
    maxGuests: 4,
    bedrooms: 1,
    rating: 4.5,
  },
  {
    title: "Penthouse Suite",
    type: "HOTEL" as const,
    purpose: "BOTH" as const,
    city: "Los Angeles",
    country: "USA",
    pricePerNight: 420,
    description:
      "A top-floor penthouse suite with a wraparound terrace, panoramic night views, and a lounge built for entertaining or unwinding.",
    amenities: "Terrace,Panoramic view,Lounge area,Minibar,Fast WiFi",
    images: hotelImg("hotel,penthouse,room", 260, 4),
    maxGuests: 4,
    bedrooms: 2,
    rating: 4.8,
  },
  {
    title: "Boutique Courtyard Room",
    type: "HOTEL" as const,
    purpose: "VACATION" as const,
    city: "New Orleans",
    country: "USA",
    pricePerNight: 175,
    description:
      "A character-filled room overlooking a quiet courtyard, with wrought-iron details, soft jazz drifting up from the street below.",
    amenities: "Courtyard view,WiFi,Coffee maker,Breakfast included",
    images: hotelImg("hotel,courtyard,room", 270, 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.6,
  },
  {
    title: "Airport Layover Room",
    type: "HOTEL" as const,
    purpose: "WORK" as const,
    city: "Atlanta",
    country: "USA",
    pricePerNight: 119,
    description:
      "A practical, soundproofed room minutes from the terminal, built for a good night's sleep between flights or an early meeting.",
    amenities: "Soundproofed,Shuttle service,Fast WiFi,24-hour front desk",
    images: hotelImg("hotel,airport,room", 280, 4),
    maxGuests: 2,
    bedrooms: 1,
    rating: 4.3,
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
