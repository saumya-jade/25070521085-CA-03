const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Category = require("../models/Category");
const Product = require("../models/Product");

const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const categoryData = [
  { name: "Birthday", slug: "birthday", type: "occasion", description: "Make their day unforgettable" },
  { name: "Anniversary", slug: "anniversary", type: "occasion", description: "Celebrate your love story" },
  { name: "Graduation", slug: "graduation", type: "occasion", description: "Cheers to new beginnings" },
  { name: "Best Friend", slug: "best-friend", type: "occasion", description: "For your favourite person" },
  { name: "Personalized Gifts", slug: "personalized-gifts", type: "gift-type", description: "Made just for them" },
  { name: "Handmade Gifts", slug: "handmade-gifts", type: "gift-type", description: "Crafted with love" },
  { name: "Under 299", slug: "under-299", type: "budget", description: "Sweet gifts under ₹299" },
  { name: "Under 499", slug: "under-499", type: "budget", description: "Lovely gifts under ₹499" },
  { name: "Under 999", slug: "under-999", type: "budget", description: "Premium gifts under ₹999" },
  { name: "Jewellery Jar", slug: "jar-jewellery", type: "mystery-jar", description: "Mystery jar full of jewellery" },
  { name: "Cute Accessories Jar", slug: "jar-accessories", type: "mystery-jar", description: "Clips, scrunchies and more" },
  { name: "Stationery Jar", slug: "jar-stationery", type: "mystery-jar", description: "Pens, stickers, notebooks" },
  { name: "Coquette Jar", slug: "jar-coquette", type: "mystery-jar", description: "Bows, ribbons and pearls" },
  { name: "Bestie Jar", slug: "jar-bestie", type: "mystery-jar", description: "Perfect for best friends" },
  { name: "Colour-themed Jar", slug: "jar-colour", type: "mystery-jar", description: "Pick a colour, we pick the surprise" },
];

const IMG = {
  gift1: img("photo-1513885535751-8b9238bd345a"),
  gift2: img("photo-1549465220-1a8b9238cd48"),
  gift3: img("photo-1607344645866-009c320b63e0"),
  candle: img("photo-1603006905003-be475563bc59"),
  flowers: img("photo-1490750967868-88aa4486c946"),
  jewel: img("photo-1515562141207-7a88fb7ce338"),
  stationery: img("photo-1456735190827-d1262f71b8a3"),
  mug: img("photo-1514228742587-6b1558fcca3d"),
  jar: img("photo-1578662996442-48f60103fc96"),
};

// Normal products: [name, price, stock, colour, occasions, catSlugs, image, flags]
const normalProducts = [
  ["Rose Petal Scented Candle", 349, 40, "Pink", ["Birthday", "Anniversary"], ["birthday", "anniversary", "under-499"], IMG.candle, { isFeatured: true, rating: 4.7 }],
  ["Personalized Name Mug", 449, 35, "White", ["Birthday", "Best Friend"], ["personalized-gifts", "birthday", "best-friend", "under-499"], IMG.mug, { isPersonalizable: true, isBestseller: true, rating: 4.8 }],
  ["Handmade Dried Flower Bouquet", 799, 15, "Pink", ["Anniversary", "Birthday"], ["handmade-gifts", "anniversary", "under-999"], IMG.flowers, { isFeatured: true, rating: 4.9 }],
  ["Pearl Charm Bracelet", 599, 25, "Cream", ["Birthday", "Best Friend"], ["best-friend", "birthday", "under-999"], IMG.jewel, { isBestseller: true, rating: 4.6 }],
  ["Lavender Gift Hamper", 999, 12, "Lavender", ["Birthday", "Anniversary"], ["birthday", "anniversary", "under-999"], IMG.gift1, { isFeatured: true, rating: 4.8 }],
  ["Mini Stationery Set", 249, 60, "Pink", ["Graduation", "Best Friend"], ["graduation", "best-friend", "under-299"], IMG.stationery, { rating: 4.4 }],
  ["Graduation Success Gift Box", 899, 18, "Brown", ["Graduation"], ["graduation", "under-999"], IMG.gift2, { isFeatured: true, rating: 4.7 }],
  ["Handmade Scrapbook Album", 549, 20, "Cream", ["Anniversary", "Best Friend"], ["handmade-gifts", "anniversary", "best-friend", "under-999"], IMG.stationery, { isBestseller: true, rating: 4.9 }],
  ["Personalized Photo Frame", 399, 30, "Brown", ["Anniversary", "Birthday"], ["personalized-gifts", "anniversary", "under-499"], IMG.gift3, { isPersonalizable: true, rating: 4.5 }],
  ["Vanilla Soy Candle Trio", 279, 50, "Cream", ["Birthday", "Best Friend"], ["birthday", "best-friend", "under-299"], IMG.candle, { rating: 4.3 }],
  ["Bestie Friendship Bracelet Set", 199, 70, "Lavender", ["Best Friend"], ["best-friend", "under-299"], IMG.jewel, { isBestseller: true, rating: 4.6 }],
  ["Blush Rose Gift Box", 699, 22, "Pink", ["Anniversary", "Birthday"], ["anniversary", "birthday", "under-999"], IMG.gift1, { isFeatured: true, rating: 4.8 }],
  ["Handmade Macrame Keychain", 149, 80, "Brown", ["Best Friend", "Birthday"], ["handmade-gifts", "best-friend", "under-299"], IMG.gift3, { rating: 4.2 }],
  ["Personalized Name Necklace", 649, 28, "Gold", ["Birthday", "Anniversary"], ["personalized-gifts", "birthday", "under-999"], IMG.jewel, { isPersonalizable: true, isBestseller: true, rating: 4.7 }],
  ["Cozy Self-Care Kit", 749, 16, "Lavender", ["Birthday", "Best Friend"], ["birthday", "best-friend", "under-999"], IMG.gift2, { rating: 4.6 }],
  ["Mini Succulent in Pot", 299, 45, "Green", ["Graduation", "Birthday"], ["graduation", "birthday", "under-499"], IMG.flowers, { rating: 4.4 }],
  ["Handwritten Love Letter Box", 499, 20, "Pink", ["Anniversary"], ["handmade-gifts", "anniversary", "under-499"], IMG.gift3, { isFeatured: true, rating: 4.9 }],
  ["Personalized Diary", 379, 33, "Brown", ["Graduation", "Birthday"], ["personalized-gifts", "graduation", "under-499"], IMG.stationery, { isPersonalizable: true, rating: 4.5 }],
  ["Lavender Bath Bomb Set", 329, 38, "Lavender", ["Birthday", "Best Friend"], ["birthday", "best-friend", "under-499"], IMG.candle, { rating: 4.3 }],
  ["Gold Heart Pendant", 899, 10, "Gold", ["Anniversary"], ["anniversary", "under-999"], IMG.jewel, { isBestseller: true, rating: 4.8 }],
  ["Cute Sticker Pack (50 pcs)", 99, 100, "Pink", ["Best Friend", "Graduation"], ["best-friend", "graduation", "under-299"], IMG.stationery, { rating: 4.1 }],
  ["Teddy and Chocolate Combo", 599, 0, "Brown", ["Birthday", "Anniversary"], ["birthday", "anniversary", "under-999"], IMG.gift1, { rating: 4.7 }],
  ["Handmade Clay Earrings", 229, 55, "Cream", ["Best Friend", "Birthday"], ["handmade-gifts", "best-friend", "under-299"], IMG.jewel, { rating: 4.4 }],
  ["Memory Polaroid Gift Set", 459, 26, "Cream", ["Anniversary", "Best Friend"], ["personalized-gifts", "anniversary", "best-friend", "under-499"], IMG.gift3, { isPersonalizable: true, isFeatured: true, rating: 4.6 }],
];

// Mystery Jars: [name, price, colour, jarCat, jarType, size, approxItems, desc, flags]
const jarData = [
  ["Jewellery Mystery Jar (Small)", 299, "Pink", "jar-jewellery", "Jewellery", "Small", "4-5 items", "A surprise mix of rings, earrings and charms in a pretty jar.", { isBestseller: true, rating: 4.7 }],
  ["Jewellery Mystery Jar (Large)", 799, "Gold", "jar-jewellery", "Jewellery", "Large", "10-12 items", "Our biggest jewellery surprise. Necklaces, bracelets, rings and more.", { isFeatured: true, rating: 4.9 }],
  ["Cute Accessories Jar (Medium)", 499, "Lavender", "jar-accessories", "Cute Accessories", "Medium", "7-8 items", "Hair clips, scrunchies and tiny treasures, all hidden inside.", { isFeatured: true, rating: 4.6 }],
  ["Stationery Mystery Jar (Small)", 199, "Cream", "jar-stationery", "Stationery", "Small", "5-6 items", "Pens, stickers and mini notebooks. A student favourite.", { rating: 4.5 }],
  ["Stationery Mystery Jar (Large)", 649, "Pink", "jar-stationery", "Stationery", "Large", "12-14 items", "Premium stationery surprise with washi tapes, planners and more.", { isBestseller: true, rating: 4.8 }],
  ["Coquette Mystery Jar (Medium)", 549, "Pink", "jar-coquette", "Coquette", "Medium", "7-8 items", "Bows, ribbons, pearls and everything soft and dreamy.", { isFeatured: true, isBestseller: true, rating: 4.9 }],
  ["Bestie Mystery Jar (Medium)", 449, "Lavender", "jar-bestie", "Bestie", "Medium", "6-8 items", "Matching goodies to share with your best friend.", { rating: 4.7 }],
  ["Lavender Dream Jar (Small)", 249, "Lavender", "jar-colour", "Colour-themed", "Small", "4-5 items", "Everything inside is lavender-themed. Colour is known, items are a surprise.", { rating: 4.4 }],
  ["Blush Pink Jar (Large)", 849, "Pink", "jar-colour", "Colour-themed", "Large", "10-12 items", "A big blush-pink surprise jar for the ultimate pink lover.", { isFeatured: true, rating: 4.8 }],
];

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Product.deleteMany({});
    await Category.deleteMany({});

    const cats = await Category.insertMany(categoryData);
    const catMap = {};
    cats.forEach((c) => (catMap[c.slug] = c._id));

    const products = normalProducts.map(
      ([name, price, stock, colour, occasions, catSlugs, image, flags]) => ({
        name,
        slug: slugify(name),
        description: `${name}: a thoughtfully made gift from BlushBox, perfect for ${occasions.join(" and ").toLowerCase()}. Beautifully packed and ready to gift.`,
        price,
        stock,
        colour,
        occasions,
        images: [image],
        categories: catSlugs.map((s) => catMap[s]),
        tags: [colour.toLowerCase(), ...occasions.map((o) => o.toLowerCase())],
        ...flags,
      })
    );

    const jars = jarData.map(
      ([name, price, colour, jarCat, jarType, jarSize, approxItems, description, flags]) => ({
        name,
        slug: slugify(name),
        description,
        price,
        stock: 25,
        colour,
        occasions: ["Birthday", "Best Friend"],
        images: [IMG.jar],
        categories: [catMap[jarCat]],
        tags: ["mystery jar", jarType.toLowerCase(), colour.toLowerCase()],
        isMysteryJar: true,
        jarType,
        jarSize,
        approxItems,
        ...flags,
      })
    );

    await Product.insertMany([...products, ...jars]);

    console.log(`✅ Seeded ${cats.length} categories`);
    console.log(`✅ Seeded ${products.length} products`);
    console.log(`✅ Seeded ${jars.length} mystery jars`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();