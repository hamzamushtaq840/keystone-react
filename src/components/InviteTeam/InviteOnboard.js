import axios from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPassword } from '../../utils/schema';
import logo from '../../assets/Logo.png';
import inviteicon from '../../assets/invitepassicon.svg';
// import { login  } from '../reducers/userSlice';
// import { useDispatch } from 'react-redux';

const initialValues = {
    password: "",
    password_confirmation: ""
}

function SetNewPassword() {
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const inviteID = urlParams.get('id');
    console.log(token, inviteID)
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: ResetPassword,
        onSubmit: async (values) => {
            const data = {
                password: values.password,
                password_confirmation: values.password_confirmation
            };
            console.log(data)
            try {
                const response = await axios.post(`https://phplaravel-980736-3436689.cloudwaysapps.com/api/v1/invitations/${inviteID}/${token}`, data);
                const { firstname, lastname } = response.data.data;
                // dispatch(login({
                //     user: {
                //       firstName: firstname,
                //       lastName: lastname
                //     },
                //     authToken: token
                //   }));
                navigate('/');

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
                    <img src={inviteicon} alt="logo" className="mb-12" />

                    <h2 className="text-2xl font-bold mb-4 ">Welcome</h2>

                    <p className='text-center text-gray-500'> Set up your password</p>
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

                </div>
            </div>
        </div>


    )
}
export default SetNewPassword;
