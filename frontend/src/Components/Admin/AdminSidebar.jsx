import React from 'react'
import { Link,NavLink, useNavigate } from 'react-router-dom'
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa'
import { IoIosHome } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { clearCart } from '../../redux/slices/cartSlice';

const AdminSidebar = ({toggleSidebar}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user} = useSelector((state)=>state.auth);

    const handleLogOut = () => {
       dispatch(logout()); 
       dispatch(clearCart());
       navigate("/")
    }

  return (
    <div className='p-6'>
      <div className='mb-6'>
       <Link to="/admin" className='text-2xl font-medium'>{user?.name}</Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">Admin DashBoard</h2>
      <nav className="flex flex-col space-y-2">
         <NavLink to="/" className={({isActive}) =>
         isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 "
            : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
        }>
            <IoIosHome/>
            <span>Home</span>
        </NavLink>

        <NavLink onClick={toggleSidebar} to="/admin/users" className={({isActive}) =>
         isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 "
            : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
        }>
            <FaUser/>
            <span>Users</span>
        </NavLink>
         <NavLink onClick={toggleSidebar} to="/admin/products" className={({isActive}) =>
         isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 "
            : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
        }>
            <FaBoxOpen/>
            <span>Products</span>
        </NavLink>
         <NavLink onClick={toggleSidebar} to="/admin/orders" className={({isActive}) =>
         isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 "
            : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
        }>
            <FaClipboardList/>
            <span>Orders</span>
        </NavLink>
         <NavLink onClick={toggleSidebar} to="/collections/all" className={({isActive}) =>
         isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2 "
            : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
        }>
            <FaStore/>
            <span>Shop</span>
        </NavLink>
      </nav>
      <div className='mt-6'>
          <button onClick={handleLogOut} className='bg-red-500 hover:bg-red-600 w-full text-white  flex items-center justify-center space-x-2 rounded py-2 px-4'>
               <FaSignOutAlt />
               <span>Logout</span>
          </button>
      </div>
    </div>
  )
}

export default AdminSidebar
