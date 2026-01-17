import React from 'react'
import {TbBrandMeta} from 'react-icons/tb';
import {IoLogoInstagram} from 'react-icons/io';
import {RiTwitterXLine} from 'react-icons/ri';

const TopBar = () => {
  return (
    <div className='bg-[#ea2e0e] text-white'>
        
        <div className="container mx-auto flex justify-between py-3 px-2">

            <div className='hidden md:flex items-center space-x-4'>

            <div>
                <a href="#" className='hover:text-gray-300'>
                    <TbBrandMeta className='h-5 w-5'/>
                </a>
            </div>

            <div>
                <a href="#" className='hover:text-gray-300'>
                    <IoLogoInstagram className='h-5 w-5'/>
                </a>
            </div>

            <div>
                <a href="#" className='hover:text-gray-300'>
                    <RiTwitterXLine className='h-4 w-4'/>
                </a>
            </div>

            </div>

            <div className='text-sm text-center flex-grow'>
                <span>WorldWide Shipping - Fastest and Reliable</span>
            </div>
             
             <div className='text-sm hidden md:block'>
                 <a href="tel:+808030XXXX" className='hover:text-gray-300'>808030XXXX</a>
             </div>

        </div>
    </div>
  )
}

export default TopBar
