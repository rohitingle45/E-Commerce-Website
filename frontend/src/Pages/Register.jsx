import React, { useState } from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import register from '.././assets/register.webp'
import { registerUser } from '../redux/slices/authSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slices/cartSlice.js';
import { useEffect } from 'react';


const Register = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [localError, setLocalError] = useState(null);

    const dispatch = useDispatch();
   
        const navigate = useNavigate();
        const location = useLocation();
        const {user,guestId,loading,error} = useSelector((state)=>state.auth);
        const {cart} = useSelector((state)=>state.cart);
    
        // Get redirect parameter and check if it's checkout or something else
          const redirect = new URLSearchParams(location.search).get('redirect') || '/';
          const isCheckoutRedirect = redirect.includes('checkout');
      
          useEffect(()=>{
              if(user) {
                 if(cart?.products.length > 0 && guestId) {
                   dispatch(mergeCart({guestId,user})).then(()=>{
                    navigate(isCheckoutRedirect ? '/checkout':'/');
                   });
                 } else {
                  navigate(isCheckoutRedirect ? '/checkout' : '/');
                 }
              }
          },[user,guestId,cart,navigate,isCheckoutRedirect,dispatch]);


          // Error Message Showing on the UI
            useEffect(() => {
              if (error) {
                setLocalError(error);
          
                const timer = setTimeout(() => {
                  setLocalError(null);
                }, 2000);
          
                return () => clearTimeout(timer);
              }
            }, [error]);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({name,email,password}));
    } 

  return (
    <div className='flex'>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
         <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
            <div className="flex justify-center mb-6">
              <h2 className='text-xl font-medium'>Register</h2>
            </div>
            <h2 className='text-2xl font-bold text-center mb-6'>Hey there!</h2>
            <p className='text-center font-semibold mb-6'>Enter username and password to Login</p>
              <div className="mb-4">
                <label htmlFor="name" className='block text-sm font-semibold mb-2'>Name</label>
                <input 
                id='name'
                type="text" 
                value={name}
                onChange={(e)=>setName(e.target.value)} 
                className='w-full p-2 border rounded'
                placeholder='Enter your Name'
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className='block text-sm font-semibold mb-2'>Email</label>
                <input 
                id='email'
                type="email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                className='w-full p-2 border rounded'
                placeholder='Enter your Email'
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className='block text-sm font-semibold mb-2'>Password</label>
                <input 
                id='password'
                type="password" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
                className='w-full p-2 border rounded'
                placeholder='Enter your Password'
                />
            </div>
            <button className='bg-black text-white p-2 rounded-lg font-semibold w-full hover:bg-gray-800'>{loading ? 'Please Wait...':'Sign Up'}</button>
             {localError && <p className='text-red-400 m-1 text-center'>{localError}</p>}
            <p className='mt-6 text-center text-sm'>
                Already have an account? {""}
              <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500'>
               Login
              </Link>
            </p>
         </form>
        </div>
        <div className='hidden md:block w-1/2 bg-gray-800'>
           <div className='h-full flex flex-col justify-center items-center'>
             <img src={register} alt="register and join" className='h-[750px] w-full object-cover'/>
           </div>
        </div>
    </div>
  )
}

export default Register
