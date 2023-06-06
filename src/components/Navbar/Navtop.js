import React from 'react';

import logo from '../assets/Logo.png';
import { Link } from 'react-router-dom';
import settingicon from '../assets/seticon.svg';
import arrowdown from '../assets/arrowdown.png';
import { useState } from 'react';
import invoiceicon from '../assets/invoiceicon.svg';
import companyicon from '../assets/companyicon.svg';
import HelpIcon from '../../assets/icons/help'
import UserDropdownMenu from './smallcomponents/UserDropdownMenu'
function Navtop() {
  return (

    <div className='flex self-center'>

      <div>
        {/* <i className={helpicon} /> */}
        <div className=' flex justify-center items-center mr-5'>
          <div className="vertical-line mr-8  "></div>
          {/* <img src={helpicon} className='mr-2' /> */}
          <HelpIcon className='mr-2 help' />
          <span>Help</span>
        </div>
      </div>
      <div className='self-center  user_css w-9 h-9 mr-5 flex justify-center items-center '>
        <span >FD</span>
      </div>
      <div className='mr-6'>
        <UserDropdownMenu />

      </div>


    </div>


  )
}
export default Navtop;
