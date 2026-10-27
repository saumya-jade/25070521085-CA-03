const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    occasions: [{ type: String }],
    colour: { type: String, default: "" },
    tags: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isPersonalizable: { type: Boolean, default: false },

    // Mystery Jar ke liye extra fields
    isMysteryJar: { type: Boolean, default: false },
    jarType: { type: String, default: "" },
    jarSize: { type: String, enum: ["", "Small", "Medium", "Large"], default: "" },
    approxItems: { type: String, default: "" },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);