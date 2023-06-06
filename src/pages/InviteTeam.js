import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png';
import companyimage from '../assets/teamimage.png';
import { useFormik } from 'formik';
import CustomDropdown from "../components/smallcomponents/CustomDropdownWithFormik";
import { InviteValidation } from '../utils/schema';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Alert from '../components/Alert';
import { post } from "../services/api";

const options = ["User", "Admin"];

const initialValues = {
  firstname: "",
  lastname: "",
  email: "",
  userType: "Select an option"
}
function InviteTeam() {
  const [apiError, setApiError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (alert.show) {
  //     const timer = setTimeout(() => {
  //       setAlert({ ...alert, show: false });
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [alert.show]);
  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched, resetForm } = useFormik({
    initialValues: initialValues,
    validationSchema: InviteValidation,
    onSubmit: async (values) => {
      const data = {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        userType: values.userType, // Add userType to data object
      };
      const authToken = localStorage.getItem('authToken');
      console.log(authToken)
      try {
        const response = await post('/api/v1/invites', data, authToken);
        if (response.success) {

          resetForm();
          setAlert({ show: true, message: 'Invite Sent Successfully!', type: 'success' });

        }
        // navigate('/dashboard');
      } catch (error) {
        setApiError(error.response.data.message);
      }
    },

  });

  // CustomDropdown component with userType value update
  const CustomDropdownWithFormik = (props) => {
    const onOptionClick = (option) => {
      if (option === "Select an option") {
        setFieldValue("userType", "");
        // setFieldTouched("userType", true, false);  // set the field to touched and invalid
      } else {
        setFieldValue("userType", option);
        // setFieldTouched("userType", true);  // set the field to touched and valid
      }
    };

    return <CustomDropdown {...props} selectedValue={values.userType} onOptionClick={onOptionClick} />;
  };
  return (

    <div className='flex'>

      <div className="w-1/2">

        <div className="flex flex-col items-center justify-center h-screen relative">

          <img src={logo} alt="logo" className="ml-20 mt-10 absolute top-0 left-0" />
          <div className='login_error'>
            <Alert
              show={alert.show}
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert({ ...alert, show: false })}
            />
          </div>
          <div className='flex flex-col items-center bg-primaryBackground p-8 signin_css shadow-onboardingShadow mt-5'>
            <h2 className="text-4xl font-bold mb-4 ">Invite Team Member</h2>
            <p className='mb-8 leading-4'>Invite your team members</p>
            <form onSubmit={handleSubmit} className="flex flex-col w-full">

              <div className='flex'>
                <div className='flex flex-col'>
                  <label for="firstname" className='text-primarytext mb-2 mt-2'>First Name</label>
                  <input
                    id="firstname"
                    name='firstname'
                    type="name"
                    placeholder="Enter First name"
                    value={values.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-4 py-2 border  border-gray-400 rounded h-12 small_input mr-6 focus:ring-transparent"

                  />      {errors.firstname && touched.firstname ? <span className='form-error text-red-500' >{errors.firstname}</span> : null}
                </div>
                <div className='flex flex-col'>
                  <label for="lastname" className='text-primarytext mb-2 mt-2'>Last Name</label>
                  <input
                    id="lastname"
                    name='lastname'
                    type="name"
                    placeholder="Enter Last name"
                    value={values.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-4 py-2 border  border-gray-400 rounded h-12 small_input focus:ring-transparent"

                  />
                  {errors.lastname && touched.lastname ? <span className='form-error text-red-500' >{errors.lastname}</span> : null}
                </div>
              </div>

              <label for="email" className='text-primarytext mb-2 mt-4'>Email ID</label>
              <input
                id="email"
                name='email'
                type="email"
                placeholder="Enter Email ID"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2 border  border-gray-400 rounded h-12 btn_custom focus:ring-transparent "

              />
              {errors.email && touched.email && !apiError ? (
                <span className='form-error text-red-500'>{errors.email}</span>
              ) : null}
              {apiError ? (
                <span className='form-error text-red-500'>{apiError}</span>
              ) : null}

              <label className="block font-bold mb-2 text-primarybtn mt-6" htmlFor="select">
                Team Member Role
              </label>

              <CustomDropdownWithFormik options={options} />
              {errors.userType && touched.userType ? (
                <span className="form-error text-red-500">{errors.userType}</span>
              ) : null}
              <div className='flex justify-end'>
                <Link to="/dashboard" className="font-semibold mt-6 border border-solid bg-green-50 text-primarybtn border-gray-400  transition duration-300 ease-in-out rounded-lg  px-12 py-3 ">Skip</Link>

                <button type="submit" className="font-semibold mt-6 bg-primarybtn  text-white  transition duration-300 ease-in-out rounded-lg  px-12 py-3 ml-4">Send</button>
              </div>
            </form>

          </div>
        </div>
      </div>
      <div className="w-1/2">
        <div className="bg-primaryBackground h-full flex flex-col justify-center items-center relative">
          <h5 className='text-2xl font-semibold mb-12'>Get your project up and running faster by directly inviting your team members</h5>
          <img src={companyimage} alt="logo" className="" />

        </div>

      </div>
    </div>

  )
}
export default InviteTeam;
