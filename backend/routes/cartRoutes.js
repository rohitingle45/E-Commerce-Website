import express from 'express';
import {Cart} from '../models/Cart.js';
import {Product} from '../models/Product.js';
import {protect} from '../middleware/authMiddleware.js';

export const cartRouter = express.Router();

// Helper function to get cart by user Id and or guest Id
const getCart = async (userId,guestId) => {
    if(userId) {
        return await Cart.findOne({user:userId});
    }
    else if(guestId) {
        return await Cart.findOne({guestId:guestId});
    }
    return null;
}

//@route POST /api/cart
//@desc Add a product in cart for a guest or logged-in user
//@access Public
cartRouter.post('/',async (req,res)=>{
  const {productId,quantity,size,color,guestId,userId} = req.body;

  try {

      const product = await Product.findById(productId);
      if(!product) return res.status(404).json({message:'Product not Found.'});
      
      // Determine if the user is guest or Logged-in
      let cart = await getCart(userId,guestId);

      // check if the cart is exist , update it
      if(cart) {
        const productIndex = cart.products.findIndex(
            (p)=>
             p.productId.toString() === productId &&
            p.size === size &&
            p.color === color   
            );

            if(productIndex > -1) {
                // if product already exist, update the quantity
                cart.products[productIndex].quantity += quantity;
            }
            else {
                // add new product
                cart.products.push({
                  productId,
                  name:product.name,
                  image:product.images[0].url,
                  price:product.price,
                  size,
                  color,
                  quantity,
                });
            }

            // Recalculate the total price
            cart.totalPrice = cart.products.reduce(
                (acc,item) => acc + item.price * item.quantity, 
                0
            );
           // save cart 
           await cart.save();
           return res.status(200).json(cart);
      }

      else {
        // create a new cart for the guest or user
        const newCart = await Cart.create({
            user:userId ? userId : undefined,
             guestId:guestId ? guestId : "guestId_"+new Date().getTime(),
            // guestId:guestId ? guestId : `guest_${Date.now()}`,

            products: [
                {
                    productId,
                    name:product.name,
                    image:product.images[0].url,
                    price:product.price,
                    size,
                    color,
                   quantity,
                }
            ],
            totalPrice:product.price * quantity,
        });
        return res.status(201).json(newCart);
      }

  } catch (error) {
     console.error(error);
     res.status(500).json({message:'Server Error.'});
  }

});

//@route PUT /api/cart
//@desc Update the product quantity in cart for guest ot logged-in user
//@access Public
cartRouter.put('/', async (req,res) => {
     const {productId,quantity,size,color,guestId,userId} = req.body;
     try {
         let cart = await getCart(userId,guestId);
         if(!cart) return res.status(404).json({message:"Cart not Found."});

           const productIndex = cart.products.findIndex(
            (p)=>
             p.productId.toString() === productId &&
            p.size === size &&
            p.color === color   
            );

          if(productIndex > -1) {
            // update quantity
            if(quantity > 0) {
                // cart.products[productIndex].quantity += quantity;
                 cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex,1); // remove product if quantity is 0
            }

             // Recalculate the total price
            cart.totalPrice = cart.products.reduce(
                (acc,item) => acc + item.price * item.quantity, 
                0
            );
           // save cart 
           await cart.save();
           return res.status(200).json(cart);
          }  
          else {
             res.status(404).json({message:"Product not Found in cart."});
          }

     } catch (error) {
         console.error(error);
         res.status(500).json({message:'Server Error.'});
     }
});

//@route DELETE /api/cart
//@desc Remove the product from the cart
//@aceess Public
cartRouter.delete('/', async (req,res) => {

     const { productId, size, color, guestId, userId } = req.body;
     
     try {
            let cart = await getCart(userId,guestId);
            if(!cart) return res.status(404).json({message:"Cart not Found."});

           const productIndex = cart.products.findIndex(
            (p)=>
             p.productId.toString() === productId &&
            p.size === size &&
            p.color === color   
            );

            if(productIndex > -1) {
                cart.products.splice(productIndex,1);

                // Recalculate the total price
                cart.totalPrice = cart.products.reduce(
                (acc,item) => acc + item.price * item.quantity, 
                0
            );
           // save cart 
           await cart.save();
            return res.status(200).json(cart);
          }  
          else {
             res.status(404).json({message:"Product not Found in cart."});
          }
     } catch (error) {
          console.error(error);
         res.status(500).json({message:'Server Error.'});
     } 
});

//@route GET /api/cart
//@desc get the cart for logged-in or guest user
//@access Public
cartRouter.get('/', async (req,res) => {
   const {userId,guestId} =req.query;
   try {
        let cart = await getCart(userId,guestId);
        if(cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({message:"Product not Found in cart."});
        }
   } catch (error) {
         console.error(error);
         res.status(500).json({message:'Server Error.'});
   }
});

//@route POST /api/cart/merge
//@desc Merge guest cart into user cart on login
//@access Private
cartRouter.post('/merge', protect, async (req,res) => {
    const {guestId} = req.body;

    try {

        // find the guest cart and user cart
        const guestCart = await Cart.findOne({guestId});
        const userCart = await Cart.findOne({user:req.user._id});

        if(guestCart) {
            if(guestCart.products.length === 0) {
            res.status(404).json({message:'Guest cart is empty.'});
                }

         if(userCart) {
            // Merge guest cart into user cart.....
            guestCart.products.forEach((guestItem)=>{
                const productIndex = userCart.products.findIndex(
                    (item) => 
                     item.productId.toString() === guestItem.productId.toString() &&
                    item.size === guestItem.size && item.color ===  guestItem.color 
                );

                if(productIndex > -1) {
                    // If the items exists in the cart, update the quantity
                    userCart.products[productIndex].quantity += guestItem.quantity;
                } else {
                    // otherwise, add the guest item to the cart 
                    userCart.products.push(guestItem);
                }
            });

             // Recalculate the total price
                userCart.totalPrice = userCart.products.reduce(
                (acc,item) => acc + item.price * item.quantity, 
                0
            );
           // save user cart 
           await userCart.save();

            // removing the guest cart after merging
            try {
                  await Cart.findOneAndDelete({guestId});
            } catch (error) {
                console.error(error);
                
            }
                return res.status(200).json(userCart);
        } else {
            // If the user cart is empty then assingnig the guest cart to it.....
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            await guestCart.save();
            return res.status(200).json(guestCart);
        }
        } else {
             if(userCart) {
                // Guest cart is already been merged then return the user cart
               return res.status(200).json(userCart);
             }
            res.status(404).json({message:'Guest cart is not found.'});
        }
        
    } catch (error) {
        console.error(error);
         res.status(500).json({message:'Server Error.'});
    }
});

