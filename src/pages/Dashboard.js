import React from 'react';

import { useSelector } from 'react-redux';
import truckicon from '../assets/truckdash.svg';

function Dashboard() {
    const firstName = useSelector((state) => state.user.firstname);
    const lastName = useSelector((state) => state.user.lastname);

    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');

    return (

        <div className='main-content_css'>
            <div className='flex flex-col items-center '>
                <h1 className='font-bold text-3xl text-zinc-600 mt-28' > Welcome, {firstName ? firstName : firstname} {lastName ? lastName : lastname} </h1>
                <h5 className='text-2xl font-medium text-zinc-600'>KeyStone TMS</h5>
                <img src={truckicon} className='mt-32' />
            </div>
        </div>
    )
}
export default Dashboard;
