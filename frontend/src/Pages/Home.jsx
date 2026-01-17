import React, { useEffect, useState } from 'react'
import Hero from '../Components/Layout/Hero'
import GenderCollectionSection from '../Components/Products/GenderCollectionSection'
import NewArrival from '../Components/Products/NewArrival'
import ProductsDetails from '../Components/Products/ProductsDetails'
import ProductGrid from '../Components/Products/ProductGrid'
import FeaturedCollection from '../Components/Products/FeaturedCollection'
import FeaturedSection from '../Components/Products/FeaturedSection'
import {useDispatch , useSelector} from 'react-redux';
import {fetchProductsByFilters} from '../redux/slices/productsSlice.js';
import axios from 'axios'

const Home = () => {
 
  const dispatch = useDispatch();
  const {products , loading , error} = useSelector((state)=>state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(()=>{
     // Fetch products for a specific collection
     dispatch(fetchProductsByFilters({
        gender:'Women',
        category:'Bottom Wear',
        limit:8,
     }));
     // fetch best seller product
     const fetchBestSeller = async () => {
       try {
         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
         setBestSellerProduct(response.data);
       } catch (error) {
         console.error(error);
       }
     }
    fetchBestSeller();
  },[dispatch]);


  return (
    <div>
         <Hero/>
         <GenderCollectionSection/>
         <NewArrival/>
         {/* Best Seller */}
         <h2 className='text-center font-bold text-3xl mb-4'>Best Seller</h2>
         { bestSellerProduct ? (<ProductsDetails productId={bestSellerProduct._id}/>) : (
          <p className='text-center'>best seller product loading ...</p>
         )}
         {/* <ProductsDetails/> */}
         {/* Top wear for Women's */}
         <div className='container mx-auto'>
            <h2 className='text-center font-semibold text-3xl mb-4 '>Top Wear for Women's</h2>
            <ProductGrid products={products} loading={loading} error={error} />
            <FeaturedCollection/>
            <FeaturedSection/>
         </div>
    </div>
  )
}

export default Home
   