import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import {Outlet} from 'react-router-dom';

const AdminLayout = () => {

  const [isSideBarOpen , setIsSideBarOpen] = useState(false);

  const toggleSidebar = () => {
     setIsSideBarOpen(!isSideBarOpen);
  }

  return (
    <div className='min-h-screen flex flex-col md:flex-row relative'>
        {/* Mobile Toggle Button */}
        <div className='flex md:hidden p-4 bg-gray-900 text-white z-50'>
          <button onClick={toggleSidebar}>
            <FaBars size={24} />
          </button>
          <h1 className='ml-4 text-xl font-medium'>Admin DashBoard</h1>
        </div>
        {/* OverLay for Mobile Side-Bar */}
        {
          isSideBarOpen && (
            <div className='fixed inset-0 z-10 bg-gray-600 md:hidden' onClick={toggleSidebar}>
            </div>
          )
        }
        {/* SideBar */}
        <div className={`bg-gray-900 w-64 min-h-screen fixed text-white absolute md:relative transform  ${isSideBarOpen ? "translate-x-0":"-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:block z-50`}>
           {/* Sidebar */}
           <AdminSidebar toggleSidebar={toggleSidebar}/>
        </div>
        {/* Main Content */}
        <div className='flex-grow p-6 overflow-auto'>
          <Outlet/>
        </div>
    </div>
  )
}

export default AdminLayout
