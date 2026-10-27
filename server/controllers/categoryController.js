const Category = require("../models/Category");

// GET /api/categories?type=occasion
const getCategories = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories };