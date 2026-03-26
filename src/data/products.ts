export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  image: string;
  images: string[];
  badge?: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  isBestSeller?: boolean;
  isTrending?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: "kitchen", name: "Kitchen Cleaning", description: "Degreasers, dish soaps & surface cleaners", icon: "🍳", productCount: 12 },
  { id: "bathroom", name: "Bathroom Cleaning", description: "Tile cleaners, toilet bowls & descalers", icon: "🚿", productCount: 9 },
  { id: "floor", name: "Floor Cleaning", description: "Mops, solutions & wood floor care", icon: "🏠", productCount: 8 },
  { id: "laundry", name: "Laundry Care", description: "Detergents, fabric softeners & stain removers", icon: "👕", productCount: 11 },
  { id: "handwash", name: "Hand Wash & Sanitizers", description: "Gentle soaps & alcohol-free sanitizers", icon: "🧴", productCount: 7 },
  { id: "accessories", name: "Accessories", description: "Brushes, sponges & microfiber cloths", icon: "🧹", productCount: 15 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "P&P Lemon Dish Wash Gel",
    description: "Antibacterial formula dish wash gel for sparkling clean dishes.",
    longDescription: "Pure & Perfect Lemon Dish Wash Gel features an antibacterial formula with a fresh lemon scent. It cuts through tough grease instantly, providing premium quality cleaning for all your pots, pans, and daily dishes while remaining gentle on your hands.",
    price: 149,
    originalPrice: 199,
    rating: 4.8,
    reviewCount: 234,
    category: "kitchen",
    image: "/images/products/IMG-20260321-WA0055.jpg.jpeg",
    images: [
      "/images/products/IMG-20260321-WA0055.jpg.jpeg"
    ],
    badge: "Best Seller",
    ingredients: ["Lemon extract", "Active surfactants", "Antibacterial agents"],
    benefits: ["Cuts tough grease", "Antibacterial formula", "Fresh lemon scent"],
    usage: "Use a few drops on a wet sponge to wash dishes as usual.",
    isBestSeller: true,
  },
  {
    id: "2",
    name: "P&P Herbal Phenyl",
    description: "Concentrated floor disinfectant that cleans and freshens.",
    longDescription: "P&P Herbal Phenyl provides 2X better results for floor cleaning. It is a concentrated disinfectant that cleans, disinfects, and removes stains while leaving a fresh, long-lasting aroma in your home.",
    price: 199,
    originalPrice: 249,
    rating: 4.6,
    reviewCount: 189,
    category: "floor",
    image: "/images/products/IMG-20260321-WA0005.jpg.jpeg",
    images: [
      "/images/products/IMG-20260321-WA0005.jpg.jpeg",
      "/images/products/IMG-20260321-WA0010.jpg.jpeg",
      "/images/products/IMG-20260321-WA0016.jpg.jpeg",
      "/images/products/IMG-20260321-WA0017.jpg.jpeg",
      "/images/products/IMG-20260321-WA0056.jpg.jpeg",
    ],
    badge: "Eco Certified",
    ingredients: ["Herbal extracts", "Disinfectants", "Fragrance"],
    benefits: ["2X better results", "Kills germs", "Removes stains", "Fresh fragrance"],
    usage: "Dilute in water and mop the floor. Suitable for daily use.",
    isBestSeller: true,
  },
  {
    id: "3",
    name: "P&P Heavy Duty Bathroom Tiles Cleaner",
    description: "Powerful, rapid-acting formula for removing tough bathroom stains.",
    longDescription: "Our Heavy Duty Bathroom Tiles Cleaner is designed for premium quality cleaning. Its powerful, rapid-acting formula easily removes residues, efflorescence, and oxide stains from all bathroom tiles, leaving them sparkling.",
    price: 299,
    rating: 4.7,
    reviewCount: 156,
    category: "bathroom",
    image: "/images/products/IMG-20260321-WA0038.jpg.jpeg",
    images: [
      "/images/products/IMG-20260321-WA0038.jpg.jpeg",
    ],
    ingredients: ["Active cleaning agents", "Stain removers"],
    benefits: ["Rapid acting", "Removes efflorescence", "Clears oxide stains"],
    usage: "Apply directly to tiles, leave for a few minutes, scrub and rinse.",
    isTrending: true,
  },
  {
    id: "4",
    name: "P&P 3-in-1 Toilet Cleaner",
    description: "Heavy duty toilet cleaner that kills 99.9% of virus and bacteria.",
    longDescription: "P&P 3-in-1 Toilet Cleaner provides clean and fresh results. Its heavy-duty action formula kills germs, ensures freshness, and acts as a powerful stain remover for a spotless toilet bowl.",
    price: 189,
    originalPrice: 220,
    rating: 4.9,
    reviewCount: 312,
    category: "bathroom",
    image: "/images/products/IMG-20260321-WA0050.jpg.jpeg",
    images: [
      "/images/products/IMG-20260321-WA0050.jpg.jpeg",
      "/images/products/IMG-20260321-WA0046.jpg.jpeg",
    ],
    badge: "Top Rated",
    ingredients: ["Active acids", "Disinfectants", "Fragrance"],
    benefits: ["Kills 99.9% germs", "Removes stains", "Deodorizes"],
    usage: "Apply under the rim, leave for 20 minutes, brush lightly and flush.",
    isBestSeller: true,
    isTrending: true,
  },
  {
    id: "5",
    name: "P&P Lemon Hand Wash (5Kg)",
    description: "Soft on hands, fights germs, pH balanced bulk hand wash.",
    longDescription: "Our Bulk 5Kg Lemon Hand Wash is perfect for commercial or extensive home use. It kills 99.9% of germs while remaining soft on your hands with a pH balanced formulation and an invigorating lemon scent.",
    price: 499,
    rating: 4.5,
    reviewCount: 198,
    category: "handwash",
    image: "/images/products/IMG-20260321-WA0024.jpg.jpeg",
    images: [
      "/images/products/IMG-20260321-WA0024.jpg.jpeg"
    ],
    ingredients: ["Lemon extract", "Skin conditioners", "Antibacterial agents"],
    benefits: ["pH balanced", "Soft on hands", "Fights germs", "Bulk size value"],
    usage: "Pump onto wet hands, lather, and rinse thoroughly.",
    isTrending: true,
  },
  {
    id: "6",
    name: "P&P Copbraz Copper & Brass Cleaner",
    description: "Instant cleaner for tarnish, oxidation, and fire scale.",
    longDescription: "P&P Copbraz is an instant copper and brass cleaner that effortlessly brings back the original shine. It effectively removes tarnish, oxidation, and fire scale from your pooja items and household brassware.",
    price: 249,
    originalPrice: 299,
    rating: 4.8,
    reviewCount: 412,
    category: "accessories",
    image: "/images/products/IMG-20260321-WA0031.jpg.jpeg",
    images: [
      "/images/products/IMG-20260321-WA0031.jpg.jpeg",
      "/images/products/IMG-20260321-WA0039.jpg.jpeg",
      "/images/products/IMG-20260321-WA0043.jpg.jpeg",
      "/images/products/IMG-20260321-WA0054.jpg.jpeg",
    ],
    badge: "Best Seller",
    ingredients: ["Tarnish removers", "Polishing agents"],
    benefits: ["Instant shine", "Removes oxidation", "Perfect for pooja items"],
    usage: "Apply to brass/copper items, wipe gently with a soft cloth.",
  },
  {
    id: "7",
    name: "P&P Oil Stain Cleaner",
    description: "Heavy duty oil stain remover for kitchen floors and service stations.",
    longDescription: "P&P Oil Stain Cleaner is built for the toughest grease. Ideal for kitchen floors, temples, hotels, and even car/bike service stations. It effortlessly lifts heavy oil stains from porous and non-porous surfaces.",
    price: 349,
    rating: 4.7,
    reviewCount: 267,
    category: "kitchen",
    image: "/images/products/IMG-20260321-WA0021.jpg.jpeg",
    images: [
      "/images/products/IMG-20260321-WA0021.jpg.jpeg",
    ],
    ingredients: ["Heavy duty degreasers", "Solvents", "Surfactants"],
    benefits: ["Lifts heavy oil", "Multi-surface use", "Industrial strength"],
    usage: "Apply to stained area, let sit, agitate with a brush, and wipe clean.",
    isBestSeller: true,
  },
  {
    id: "8",
    name: "P&P Advance 5-in-1 Glass Cleaner",
    description: "Multi-purpose cleaner for glass, laptops, tables, and TVs.",
    longDescription: "P&P Advance 5-in-1 Glass Cleaner gives a streak-free shine. It is perfectly formulated for glass cleaning, table cleaning, laptop screens, TV washing, and wardrobe cleaning in an economical 5Kg pack.",
    price: 499,
    rating: 4.6,
    reviewCount: 143,
    category: "accessories",
    image: "/images/products/IMG-20260321-WA0037.jpg.jpeg",
    images: [
      "/images/products/IMG-20260321-WA0037.jpg.jpeg",
    ],
    ingredients: ["Solvents", "Anti-streak agents", "Fragrance"],
    benefits: ["5-in-1 versatility", "Streak-free shine", "Safe on electronics screens"],
    usage: "Spray onto surface and wipe with a clean microfiber cloth.",
    isTrending: true,
  },
];

export const testimonials = [
  {
    id: "1",
    name: "Sarah M.",
    role: "Mom of 3",
    content: "Finally found cleaning products I feel safe using around my kids and pets. The kitchen degreaser is incredible!",
    rating: 5,
    avatar: "SM",
  },
  {
    id: "2",
    name: "James R.",
    role: "Eco Enthusiast",
    content: "I've switched my entire household to Home Care Solutions. The quality rivals big brands without the toxic chemicals.",
    rating: 5,
    avatar: "JR",
  },
  {
    id: "3",
    name: "Priya K.",
    role: "Allergy Sufferer",
    content: "As someone with chemical sensitivities, these products have been life-changing. No more headaches from cleaning!",
    rating: 5,
    avatar: "PK",
  },
];
