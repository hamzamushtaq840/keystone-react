import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { ForgotPassword } from '../../utils/schema';
import logo from '../../assets/Logo.png';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setForgotEmail } from '../../reducers/emailSlice';
const initialValues = {
    email: ""
}
function ForgetPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: ForgotPassword,
        onSubmit: async (values) => {
            const data = {
                email: values.email,
            };
            console.log(data)
            try {
                const response = await axios.post('https://phplaravel-980736-3436689.cloudwaysapps.com/api/v1/forgot-password', data);
                dispatch(setForgotEmail(values.email)); // Update the email state using Redux Toolkit

                navigate('/emailsent');
            } catch (error) {
                console.log(error)
            }

        }
    })
    return (

        <div>
            <div className="flex flex-col items-center justify-center  relative">

                <img src={logo} alt="logo" className="ml-20 mt-10 absolute top-0 left-0" />
                <div className='flex flex-col items-center  mt-64 bg-primaryBackground p-8 w-3/12  shadow-onboardingShadow'>

                    <h2 className="text-2xl font-bold mb-4 ">Forget Password</h2>

                    <p className='text-center'> Having trouble signing in? Please enter your email and we’ll send you a link to reset your password.</p>
                    <form onSubmit={handleSubmit} className="flex flex-col mt-8 xl-screen:w-4/5">

                        <label for="email" className='text-primarytext mb-2'>Enter your email ID</label>

                        <input
                            id="email"
                            name='email'
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Email"
                            className="px-4 py-2 border border-gray-400 rounded h-12  btn_custom focus:ring-transparent "
                        />
                        {errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null}

                        <button type="submit" className="px-4 py-2 mt-6 bg-primarybtn  text-white  transition duration-300 ease-in-out rounded-lg font-bold h-12">Reset Password</button>
                    </form>
                    <div className='flex mt-6'>
                        <p className='mr-2'>Want to Login instead?</p>
                        <Link to="/" className='text-primarytext font-bold'>Log in</Link>
                    </div>
                </div>
            </div>
        </div>


    )
}
export default ForgetPassword;
