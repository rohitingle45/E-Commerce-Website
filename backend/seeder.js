import mongoose from "mongoose";
import 'dotenv/config';
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";
import { products } from "./data/products.js";
import { Cart } from "./models/Cart.js";

// connect with DB
mongoose.connect(process.env.MONGO_URI);

// function to seed data
const seedData = async () => {
   try {
       // delete existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();

    // Create default admin user
    const createdUser = await User.create({
        name:'Rohit Ingle',
        email:'rohit@gmail.com',
        password:'rohit123',
        role:'admin',
    });

    // Assigning default user-id to each product
    const userID = createdUser._id;

    const sampleProducts = products.map((product)=>{
        return {...product, user:userID};
    });

    // Insert the products into the DB
    await Product.insertMany(sampleProducts);
    console.log('Product Data seede successfully');
    process.exit();
   } catch (error) {
      console.log('Error seeding the data',error);
      process.exit(1);
   }
    
}

seedData();