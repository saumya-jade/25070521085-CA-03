const Product = require("../models/Product");
const Category = require("../models/Category");

// GET /api/products
// Query params: search, category, minPrice, maxPrice, colour, occasion,
// availability (in-stock), mystery (true/false), featured, bestseller,
// sort (price-asc, price-desc, newest, rating), page, limit
const getProducts = async (req, res, next) => {
  try {
    const {
      search, category, minPrice, maxPrice, colour, occasion,
      availability, mystery, featured, bestseller,
      sort, page = 1, limit = 12,
    } = req.query;

    const filter = {};

    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: escaped, $options: "i" };
    }

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (!cat) {
        return res.json({ success: true, total: 0, page: 1, pages: 0, products: [] });
      }
      filter.categories = cat._id;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (colour) filter.colour = { $regex: `^${colour}$`, $options: "i" };
    if (occasion) filter.occasions = { $regex: `^${occasion}$`, $options: "i" };
    if (availability === "in-stock") filter.stock = { $gt: 0 };
    if (availability === "out-of-stock") filter.stock = 0;
    if (mystery === "true") filter.isMysteryJar = true;
    if (mystery === "false") filter.isMysteryJar = false;
    if (featured === "true") filter.isFeatured = true;
    if (bestseller === "true") filter.isBestseller = true;

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    else if (sort === "price-desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 100);

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("categories", "name slug type")
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id  (id ya slug dono chalega)
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const product = await Product.findOne(isObjectId ? { _id: id } : { slug: id }).populate(
      "categories",
      "name slug type"
    );

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/filters/options  (filter dropdowns ke liye)
const getFilterOptions = async (req, res, next) => {
  try {
    const colours = await Product.distinct("colour");
    const occasions = await Product.distinct("occasions");
    res.json({
      success: true,
      colours: colours.filter(Boolean).sort(),
      occasions: occasions.filter(Boolean).sort(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, getFilterOptions };