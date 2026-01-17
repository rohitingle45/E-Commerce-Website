import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// middleware to protecting routes

export const protect = async (req,res,next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
       try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.user = await User.findById(decoded.user.id).select("-password") // exclude password 
            next(); // allow to access respective route
       } catch (error) {
        console.log(error);
         return res.status(401).json({message:'Token Not Authorized'})
       }
  }
  else {
      return res.status(401).json({message:'Token Not Found'})

  }
}

// middleware to check if user is admin
export const admin = (req, res, next) => {
   if(req.user && req.user.role === 'admin') {
     next();
   } 
   else {
     res.status(403).json({message:"Not Authorized as an admin"});
   }
}
