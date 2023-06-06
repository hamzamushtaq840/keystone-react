import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { ResetPassword } from '../../utils/schema';
import logo from '../../assets/Logo.png';
import keyicon from '../../assets/Keyicon.png';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import arrowleft from '../../assets/ArrowLeft.png';
import { post } from "../../services/api";

const initialValues = {
    password: "",
    password_confirmation: ""
}
function SetNewPassword() {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    console.log(token)
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: ResetPassword,
        onSubmit: async (values) => {
            const data = {
                email: email,
                password: values.password,
                password_confirmation: values.password_confirmation
            };
            console.log(data)
            console.log(token)

            try {
                const response = await post(`/api/v1/password/reset/${token}`, data, null);
                navigate('/passwordchanged');

            } catch (error) {
                console.log(error)
            }

        }
    })
    return (

        <div>
            <div className="flex flex-col items-center justify-center  relative">

                <img src={logo} alt="logo" className="ml-20 mt-10 absolute top-0 left-0" />
                <div className='flex flex-col items-center  mt-64 bg-primaryBackground p-8 w-3/12 verification_card shadow-onboardingShadow'>
                    <img src={keyicon} alt="logo" className="mb-12" />

                    <h2 className="text-2xl font-bold mb-4 ">Set new password</h2>

                    <p className='text-center'> Your new password must be different to previously used passwords</p>
                    <form onSubmit={handleSubmit} className="flex flex-col mt-8 w-auto">

                        <label for="password" className='text-primarytext mb-2'>Password</label>

                        <input
                            id="password"
                            name='password'
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="New password"
                            className="px-4 py-2 border border-gray-400 rounded h-12  btn_custom focus:ring-transparent"
                        />
                        {errors.password && touched.password ? <span className='text-red-500'>{errors.password}</span> : null}

                        <label for="password_confirmation" className='text-primarytext mb-2 mt-6'>Confirm Password</label>

                        <input
                            id="password_confirmation"
                            name='password_confirmation'
                            type="password"
                            value={values.password_confirmation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Confirm new password"
                            className="px-4 py-2 border border-gray-400 rounded h-12  btn_custom focus:ring-transparent"
                        />
                        {errors.password_confirmation && touched.password_confirmation ? <span className='text-red-500'>{errors.password_confirmation}</span> : null}

                        <button type="submit" className="px-4 py-2 mt-6 bg-primarybtn  text-white  transition duration-300 ease-in-out rounded-lg font-bold">Save</button>
                    </form>
                    <div className='flex mt-6'>
                        <img src={arrowleft} alt="logo" className="mr-5" />
                        <Link to="/" className=' font-medium  text-gray-500 '>Back to Log in</Link>
                    </div>
                </div>
            </div>
        </div>


    )
}
export default SetNewPassword;
