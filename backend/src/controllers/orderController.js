const Order = require("../models/Order");

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.userId,
        })
            .populate(
                "user",
                "firstName lastName username email"
            )
            .populate(
                "items.product",
                "title price image category"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        console.error("Get orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId,
        })
            .populate(
                "user",
                "firstName lastName username email"
            )
            .populate(
                "items.product",
                "title price image category"
            );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Get order error:", error);

        res.status(400).json({
            success: false,
            message: "Invalid order ID",
        });
    }
};

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount } = req.body;

        if (
            !items ||
            items.length === 0 ||
            totalAmount === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Items and total amount are required",
            });
        }

        const order = await Order.create({
            user: req.user.userId,
            items,
            totalAmount,
        });

        const populatedOrder = await order.populate([
            {
                path: "user",
                select: "firstName lastName username email",
            },
            {
                path: "items.product",
                select: "title price image category",
            },
        ]);

        const io = req.app.get("io");

        if (io) {
            io.to("admins").emit("new-order", {
                message: "New Order Received",
                order: populatedOrder,
            });
        }

        res.status(201).json({
            success: true,
            data: populatedOrder,
        });
    } catch (error) {
        console.error("Create order error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to create order",
        });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId,
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate(
                "user",
                "firstName lastName username email"
            )
            .populate(
                "items.product",
                "title price image category"
            );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Update order error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to update order",
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    } catch (error) {
        console.error("Delete order error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to delete order",
        });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};