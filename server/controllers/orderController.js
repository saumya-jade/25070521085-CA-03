const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

const FREE_SHIPPING_ABOVE = 999;
const SHIPPING_FEE = 49;

const required = ["fullName", "phone", "line1", "city", "state", "pincode"];

exports.placeOrder = async (req, res) => {
  try {
    const a = req.body.shippingAddress || {};
    const paymentMethod = req.body.paymentMethod === "UPI_DEMO" ? "UPI_DEMO" : "COD";

    for (const f of required) {
      if (!a[f] || !String(a[f]).trim()) {
        return res.status(400).json({ success: false, message: `Please enter ${f === "line1" ? "address line 1" : f}.` });
      }
    }
    if (!/^[6-9]\d{9}$/.test(String(a.phone).trim())) {
      return res.status(400).json({ success: false, message: "Enter a valid 10-digit mobile number." });
    }
    if (!/^\d{6}$/.test(String(a.pincode).trim())) {
      return res.status(400).json({ success: false, message: "Enter a valid 6-digit pincode." });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }

    const orderItems = [];
    let itemsTotal = 0;
    for (const it of cart.items) {
      const product = await Product.findById(it.product);
      if (!product) {
        return res.status(400).json({ success: false, message: "A product in your cart is no longer available. Please remove it." });
      }
      if (product.stock < it.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name}: only ${product.stock} left in stock. Please update your cart.`,
        });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        quantity: it.quantity,
      });
      itemsTotal += product.price * it.quantity;
    }

    const reduced = [];
    for (const it of orderItems) {
      const r = await Product.updateOne(
        { _id: it.product, stock: { $gte: it.quantity } },
        { $inc: { stock: -it.quantity } }
      );
      if (r.modifiedCount !== 1) {
        for (const d of reduced) await Product.updateOne({ _id: d.product }, { $inc: { stock: d.quantity } });
        return res.status(400).json({ success: false, message: `${it.name} just went out of stock. Please review your cart.` });
      }
      reduced.push(it);
    }

    const shippingFee = itemsTotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName: String(a.fullName).trim(),
        phone: String(a.phone).trim(),
        line1: String(a.line1).trim(),
        line2: a.line2 ? String(a.line2).trim() : "",
        city: String(a.city).trim(),
        state: String(a.state).trim(),
        pincode: String(a.pincode).trim(),
      },
      paymentMethod,
      paymentStatus: paymentMethod === "UPI_DEMO" ? "Demo Paid" : "Pay on delivery",
      itemsTotal,
      shippingFee,
      total: itemsTotal + shippingFee,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, message: "Order placed.", order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not place order. Please try again." });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not load orders." });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    res.json({ success: true, order });
  } catch (err) {
    res.status(404).json({ success: false, message: "Order not found." });
  }
};