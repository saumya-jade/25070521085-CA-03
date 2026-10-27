const StockAlert = require("../models/StockAlert");
const Product = require("../models/Product");

const load = async (userId) => {
  const alerts = await StockAlert.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("product", "name slug price stock images");
  return alerts
    .filter((a) => a.product)
    .map((a) => ({
      _id: a._id,
      product: a.product,
      backInStock: a.product.stock > 0,
      createdAt: a.createdAt,
    }));
};

exports.getAlerts = async (req, res) => {
  try {
    res.json({ success: true, alerts: await load(req.user._id) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not load alerts." });
  }
};

exports.addAlert = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    if (product.stock > 0) {
      return res.status(400).json({ success: false, message: "This product is already in stock." });
    }
    await StockAlert.findOneAndUpdate(
      { user: req.user._id, product: product._id },
      { $setOnInsert: { user: req.user._id, product: product._id } },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: "We will remind you here when it is back.", alerts: await load(req.user._id) });
  } catch (err) {
    res.status(400).json({ success: false, message: "Could not save the alert." });
  }
};

exports.removeAlert = async (req, res) => {
  try {
    await StockAlert.deleteOne({ user: req.user._id, product: req.params.productId });
    res.json({ success: true, alerts: await load(req.user._id) });
  } catch (err) {
    res.status(400).json({ success: false, message: "Could not remove the alert." });
  }
};