import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../assets/Logo.png';
import passicon from '../../assets/passchanged.png';

const initialValues = {
  email: ""
}
function EmailSent({ userEmail }) {
  const email = useSelector((state) => state.email);

  async function handleResendLink() {
    try {
      const response = await axios.post('https://phplaravel-980736-3436689.cloudwaysapps.com/api/v1/email/resend', { email });

      if (response.status === 200) {
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
      <div className="flex flex-col items-center justify-center  relative">

        <img src={logo} alt="logo" className="ml-20 mt-10 absolute top-0 left-0" />
        <div className='flex flex-col items-center  mt-64 bg-primaryBackground p-8 w-3/12 verification_card shadow-onboardingShadow'>
          <img src={passicon} alt="logo" className="mb-10" />

          <h2 className="text-2xl font-bold mb-4 ">Password Changed</h2>

          <p className='text-center text-gray-500'>Your password has been successfully Reset.</p>

          <Link
            to="/"
            type="submit"
            className="flex items-center justify-center px-4 py-2 mt-10 bg-primarybtn text-white transition duration-300 ease-in-out rounded-lg w-full h-12 font-bold"
          >
            Back to Log in
          </Link>

        </div>
      </div>
    </div>


  )
}
export default EmailSent;
