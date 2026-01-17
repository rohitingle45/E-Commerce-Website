import express from "express";
import { Order } from "../models/Order.js";
import { protect,admin } from "../middleware/authMiddleware.js";

export const orderAdminRouter = express.Router();

//@route GET /api/admin/orders
//@desc Get all the orders (Admin Only)
//@access Private/Admin
orderAdminRouter.get('/',protect,admin,async(req,res)=>{
   try {
       // Get all the orders
       const orders = await Order.find({}).populate('user','name email');
       res.status(200).json(orders);
   } catch (error) {
     console.error(error);
     res.status(500).json({message:'Server Error.'});
   }
});


//@route PUT /api/admin/orders/:id
//@desc Update order status (Admin Only)
//@access Private/Admin
orderAdminRouter.put('/:id',protect,admin,async(req,res)=>{
   try {
       // check order exist or not 
       const order = await Order.findById(req.params.id).populate('user','name');   
       // if exist then , 
       if(order) {
         // update order status
         order.status = req.body.status || order.status;
         order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
         order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;
         // save updated order
         const updatedOrder = await order.save();
         res.status(200).json({message:'Order Updated',order:updatedOrder});
       }
       // not exist then ,
       else {
         res.status(404).json({message:'Order not Found.'});
       }
   } catch (error) {
     console.error(error);
     res.status(500).json({message:'Server Error.'});
   }
});


//@route DELETE /api/admin/orders/:id
//@desc Delete the order (Admin Only)
//@access Private/Admin
orderAdminRouter.delete('/:id',protect,admin,async(req,res)=>{
  try {
     // check order exist or not
     const order = await Order.findById(req.params.id);
     // if exist then,
     if(order) {
         // delete the order
         await order.deleteOne();
         res.status(200).json({message:'Order removed.'});
     }
     // if not exist then,
     else {
        res.status(404).json({message:'Order not Found.'});
     }
  } catch (error) {
     console.error(error);
     res.status(500).json({message:'Server Error.'});
  }
});