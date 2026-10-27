const express = require("express");
const { protect } = require("../middleware/auth");
const c = require("../controllers/cartController");

const router = express.Router();
router.use(protect);

router.get("/", c.getCart);
router.post("/items", c.addItem);
router.put("/items/:productId", c.updateItem);
router.delete("/items/:productId", c.removeItem);
router.delete("/", c.clearCart);

module.exports = router;