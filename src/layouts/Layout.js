import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './../components/Navbar';
import Navtop from './../components/Navtop';

function Layout() {
  return (
    <div className="flex h-screen">
      <div className="p-4 navbar_css border-r">
        <Navbar />
      </div>
      <div className="main-body_css">
        <div className='nav-top_css border-b flex justify-end'>
          <Navtop />
        </div>

        <div className='main-content_css'>
          <Outlet />
        </div>
      </div>
    </div>

  )
}
export default Layout;
