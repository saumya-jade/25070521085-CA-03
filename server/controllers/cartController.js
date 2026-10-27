const Cart = require("../models/Cart");
const Product = require("../models/Product");

const MAX_QTY = 10;

// Cart ko response format mein badlo. Price HAMESHA database ke product se aata hai.
const buildResponse = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name slug price stock images isMysteryJar",
  });
  const items = [];
  let subtotal = 0;
  let itemCount = 0;

  if (cart) {
    for (const it of cart.items) {
      if (!it.product) continue; // product delete ho gaya
      const qty = Math.min(it.quantity, Math.max(it.product.stock, 1));
      const lineTotal = it.product.price * qty;
      items.push({
        product: it.product,
        quantity: qty,
        lineTotal,
        outOfStock: it.product.stock < 1,
      });
      if (it.product.stock >= 1) {
        subtotal += lineTotal;
        itemCount += qty;
      }
    }
  }
  return { items, subtotal, itemCount };
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

exports.getCart = async (req, res) => {
  try {
    const cart = await buildResponse(req.user._id);
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not load cart." });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const quantity = Math.max(1, Math.min(MAX_QTY, parseInt(req.body.quantity, 10) || 1));

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    if (product.stock < 1) return res.status(400).json({ success: false, message: "This product is out of stock." });

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find((i) => i.product.toString() === productId);
    const newQty = (existing ? existing.quantity : 0) + quantity;
    const allowed = Math.min(product.stock, MAX_QTY);

    if (newQty > allowed) {
      return res.status(400).json({ success: false, message: `Only ${allowed} available for this product.` });
    }

    if (existing) existing.quantity = newQty;
    else cart.items.push({ product: productId, quantity });
    await cart.save();

    res.json({ success: true, message: "Added to cart.", cart: await buildResponse(req.user._id) });
  } catch (err) {
    res.status(400).json({ success: false, message: "Could not add to cart." });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = parseInt(req.body.quantity, 10);
    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1." });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    const allowed = Math.min(product.stock, MAX_QTY);
    if (quantity > allowed) {
      return res.status(400).json({ success: false, message: `Only ${allowed} available for this product.` });
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: "Item not in cart." });

    item.quantity = quantity;
    await cart.save();
    res.json({ success: true, cart: await buildResponse(req.user._id) });
  } catch (err) {
    res.status(400).json({ success: false, message: "Could not update cart." });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    res.json({ success: true, cart: await buildResponse(req.user._id) });
  } catch (err) {
    res.status(400).json({ success: false, message: "Could not remove item." });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json({ success: true, cart: await buildResponse(req.user._id) });
  } catch (err) {
    res.status(400).json({ success: false, message: "Could not clear cart." });
  }
};