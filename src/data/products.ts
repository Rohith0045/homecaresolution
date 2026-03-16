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
    name: "EcoClean Kitchen Degreaser",
    description: "Powerful plant-based degreaser that cuts through grease without harsh chemicals.",
    longDescription: "Our EcoClean Kitchen Degreaser is formulated with plant-derived surfactants and essential oils to effortlessly cut through grease, grime, and food residue. Safe for all kitchen surfaces including granite, marble, stainless steel, and ceramic. The citrus-fresh scent leaves your kitchen smelling naturally clean.",
    price: 5,
    originalPrice: 649,
    rating: 4.8,
    reviewCount: 234,
    category: "kitchen",
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=600&fit=crop",
    ],
    badge: "Best Seller",
    ingredients: ["Plant-derived surfactants", "Citrus essential oil", "Purified water", "Coconut oil extract", "Aloe vera"],
    benefits: ["Cuts through tough grease", "Safe for all surfaces", "Biodegradable formula", "Pleasant citrus scent", "No harsh chemicals"],
    usage: "Spray directly on surface, let sit for 30 seconds, wipe with a clean cloth. For tough stains, let sit for 2-3 minutes.",
    isBestSeller: true,
  },
  {
    id: "2",
    name: "PureShine Bathroom Cleaner",
    description: "Eliminates soap scum and hard water stains with a refreshing eucalyptus scent.",
    longDescription: "PureShine Bathroom Cleaner tackles soap scum, hard water stains, and mildew with the power of natural eucalyptus and tea tree oils. Our formula is free from chlorine bleach and phosphates, making it safe for your family and the environment.",
    price: 399,
    originalPrice: 529,
    rating: 4.6,
    reviewCount: 189,
    category: "bathroom",
    image: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=600&h=600&fit=crop",
    ],
    badge: "Eco Certified",
    ingredients: ["Eucalyptus oil", "Tea tree oil", "Citric acid", "Plant surfactants", "Purified water"],
    benefits: ["Removes soap scum", "Kills 99.9% bacteria naturally", "No chlorine bleach", "Fresh eucalyptus scent", "Safe for septic systems"],
    usage: "Spray on bathroom surfaces, wait 1-2 minutes, scrub if needed, rinse with water.",
    isBestSeller: true,
  },
  {
    id: "3",
    name: "NatureFresh Floor Solution",
    description: "All-purpose floor cleaner for hardwood, tile, and laminate surfaces.",
    longDescription: "NatureFresh Floor Solution gently cleans and protects all types of flooring. Its pH-balanced, plant-based formula won't strip finishes or leave residue. Leaves floors sparkling clean with a subtle lavender scent.",
    price: 549,
    rating: 4.7,
    reviewCount: 156,
    category: "floor",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=600&fit=crop",
    ],
    ingredients: ["Lavender essential oil", "Plant-based surfactants", "Mineral-derived cleaning agents", "Purified water"],
    benefits: ["Safe for all floor types", "No-rinse formula", "Streak-free finish", "pH balanced", "Biodegradable"],
    usage: "Dilute 2 caps in a bucket of warm water. Mop as usual. No rinsing needed.",
    isTrending: true,
  },
  {
    id: "4",
    name: "GreenWash Laundry Detergent",
    description: "Concentrated plant-based detergent that's tough on stains, gentle on fabrics.",
    longDescription: "GreenWash delivers powerful cleaning in a concentrated, eco-friendly formula. Each bottle provides 64 loads of fresh, clean laundry. Free from synthetic fragrances, dyes, and optical brighteners.",
    price: 699,
    originalPrice: 899,
    rating: 4.9,
    reviewCount: 312,
    category: "laundry",
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&h=600&fit=crop",
    ],
    badge: "Top Rated",
    ingredients: ["Plant-based enzymes", "Coconut-derived surfactants", "Essential oils blend", "Sodium bicarbonate", "Purified water"],
    benefits: ["64 loads per bottle", "Works in cold water", "Hypoallergenic", "Color safe", "HE compatible"],
    usage: "Use 1 cap for regular loads, 2 caps for heavily soiled items. Works in all water temperatures.",
    isBestSeller: true,
    isTrending: true,
  },
  {
    id: "5",
    name: "PureHands Foaming Wash",
    description: "Gentle, moisturizing hand wash with aloe vera and chamomile.",
    longDescription: "PureHands Foaming Wash combines effective antibacterial protection with skin-nourishing botanicals. The luxurious foam lathers richly while aloe vera and chamomile keep hands soft and hydrated.",
    price: 299,
    rating: 4.5,
    reviewCount: 198,
    category: "handwash",
    image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=600&h=600&fit=crop",
    ],
    ingredients: ["Aloe vera extract", "Chamomile extract", "Coconut-derived cleansers", "Vitamin E", "Purified water"],
    benefits: ["Moisturizing formula", "Gentle on sensitive skin", "Rich foam", "Antibacterial", "Dermatologist tested"],
    usage: "Pump foam onto wet hands, lather for 20 seconds, rinse thoroughly.",
    isTrending: true,
  },
  {
    id: "6",
    name: "EcoScrub Bamboo Brush Set",
    description: "Set of 3 durable bamboo brushes for kitchen, bathroom, and general cleaning.",
    longDescription: "Our EcoScrub Bamboo Brush Set includes three sustainably sourced bamboo brushes designed for different cleaning tasks. The natural bristles are firm yet gentle, and the ergonomic handles provide comfortable grip.",
    price: 799,
    originalPrice: 1099,
    rating: 4.4,
    reviewCount: 87,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&h=600&fit=crop",
    ],
    badge: "Eco Pack",
    ingredients: ["Sustainably sourced bamboo", "Natural plant fiber bristles", "FSC certified wood"],
    benefits: ["Biodegradable materials", "Ergonomic design", "Long lasting", "Multipurpose", "Plastic free"],
    usage: "Use with your favorite cleaning solution. Rinse after use and allow to air dry.",
  },
  {
    id: "7",
    name: "CitrusBurst Dish Soap",
    description: "Concentrated dish soap with real lemon extract for sparkling dishes.",
    longDescription: "CitrusBurst Dish Soap uses real lemon and orange extracts to cut through grease while being gentle on your hands. A small amount goes a long way with our 4x concentrated formula.",
    price: 329,
    rating: 4.7,
    reviewCount: 267,
    category: "kitchen",
    image: "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=600&h=600&fit=crop",
    ],
    ingredients: ["Lemon extract", "Orange peel oil", "Coconut surfactants", "Aloe vera", "Purified water"],
    benefits: ["4x concentrated", "Cuts grease instantly", "Gentle on hands", "Real citrus extracts", "Biodegradable"],
    usage: "Apply a few drops to a wet sponge. Lather and wash dishes as usual.",
    isBestSeller: true,
  },
  {
    id: "8",
    name: "FreshAir Fabric Softener",
    description: "Plant-based fabric softener with a delicate floral scent.",
    longDescription: "FreshAir Fabric Softener uses plant-derived softening agents to leave clothes feeling incredibly soft and static-free. The gentle floral scent is derived from real flower extracts.",
    price: 449,
    rating: 4.6,
    reviewCount: 143,
    category: "laundry",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&h=600&fit=crop",
    ],
    ingredients: ["Plant-derived softening agents", "Flower extracts", "Essential oils", "Purified water"],
    benefits: ["Ultra soft results", "Reduces static", "Natural fragrance", "Safe for sensitive skin", "Biodegradable"],
    usage: "Add during the rinse cycle. Use 1 cap for regular loads.",
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
