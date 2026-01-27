import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import PaypalButton from './PaypalButton';
import {useDispatch,useSelector} from 'react-redux';
import {createCheckout} from '../../redux/slices/checkoutSlice.js'
import axios from 'axios';

// const cart = {
//     products:[
//       {
//         name:'Stylish Jacket',
//         size:'M',
//         color:'Black',
//         price:120,
//         image:'https://picsum.photos/150?random=1',
//       },
//       {
//         name:'Casual Sneakers',
//         size:'42',
//         color:'White',
//         price:75,
//         image:'https://picsum.photos/150?random=2',
//       }, 
//     ],
//     totalPrice:195,
// }

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {cart,loading,error} = useSelector((state)=>state.cart);
    const {user} = useSelector((state)=>state.auth);

    const [checkoutId,setCheckoutId]=useState(null)
    const [shippingAddress,setShippingAddress] = useState({
        firstName:"",
        lastName:"",
        address:"",
        city:"",
        postalCode:"",
        country:"",
        phone:"",
    });

    // Ensure cart is loaded before proceeding
    useEffect(()=>{
       if(!cart || !cart.products || !cart.products.length === 0) {
          navigate('/');
       }
    },[cart,navigate]);

    const handleCreateCheckout = async (e) => {
        e.preventDefault();
        if(cart && cart.products.length > 0) {
          const response = await dispatch(createCheckout({
             checkoutItems: cart.products,
             shippingAddress,
             paymentMethod:'Paypal',
             totalPrice:cart.totalPrice,
          }));
          if(response.payload && response.payload._id) {
            setCheckoutId(response.payload._id); // set checkout id if checkout is successful
          }
        }
    }

    const handlePaymentSuccess = async (details) => {
      try {
         const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,{
           paymentStatus:'paid',paymentDetails:details
         }, {
            headers:{
              Authorization:`Bearer ${localStorage.getItem('userToken')}`,
            },
         });
         
           await handleFinalizeCheckout(checkoutId); // Finalize checkout if payment is successful
      } catch (error) {
           console.error(error);
      }
    }

    const handleFinalizeCheckout = async (checkoutId) => {
       try {
           const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,{},{
             headers:{Authorization:`Bearer ${localStorage.getItem('userToken')}`},
           });
          navigate('/order-confirmation');
       } catch (error) {
         console.error(error);
       }
    }

    // Handle upi payment 
    const handleUpiPayment = async () => {
       await handleFinalizeCheckout(checkoutId);
       await handlePaymentSuccess('UpiPayment');
    }

    if(loading) return <p>Loading cart ...</p>
    if(error) return <p>{alert(`Error:${error} , Please Refresh the Page`)}</p>
    if(!cart || !cart.products || cart.products.length === 0) {
       return <p>Your cart is empty.</p>
    }
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto max-w-7xl py-10 px-6 tracking-tighter'>

         {/* Left Section */}
         <div className='bg-white rounded-lg p-6'>
            <h2 className='text-2xl uppercase mb-6'>Checkout</h2>
            <form onSubmit={handleCreateCheckout}>
                <h3 className='text-lg mb-4'>Contact Details</h3>
                <div className='mb-4'>
                   <label className='block text-gray-700'>Email</label>
                   <input type="email" className='w-full p-2 border rounded' value={user ? user.email : ""} disabled />
                </div>
                <h3 className='text-lg mb-4'>Contact Details</h3>

                <div className='mb-4 grid grid-cols-2 gap-4'>

                  <div>
                      <label className='block text-gray-700'>FirstName</label>
                      <input 
                      type="text"
                       className='w-full p-2 border rounded'
                        value={shippingAddress.firstName}
                        onChange={(e)=>setShippingAddress({...shippingAddress,firstName:e.target.value})} 
                        required/>
                  </div>
                  <div>
                      <label className='block text-gray-700'>LastName</label>
                      <input 
                      type="text"
                       className='w-full p-2 border rounded'
                        value={shippingAddress.lastName}
                        onChange={(e)=>setShippingAddress({...shippingAddress,lastName:e.target.value})} 
                        required/>
                  </div>

                </div>

                <div className="mb-4">
                    <label className='block text-gray-700'>Address</label>
                    <input 
                    type="text"
                    className='w-full p-2 border rounded'
                    value={shippingAddress.address}
                    onChange={(e)=>setShippingAddress({...shippingAddress,address:e.target.value})} />
                </div>
                
                <div className='mb-4 grid grid-cols-2 gap-4'>

                  <div>
                      <label className='block text-gray-700'>City</label>
                      <input 
                      type="text"
                       className='w-full p-2 border rounded'
                        value={shippingAddress.city}
                        onChange={(e)=>setShippingAddress({...shippingAddress,city:e.target.value})} 
                        required/>
                  </div>
                  <div>
                      <label className='block text-gray-700'>Postal Code</label>
                      <input 
                      type="text"
                       className='w-full p-2 border rounded'
                        value={shippingAddress.postalCode}
                        onChange={(e)=>setShippingAddress({...shippingAddress,postalCode:e.target.value})} 
                        required/>
                  </div>

                </div>
                
                <div className="mb-4">
                    <label className='block text-gray-700'>Country</label>
                    <input 
                    type="text"
                    className='w-full p-2 border rounded'
                    value={shippingAddress.country}
                    onChange={(e)=>setShippingAddress({...shippingAddress,country:e.target.value})} />
                </div>
                <div className="mb-4">
                    <label className='block text-gray-700'>Phone</label>
                    <input 
                    type="tel"
                    className='w-full p-2 border rounded'
                    value={shippingAddress.phone}
                    onChange={(e)=>setShippingAddress({...shippingAddress,phone:e.target.value})} />
                </div>
                <div className='mt-6'>
                 {!checkoutId ? (<button type='submit' className='w-full bg-black text-white py-3 rounded' 
        
                  >Continue to Pay</button>)
                 :(<div>
                    <h3 className='text-2xl text-center mb-4 font-bold'>Pay With UPI</h3>
                    <button onClick={handleUpiPayment} className='w-full bg-blue-400 h-10 lg:h-15 rounded lg:text-2xl font-medium hover:bg-blue-500'>Pay ${cart.totalPrice}</button>
                    
                    <div className="text-center m-2 font-medium text-2xl">OR</div>

                    <h3 className='text-2xl text-center mb-4 font-bold'>Pay With paypal</h3>
                    <PaypalButton amount={cart.totalPrice} onSuccess={handlePaymentSuccess}  onError={()=>alert('Payment Failed.')} />
                 </div>)
                 }
                </div>
            </form>
         </div>
         {/* Right Section */}
         <div className='bg-gray-50 p-6 rounded-lg'>
             <h2 className='text-lg mb-4'>Order Summary</h2>
             <div className='border-t py-4 mb-4'>
                {
                  cart.products.map((product,index)=>(
                    <div key={index} className='flex items-start justify-between py-2 border-b'>
                      <div className='flex items-start'>
                          <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4' />
                      <div >
                          <h3 className='text-md'>{product.name}</h3>
                          <p className='text-gray-500'>Size:{product.size}</p>
                          <p className='text-gray-500'>Color:{product.color}</p>
                      </div>
                        
                      </div>
                      <p className='text-lg'>${product.price?.toLocaleString()}</p>
                    </div>
                  ))
                  }
             </div>
             <div className='flex justify-between items-center text-lg mb-4'>
                <p>SubTotal</p>
                <p>${cart.totalPrice?.toLocaleString()}</p>
             </div>
             <div className='flex justify-between items-center text-lg mb-4'>
                <p>Shipping</p>
                <p>FREE</p>
             </div>
             <div className='flex justify-between items-center text-lg mb-4'>
                <p>Total</p>
                <p>${cart.totalPrice?.toLocaleString()}</p>
             </div>
         </div>
    </div>
  )
}

export default Checkout
  