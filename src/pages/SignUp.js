import { useFormik } from 'formik';
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import { post } from "../services/api";
import { setEmail } from '../reducers/emailSlice';
import { login } from '../reducers/userSlice';
import { SignUpSchema } from '../utils/schema';
import deliveryTruck from './../assets/gif/deliveryTruck.gif';

const initialValues = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  password_confirmation: ""

}



function Signup() {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "675235851160-66cn8tgpnshencddslna5s54a5tnval5.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {
        theme: "outline",
        size: "large",
        width: "500",
      });

  }, []);

  const handleCredentialResponse = (response) => {
    console.log("Credential Response:", response);
    var userdata = jwt_decode(response.credential)
    console.log(userdata)
    const googleId = userdata.sub;
    const firstName = userdata.given_name;
    const lastName = userdata.family_name;
    const email = userdata.email;
    const data = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      google_id: googleId
    }

    // Handle the Google Sign-In response (e.g., send the response to your API for authentication)
    saveUserData(data);
  };


  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      const data = {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      };

      saveUserData(data);

    }
  })
  const saveUserData = async (data) => {

    try {
      // Update the API endpoint to use a relative path
      const response = await post('/api/v1/register', data);
      dispatch(setEmail(values.email));
      console.log(data.google_id, "here")
      if (!data.google_id) {
        navigate('/verify');
      }
      else {
        const loginData = {
          user: {
            id: response.data.user.id,
            firstName: data.firstname,
            lastName: data.lastname,
            email: data.email
          },
          authToken: response.data.token,
        };
        dispatch(login(loginData));
        navigate('/companyonboard');

      }
    } catch (error) {
      // console.log()
      setApiError(error.response.data.errors.email[0]);
      // Handle registration failure here
    }
  };

  return (
    <div className='flex'>
      <div className="w-1/2">
        <div className="flex flex-col items-center  h-screen s-laptop:justify-around m-screen:justify-center">
          <div>
            <img src={logo} alt="logo" className="ml-20 mt-10 absolute top-0 left-0" />
          </div>
          <div className='flex flex-col items-center signup_card bg-primaryBackground p-8 signin_css shadow-onboardingShadow s-laptop:w-3/5 xl-screen:w-5/12'>
            <h2 className="text-4xl font-bold mb-4 ">Sign up</h2>
            <p className='mb-8 leading-4'>Please enter your details:</p>
            <form onSubmit={handleSubmit} className="flex flex-col w-full">
              <label for="firstname" className='text-primarytext mb-2'>First name</label>

              <input
                id="firstname"
                name='firstname'
                type="name"
                placeholder="Enter Firstname"
                value={values.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2 border border-gray-400 rounded h-12  btn_custom focus:ring-transparent"
              />
              {errors.firstname && touched.firstname ? <span className='form-error text-red-500' >{errors.firstname}</span> : null}

              <label for="lastname" className='text-primarytext mb-2 mt-2'> Last name</label>
              <input
                id="lastname"
                name='lastname'
                type="name"
                placeholder="Enter Lastname"
                value={values.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2 border  border-gray-400 rounded h-12 btn_custom focus:ring-transparent"

              />
              {errors.lastname && touched.lastname ? <span className='form-error text-red-500' >{errors.lastname}</span> : null}

              <label for="email" className='text-primarytext mb-2 mt-2'>Enter your email</label>
              <input
                id="email"
                name='email'
                type="email"
                placeholder="Enter Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2 border  border-gray-400 rounded h-12 btn_custom focus:ring-transparent"

              />
              {errors.email && touched.email && !apiError ? (
                <span className='form-error text-red-500'>{errors.email}</span>
              ) : null}
              {apiError ? (
                <span className='form-error text-red-500'>{apiError}</span>
              ) : null}

              <label for="password" className='text-primarytext mb-2 mt-2'>Password</label>
              <input
                id="password"
                name='password'
                type="password"
                placeholder="Create a Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2 border  border-gray-400 rounded h-12 btn_custom focus:ring-transparent"

              />
              {errors.password && touched.password ? <span className='form-error text-red-500' >{errors.password}</span> : null}

              <label for="password_confirmation" className='text-primarytext mb-2 mt-2'>Confirm password</label>
              <input
                id="password_confirmation"
                name='password_confirmation'
                type="password"
                placeholder="Confirm Password"
                value={values.password_confirmation}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2 border  border-gray-400 rounded h-12 btn_custom focus:ring-transparent"

              />
              {errors.password_confirmation && touched.password_confirmation ? <span className='form-error text-red-500' >{errors.password_confirmation}</span> : null}

              <button type="submit" className="px-4 py-2 mt-6 bg-primarybtn  text-white  transition duration-300 ease-in-out rounded-lg font-medium">Register</button>
              <div className="flex items-center justify-center mt-5 mb-5 ">
                <hr className="border-t border-gray-300 flex-1 mr-1 line-width" />
                <span className="text-gray-500 font-medium mx-1">OR</span>
                <hr className="border-t border-gray-300 flex-1 ml-1 line-width" />
              </div>
            </form>

            {/* <GoogleLogin 
  clientId={clientID}
  buttonText="Continue with Google"
  cookiePolicy={'single_host_origin'}
  isSignedIn={true}
  onSuccess={onSuccess}
  onFailure={onFailure}
  className="w-full justify-center google_btn "
/> */}
            <div id='signInDiv'></div>
            <div className='flex mt-8'>
              <p className='mr-2'>Already have an account?</p>
              <Link to="/" className='text-primarytext font-bold'>Sign In</Link>
            </div>
          </div>

        </div>
      </div>
      <div className="flex justify-center flex-col gap-[64px] items-center w-1/2 lg:w-full lg-screen:w-1/2 bg-primaryBackground">
        <img src={deliveryTruck} className='h-[27.916666666666668vw] w-[28.333333333333332vw]' />
        <p className='text-2xl font-semibold w-[28.333333333333332vw] text-center'>Efficient, user-friendly, and Excellent Customer Support.</p>
      </div>
    </div>

  );
}

export default Signup;
