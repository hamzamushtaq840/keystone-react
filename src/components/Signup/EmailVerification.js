import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../assets/Logo.png';
import verify from '../../assets/verify.svg';
import { post } from "../../services/api";
function EmailVerification({ userEmail }) {
  const email = useSelector((state) => state.email);
  console.log('Email in EmailVerification:', email);
  async function handleResendLink() {
    try {
      const response = await post('/api/v1/email/resend', { email });
      if (response.status) {
        console.log('Link resend successful');
        // Handle success here
      } else {
        console.log('Link resend failed');
        // Handle failure here
      }
    } catch (error) {
      console.log('Link resend error:', error);
      // Handle failure here
    }
  }
  return (
    <div>
      <img src={logo} alt="logo" className="ml-20 mt-10 absolute top-0 left-0" />
      <div className="flex flex-col items-center justify-center  relative">
        <div className='flex flex-col items-center mt-64 bg-primaryBackground p-8 xsm:px-[20px] w-[536px] xsm:w-[310px]  shadow-2xl rounded-lg'>
          <h2 className="text-[32px] font-bold mb-4  text-center text-primarytext">Check your inbox to verify your email</h2>
          <img src={verify} alt="verify" className='mt-12' />
          <p className='text-center mt-12' >We have sent a verification link. Please click on the link to verify your account and start using keystone.
          </p>
          <div className='flex mt-8'>
            <p className='mr-2'>Need help? Have a question?</p>
            <a to="/signup" className='text-primarytext font-bold'>Support team</a>
          </div>
          <div className='flex mt-6'>
            <p className='mr-2'>Didn't receive any email?</p>
            <Link
              className="text-primarytext font-bold cursor-pointer"
              onClick={handleResendLink}
            >
              Resend link
            </Link></div>
        </div>
      </div>
    </div>
  )
}
export default EmailVerification;