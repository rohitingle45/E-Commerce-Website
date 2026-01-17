import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import {deleteProduct, fetchAdminProducts} from '../../redux/slices/adminProductSlice.js';

const ProductManagement = () => {
//     const products = [
//     {
//         _id:123123,
//         name:"Shirt",
//         price:110,
//         sku:"123123123",
//     },
// ];
const dispatch = useDispatch()
const {products,loading,error} = useSelector((state)=>state.adminProducts);

useEffect(()=>{
    dispatch(fetchAdminProducts());
},[dispatch]);

const handleDeleteProduct = (id) => {
  if(window.confirm("Are you sure to delete this Product ?")) {
    dispatch(deleteProduct(id));
  }
}

if(loading) return <p>Loading ...</p>
if(error) return <p>Error:{error}</p>
  return (
    <div className='max-w-7xl mx-auto'>
       <h2 className='text-2xl font-bold mb-6'>Product Management</h2>
       <div className='overflow-x-auto shadow-md sm:rounded-lg'>
       <table className='min-w-full text-left text-gray-500'>
          <thead className='text-left text-sm uppercase bg-gray-100 text-gray-700'>
             <tr>
             <th className='py-3 px-4'>Name</th>
             <th className='py-3 px-4'>Price</th>
             <th className='py-3 px-4'>SKU</th>
             <th className='py-3 px-4'>Actions</th>
             </tr>
          </thead>
          <tbody>
            {
                products.length > 0 ? (
                    products.map((product)=>(
                        <tr key={product._id} className='border-b hover:bg-gray-50 cursor-pointer'>
                            <td className='font-medium text-gray-900 p-4 whitespace-nowrap'>{product.name}</td>
                            <td className='p-4'>${product.price}</td>
                            <td className='p-4'>{product.sku}</td>
                            <td className='p-4 flex flex-col md:flex-row gap-2'>
                             <Link
                             to={`${product._id}/edit`}
                             className='bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2 w-20 text-center'
                             >Edit</Link>
                             <button className='bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 w-20 text-center'
                             onClick={()=>handleDeleteProduct(product._id)}
                             >Delete</button>
                            </td>
                        </tr>
                    ))
                ) 
                : (<tr>
                    <td colSpan={4} className='p-4 text-center text-gray-500'>
                        No Product Found.
                    </td>
                </tr>)
            }
          </tbody>
       </table>
       </div>
    </div>
  )
}

export default ProductManagement
