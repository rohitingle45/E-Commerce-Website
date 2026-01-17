import express from "express";
import { Product } from "../models/Product.js";
import { protect,admin } from "../middleware/authMiddleware.js";

export const productAdminRouter = express.Router();

//@route GET /api/admin/products
//@desc Get all the products (Admin Only)
//@access Private/Admin
productAdminRouter.get('/',protect,admin,async(req,res)=>{
    try {
        // Get All the products
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
       console.error(error);
       res.status(500).json({message:'Server Error.'}); 
    }
});