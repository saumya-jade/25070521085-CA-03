const express = require("express");
const { protect } = require("../middleware/auth");
const w = require("../controllers/wishlistController");

const router = express.Router();
router.use(protect);

router.get("/", w.getWishlist);
router.post("/:productId", w.addItem);
router.delete("/:productId", w.removeItem);

module.exports = router;