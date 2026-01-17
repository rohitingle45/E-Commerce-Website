import React from 'react'
import TopBar from '../Layout/TopBar.jsx'
import NavBar from './NavBar.jsx'


const Header = () => {
  return (
    <header className='border-b border-gray-200'>
         <TopBar/>
         <NavBar/>
    </header>
  )
}

export default Header
