import React from 'react'
import {HiShoppingBag} from 'react-icons/hi'
import {HiOutlineCreditCard,HiOutlineArrowPathRoundedSquare} from 'react-icons/hi2'

const FeaturedSection = () => {
  return (
      <section className='py-16 px-4 bg-white'>
          <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>

             {/* Feature1 */}
             <div className='flex flex-col items-center'>
                  <div className='p-4 rounded-full mb-4'>
                     <HiShoppingBag className='text-2xl'/>
                  </div>
                  <h2 className='uppercase mb-2 tracking-tighter'>free international shipping</h2>
                  <p className='text-sm tracking-tighter text-gray-600'>on all orders over $100.00</p>
             </div>

              {/* Feature2*/}
             <div className='flex flex-col items-center'>
                  <div className='p-4 rounded-full mb-4'>
                     <HiOutlineArrowPathRoundedSquare className='text-2xl'/>
                  </div>
                  <h2 className='uppercase mb-2 tracking-tighter'>45 days return</h2>
                  <p className='text-sm tracking-tighter text-gray-600'>money back guarantee</p>
             </div>

              {/* Feature3 */}
             <div className='flex flex-col items-center'>
                  <div className='p-4 rounded-full mb-4'>
                     <HiOutlineCreditCard className='text-2xl'/>
                  </div>
                  <h2 className='uppercase mb-2 tracking-tighter'>secure checkout</h2>
                  <p className='text-sm tracking-tighter text-gray-600'>100% secure checkout process</p>
             </div>
          </div>
      </section>
  )
}

export default FeaturedSection
