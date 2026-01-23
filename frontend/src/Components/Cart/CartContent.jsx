import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice.js";

const CartContent = ({ cart, userId, guestId }) => {
  // const cartContent = [
  //     {
  //         productId:1,
  //         name:'T-Shirt',
  //         size:'M',
  //         color:'Red',
  //         quantity:1,
  //         price:15,
  //         image:'https://picsum.photos/200?random=1'
  //     },
  //     {
  //         productId:2,
  //         name:'Jeans',
  //         size:'L',
  //         color:'Blue',
  //         quantity:1,
  //         price:25,
  //         image:'https://picsum.photos/200?random=2'
  //     }
  // ]

  const dispatch = useDispatch();

  // Handle adding or substarcting a cart
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        }),
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, userId, guestId, size, color }));
  };

  return (
    <div>
      {cart?.products?.map((product) => (
        <div
          key={`${product.productId}-${product.size}-${product.color}`}
          className="flex items-center justify-between py-4 border-b"
        >
          <div className="flex items-start ">

            <img
              src={product.image}
              alt={product.name}
              className="h-24 w-20 object-cover mr-4 rounded"
            />

            <div>
              <h2>{product.name}</h2>
              <p className="text-sm text-gray-500">
                size:{product.size} | color:{product.color}
              </p>

              <div className="flex items-center mt-2">

                <button
                  className="border text-xl font-medium rounded px-2 py-1"
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color,
                    )
                  }
                >
                  -
                </button>

                <span className="mx-1">{product.quantity}</span>

                <button
                  className="border text-xl font-medium rounded px-2 py-1"
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color,
                    )
                  }
                >
                  +
                </button>

              </div>

            </div>
          </div>
          <div>
            <p className="font-medium">
              ${Number(product.price || 0).toLocaleString()}
            </p>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color,
                )
              }
            >
              <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
            </button>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default CartContent;
