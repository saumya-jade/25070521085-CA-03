const express = require("express");
const { protect } = require("../middleware/auth");
const o = require("../controllers/orderController");

const router = express.Router();
router.use(protect);

router.post("/", o.placeOrder);
router.get("/", o.getMyOrders);
router.get("/:id", o.getOrder);

module.exports = router;