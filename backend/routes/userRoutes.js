import express from "express";
import jwt from 'jsonwebtoken';
import { User } from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

export const userRouter = express.Router();

//@route POST /api/users/register
//@desc  Register a new user
//@access Public
userRouter.post('/register',async(req,res)=>{
    const {name,email,password} = req.body;
    try {
           // Registration logic
           
           // check user already exists
           let user = await User.findOne({email}); 
           if(user) return res.status(400).json({message:'User Already Exists'});
           
            //if not exists then create and save the user in db
            user = new User({name,email,password});
            await user.save();

            // create jwt payload
            const payload = {user:{id:user._id,role:user.role}};

            // jwt sign and return the user along with token
            jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'30d'},(error,token)=>{
                if(error) throw error;

                // send token and saved user in response
                res.status(201).json({
                    message:'User Register Successfully',
                    user:{
                       _id:user._id,
                       name:user.name,
                       email:user.email,
                       role:user.role,
                    },
                    token:token,
                });
            });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error.');
    }
});

//@route POST /api/users/login
//@desc  Authenticate user
//@access Public
userRouter.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    try {
        // Authenticate logic

        // find user by email
        let user = await User.findOne({email});
        if(!user) return res.status(400).json({message:'Invalid Credentials'});
        
        const isMatched = await user.matchPassword(password);
        if(!isMatched) return res.status(400).json({message:'Invalid Credentials'});
        
        // create jwt payload
         const payload = {user:{id:user._id,role:user.role}};

        // jwt sign and return the user along with token
         jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'30d'},(error,token)=>{
                if(error) throw error;

                // send token and saved user in response
                res.status(200).json({
                    message:'User Authenticate Successfully',
                    user:{
                       _id:user._id,
                       name:user.name,
                       email:user.email,
                       role:user.role,
                    },
                    token:token,
                });
            });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error.');
    }
});

//@route GET /api/users/profile
//@desc  get Logged-in user's profile (protected route)
//@access Private
userRouter.get('/profile',protect,async (req,res)=>{
    res.status(200).json(req.user);
});