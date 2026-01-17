import express from "express";
import { User } from "../models/User.js";
import { protect,admin } from "../middleware/authMiddleware.js";

export const userAdminRouter = express.Router();

//@route GET /api/admin/users
//@desc Get all the users (Admin Only)
//@access Private/Admin
 userAdminRouter.get('/',protect,admin,async(req,res)=>{
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Server Error.'});
    }
});

//@route POST /api/admin/users
//@desc Add a new user (Admin Only)
//@access Private/Admin
userAdminRouter.post('/',protect,admin,async(req,res)=>{
    const {name,email,password,role} = req.body;
    try {
        // check user is already exist 
        let user = await User.findOne({email});
        if(user) {
            return res.status(400).json({message:'User already exist.'});
        }

        // create new user
        user = new User({
            name,
            email,
            password,
            role: role || 'customer',
        });

        // save user
        await user.save();
         
        res.status(200).json({message:'User created successfully',user});

    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Server Error.'});
    }
});


//@route PUT /api/admin/users/:id
//@desc Update existing user (admin only) - like -> name , email , role
//@access Private/Admin
userAdminRouter.put('/:id',protect,admin,async(req,res)=>{
    try {
        // check user exist
        let user = await User.findById(req.params.id);
        // if exist then update it
        if(user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
        }
        // save update user
        const updatedUser = await user.save();
        res.status(200).json({message:'User updated successfully',user:updatedUser});

    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Server Error.'});
    }
});


//@route DELETE /api/admin/users/:id
//@desc Delete a user (Admin Only)
//@access Private/Admin
userAdminRouter.delete('/:id',protect,admin,async(req,res)=>{
    try {
         // check user is exist
         let user = await User.findById(req.params.id);
         // if exist then delete the user
         if(user) {
            await user.deleteOne();
            res.status(200).json({message:'User Deleted Successfully.'});
         }
         else {
            return res.status(404).json({message:'User Not Found.'});
         }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Server Error.'});
    }
});