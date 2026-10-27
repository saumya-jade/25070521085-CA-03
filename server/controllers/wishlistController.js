const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

const load = async (userId) => {
  const w = await Wishlist.findOne({ user: userId }).populate(
    "products",
    "name slug price stock images rating"
  );
  return w ? w.products.filter(Boolean) : [];
};

exports.getWishlist = async (req, res) => {
  try {
    res.json({ success: true, products: await load(req.user._id) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not load wishlist." });
  }
};

exports.addItem = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { products: product._id } },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: "Added to wishlist.", products: await load(req.user._id) });
  } catch (err) {
    res.status(400).json({ success: false, message: "Could not update wishlist." });
  }
};

exports.removeItem = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user._id }, { $pull: { products: req.params.productId } });
    res.json({ success: true, products: await load(req.user._id) });
  } catch (err) {
    res.status(400).json({ success: false, message: "Could not update wishlist." });
  }
};