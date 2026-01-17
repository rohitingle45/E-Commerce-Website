import express from "express";
import { Order } from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

export const orderRouter = express.Router();

//@route GET /api/orders/my-orders
//@desc Get Logged-In user's order's
//@access Private
orderRouter.get("/my-orders", protect, async (req, res) => {
  try {
    // Find orders for the authenticate user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); // sort by most recents orders
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error." });
  }
});

//@route GET /api/orders/:id
//@desc Get order by Id
//@access Private
orderRouter.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    // if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid Order ID" });
    // }

    const order = await Order.findById(id).populate("user", "name email");
    if (!order) {
      res.status(404).json({ message: "Order not Found." });
    }
    // Return the full order details
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error." });
  }
});
