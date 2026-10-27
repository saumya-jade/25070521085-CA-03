const express = require("express");
const { protect } = require("../middleware/auth");
const s = require("../controllers/stockAlertController");

const router = express.Router();
router.use(protect);

router.get("/", s.getAlerts);
router.post("/:productId", s.addAlert);
router.delete("/:productId", s.removeAlert);

module.exports = router;