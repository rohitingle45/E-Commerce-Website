import React from 'react'
import {Link} from 'react-router-dom'
import { TbBrandInstagram, TbBrandMeta } from 'react-icons/tb';
import {RiTwitterXLine} from 'react-icons/ri'
import {FiPhoneCall} from 'react-icons/fi'

const Footer = () => {

  return (

    <footer className='p-12 border-t'>

         <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>

            <div>

               <h3 className='text-gray-800 text-lg mb-4'>Newsletter</h3>
               <p className='text-gray-500 mb-4'>
                 Be the first to hear about new products, exclusive events, and online offers.
               </p>
               <p className='text-sm font-medium text-gray-600 mb-6'>
                Sign up and get 10% off on your first order
               </p>

               <form className='flex'>
                 <input type="email" placeholder='Enter your email' className='py-3 px-2 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus-ring-2 focus:ring-gray-500 transition-all' required/>
                 <button className='bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all'>Subscribe</button>
               </form>

            </div>

            <div>
                <h2 className='text-lg text-gray-800 mb-4'>Shop</h2>
                <ul className='space-y-2 text-gray-600' >
                    <li>
                        <Link to='#' className='hover:text-gray-500 transition-colors'>
                         Men's Top Wear
                        </Link>
                    </li>
                    <li>
                        <Link to='#' className='hover:text-gray-500 transition-colors'>
                         Women's Top Wear
                        </Link>
                    </li>
                    <li>
                        <Link to='#' className='hover:text-gray-500 transition-colors'>
                         Men's Bottom Wear
                        </Link>
                    </li>
                    <li>
                        <Link to='#' className='hover:text-gray-500 transition-colors'>
                         Women's Bottom Wear
                        </Link>
                    </li>
                </ul>
            </div>

            <div>
                <h2 className='text-lg text-gray-800 mb-4'>Support</h2>
                <ul className='space-y-2 text-gray-600' >
                    <li>
                        <Link to='#' className='hover:text-gray-500 transition-colors'>
                         Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link to='#' className='hover:text-gray-500 transition-colors'>
                         About Us
                        </Link>
                    </li>
                    <li>
                        <Link to='#' className='hover:text-gray-500 transition-colors'>
                         FAQs
                        </Link>
                    </li>
                    <li>
                        <Link to='#' className='hover:text-gray-500 transition-colors'>
                         Features
                        </Link>
                    </li>
                </ul>
            </div>

            <div>
                <h3 className='text-gray-800 mb-4 text-lg'>Follow Us</h3>
                <div className='flex items-center space-x-4 mb-6'>
                  <a href="#" target='_blank' className='hover:text-gray-500'>
                    <TbBrandMeta className='h-6 w-6'/>
                  </a>
                  <a href="#" target='_blank' className='hover:text-gray-500'>
                    <TbBrandInstagram className='h-6 w-6'/>
                  </a>
                  <a href="#" target='_blank' className='hover:text-gray-500'>
                    <RiTwitterXLine className='h-4 w-4'/>
                  </a>

                </div>
                <p className='text-gray-500'>Call us</p>
                <p>
                    <FiPhoneCall className='h-4 w-4 mt-1 inline-block mr-2'/>
                    808030XXXX
                </p>
            </div>

         </div>

         <div className='container mx-auto border-t mt-12 px-4 lg:px-0 border-gray-200 pt-6'>
              <p className='text-gray-500 tracking-tighter text-sm text-center'>@ 2025, @Rohit_Ingle all the right reserved.</p>
         </div>

    </footer>
    
  )
}

export default Footer
