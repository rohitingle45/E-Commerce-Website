import express from "express";
import { Subscriber } from "../models/Subscriber.js";

export const subscribeRouter = express.Router();

//@route POST /api/subscribe
//@desc Handle newsletter subscription
//@access Public
subscribeRouter.post('/',async(req,res)=>{
   const {email} = req.body;
   // if email not found.
   if(!email) {
    return res.status(400).json({message:'email not found.'});
   }
   try {
      // check if subscriber already done
      let subscriber = await Subscriber.findOne({email});
      if(subscriber) {
        return res.status(400).json({message:'already subscribed to newsletter.'});
      }
      // create new subcriber
      subscriber = new Subscriber({email});
      // save subscriber
      await subscriber.save();

      res.status(201).json({message:'Successfully subscribed to newsletter.'});
   } catch (error) {
     console.error(error);
     res.status(500).json({message:'Server Error.'});
   }
});