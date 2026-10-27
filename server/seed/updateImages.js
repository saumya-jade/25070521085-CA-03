const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("../models/Product");

// [naam ka hissa, size (ya null), image file]
// Size wali rules pehle rakhi hain, taaki wo general rule se pehle match hon.
const rules = [
  // Mystery jars (size-specific photos)
  ["Bestie Mystery Jar", "medium", "bestie-mystery-jar-medium.jpeg"],
  ["Blush Pink Jar", "large", "blush-pink-jar-large.jpeg"],
  ["Coquette Mystery Jar", "medium", "couquette-mystery-jar-medium.jpeg"],
  ["Jewellery Mystery Jar", "small", "jwellery-mystery-jar-small.jpeg"],
  ["Lavender Dream Jar", "small", "lavendar-dream-jar-small.jpeg"],
  ["Stationery Mystery Jar", "large", "stationery-mystery-jar-large.jpeg"],
  ["Stationery Mystery Jar", "small", "stationery-mystery-jar-small.jpeg"],

  // Mystery jars (general photo, jab size ki photo nahi hai)
  ["Jewellery Mystery Jar", null, "jar-jewellery.jpeg"],
  ["Cute Accessories Jar", null, "jar-accessories.jpeg"],
  ["Stationery Mystery Jar", null, "jar-stationery.jpeg"],
  ["Coquette Mystery Jar", null, "jar-accessories.jpeg"],
  ["Bestie Mystery Jar", null, "jar.jpg"],
  ["Lavender Dream Jar", null, "jar-colour.jpeg"],
  ["Blush Pink Jar", null, "jar-colour.jpeg"],

  // Normal gifts
  ["Rose Petal Scented Candle", null, "rose-petal-scented-candle.jpeg"],
  ["Personalized Name Mug", null, "mug.jpg"],
  ["Handmade Dried Flower Bouquet", null, "bouquet.jpg"],
  ["Pearl Charm Bracelet", null, "bracelet.jpg"],
  ["Lavender Gift Hamper", null, "hamper.jpg"],
  ["Mini Stationery Set", null, "stationery.jpg"],
  ["Graduation Success Gift Box", null, "graduation.jpg"],
  ["Handmade Scrapbook Album", null, "handmade.jpg"],
  ["Personalized Photo Frame", null, "frames.jpg"],
  ["Vanilla Soy Candle Trio", null, "candle.jpg"],
  ["Bestie Friendship Bracelet Set", null, "friendship-bracelet.jpeg"],
  ["Blush Rose Gift Box", null, "rose-gift-box.jpeg"],
  ["Handmade Macrame Keychain", null, "handmade-keychains.jpeg"],
  ["Personalized Name Necklace", null, "personalized-necklace.jpeg"],
  ["Cozy Self-Care Kit", null, "gift-box.jpg"],
  ["Mini Succulent in Pot", null, "succulent.jpg"],
  ["Handwritten Love Letter Box", null, "love-letter-box.jpeg"],
  ["Personalized Diary", null, "stationery.jpg"],
  ["Lavender Bath Bomb Set", null, "lavender-bath-bombs-set.jpeg"],
  ["Gold Heart Pendant", null, "gold-heart-pendent.jpeg"],
  ["Cute Sticker Pack", null, "cute-sticker-pack.jpeg"],
  ["Teddy and Chocolate Combo", null, "teddy-chocolate-combo.jpeg"],
  ["Handmade Clay Earrings", null, "earrings.jpg"],
  ["Memory Polaroid Gift Set", null, "polaroid-set.jpeg"],
];

const FALLBACK = "hero.jpg";

const matches = (p, [key, size]) => {
  if (!p.name.includes(key)) return false;
  if (!size) return true;
  const text = `${p.name} ${p.jarSize || ""}`.toLowerCase();
  return text.includes(size);
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({});
    const unmatched = [];

    for (const p of products) {
      const rule = rules.find((r) => matches(p, r));
      if (!rule) unmatched.push(p.name);
      const file = rule ? rule[2] : FALLBACK;
      await Product.updateOne({ _id: p._id }, { $set: { images: [`/images/${file}`] } });
    }

    console.log(`✅ Updated images for ${products.length} products`);
    if (unmatched.length) {
      console.log("⚠️ Fallback image used for:", unmatched.join(", "));
    }
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed:", err.message);
    process.exit(1);
  }
};

run();