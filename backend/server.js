import express, { json, urlencoded } from "express";
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/userRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { cartRouter } from "./routes/cartRoutes.js";
import { checkoutRouter } from "./routes/checkoutRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import { uploadRouter } from "./routes/uploadRoutes.js";
import { subscribeRouter } from "./routes/subscribeRoutes.js";
import { userAdminRouter } from "./routes/userAdminRoutes.js";
import { productAdminRouter } from "./routes/productAdminRoutes.js";
import { orderAdminRouter } from "./routes/orderAdminRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); 
app.use(json());
app.use(express.urlencoded({extended:true}));

// connecting with mongodb
connectDB();

// simple route for testing
app.get('/',(req,res)=>{
  res.send('Hello, Rohit Ingle From Backend');
})

// API Routes

// user route
app.use('/api/users',userRouter);

// product route
app.use('/api/products',productRouter);

// cart route
app.use('/api/cart',cartRouter);

// checkout route
app.use('/api/checkout',checkoutRouter);

// order route
app.use('/api/orders',orderRouter);

// upload route
app.use('/api/upload',uploadRouter);


// subscriber route
app.use('/api/subscribe',subscribeRouter);

// Admin route

// User route (Admin)
app.use('/api/admin/users',userAdminRouter);


// Product route (Admin)
app.use('/api/admin/products',productAdminRouter);

// Order route (Admin)
app.use('/api/admin/orders',orderAdminRouter);


// server runs on following port
app.listen(PORT,()=>{
    console.log(`server runnning on http://localhost:${PORT}`);
});

