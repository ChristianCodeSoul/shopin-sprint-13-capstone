const express = require("express");
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.post("/", protect, createOrder);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);

module.exports = router;