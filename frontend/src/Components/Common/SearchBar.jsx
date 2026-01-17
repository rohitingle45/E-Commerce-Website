import React, { useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2'
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {fetchProductsByFilters, setFilters} from '../../redux/slices/productsSlice.js';

const SearchBar = () => {
 
    const [searchTerm , setSearchTerm] = useState('');
    const [isOpen , setIsOpen] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleSearchToggle = () => {
       setIsOpen(!isOpen)
    }

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setFilters({search:searchTerm}));
        dispatch(fetchProductsByFilters({search:searchTerm}));
        navigate(`/collections/all?search=${searchTerm}`);
        setIsOpen(false);
    }

  return (

    <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50":"w-auto"}`} >

      {isOpen ? (
        <form onSubmit={handleSearch} className ='relative flex items-center justify-center w-full'>

        <div className='relative w-1/2'>

             <input type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder='Search' className='bg-gray-100 px-4 py-2 pl-3 pr-12 focus:outline-none placeholder:text-gray-700 w-full rounded-lg' />

        </div>

         <button type='submit' className='absolute right-1/4'>
             <HiMagnifyingGlass className='h-6 w-6'/>
         </button>

         <button type='button' onClick={handleSearchToggle} className='absolute right-1/8'>
             <HiMiniXMark className='h-7 w-7'/>
         </button>

      </form> )
       : (
        <button onClick={handleSearchToggle}>
             <HiMagnifyingGlass className='h-6 w-6'/>
         </button>
      )}
    </div>
  )
}

export default SearchBar
