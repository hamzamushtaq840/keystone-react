import { useFormik } from 'formik';
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { SignInSchema } from '../utils/schema';
import logo from '../assets/Logo.png';
import Alert from '../components/Alert';
import { setEmail } from '../reducers/emailSlice';
import { setLoading } from '../reducers/loadingSlice';
import { login } from '../reducers/userSlice'; // Import the login action
import { post } from "../services/api";
import OnBoardingSlider from './../components/OnBoardingSlider';
import deliveryTruck from './../assets/gif/deliveryTruck.gif';


const initialValues = {
  email: "",
  password: ""
}
// const clientID = "675235851160-0k73mjp56b95cfqtql3hea3r8bss4046.apps.googleusercontent.com";

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loading);
  const [apiError, SetapiError] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

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
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);
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
    console.log(data)
    // Handle the Google Sign-In response (e.g., send the response to your API for authentication)
    saveUserData(data);
  };
  function saveToLocalStorage(id, token, firstname, lastname, companyname) {
    const expirationTime = new Date().getTime() + 3 * 60 * 60 * 1000; // Current time + 3 hours in milliseconds
    // const expirationTime = new Date().getTime() + 1 * 60 * 1000;
    localStorage.setItem('userId', id);
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiration', expirationTime);
    localStorage.setItem('firstname', firstname);
    localStorage.setItem('lastname', lastname);
    // localStorage.setItem('userCompany', companyname);
  }

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: SignInSchema,
    onSubmit: async (values) => {
      const data = {
        email: values.email,
        password: values.password
      };

      saveUserData(data);

    }
  })

  const saveUserData = async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await post('/api/v1/login', data);
      const token = response.data.token;
      const firstname = response.data.user.firstname;
      const lastname = response.data.user.lastname;
      const email = response.data.user.email;
      const companyname = response.data.company ? response.data.company.companyname : "here";
      saveToLocalStorage(token, firstname, lastname, companyname);

      const loginData = {
        user: {
          id: response.data.user.id,
          firstName: firstname,
          lastName: lastname,
          email: email
        },
        authToken: token,
      };
      console.log(loginData);
      dispatch(login(loginData));

      if (!response.data.company || response.data.company.companyname === null || response.status) {
        navigate('/companyonboard');
      } else {
        navigate('/invite');
      }
    } catch (error) {
      console.log("Error:", error);

      if (error.response && error.response.status === 500) {
        setAlert({ show: true, message: 'Invalid Credentials', type: 'fail' });
      } else if (error.response && error.response.status === 401) {
        dispatch(setEmail(values.email));
        navigate('/verify');
      }
    } finally {
      dispatch(setLoading(false)); // Set loading state to false regardless of whether the API call was successful or not
    }
  }

  return (

    <div className='flex'>
      <div className="w-1/2 tablet:w-full s-laptop:w-4/5 2xl:w-3/4 m-screen:w-4/6 lg-screen:w-1/2">
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
          <div className='flex flex-col signin_card  items-center p-8 signin_css shadow-onboardingShadow bg-primaryBackground  tablet:w-7/12   lg:w-4/5 lg-screen:w-7/12 s-laptop:w-4/6  xxl-screen:w-5/12 '>
            <h2 className="text-3xl font-bold mb-4 ">Login</h2>
            <p className='mb-8 leading-4 lg:mb-6 lg:text-base lg:text-center tablet:text-base' >Please enter your details</p>
            <form onSubmit={handleSubmit} className="flex flex-col w-full">
              <label for="email" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Enter your email ID</label>

              <input
                id="email"
                name='email'
                type="email"
                placeholder="Email"

                className="px-4 py-2  border-gray-400 rounded h-12  btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null}
              <label for="password" className='text-primarytext mb-2 mt-2 lg:mb-1 lg:text-base'> Password</label>
              <input
                id="password"
                name='password'
                type="password"
                placeholder="Password"

                className="px-4 py-2 border  border-gray-400 rounded h-12 btn_custom focus:ring-transparent lg:h-11 lg:text-base"

                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && touched.password ? <span className='form-error text-red-500' >{errors.password}</span> : null}
              <Link to="/forgotpassword" className='ml-auto mt-4 text-primarybtn font-medium leading-4 lg:text-base' >Forgot Password?</Link>
              <button type="submit" className="px-4 py-2 mt-6 bg-primarybtn  text-white  transition duration-300 ease-in-out rounded-lg font-medium lg:mt-4 lg:text-base ">{loading ? 'Loading...' : 'Login'}</button>
              <div className="flex items-center justify-center mt-5 mb-5 ">
                <hr className="border-t border-gray-300 flex-1 mr-1 line-width" />
                <span className="text-gray-500 font-medium mx-1 lg:text-base">OR</span>
                <hr className="border-t border-gray-300 flex-1 ml-1 line-width" />
              </div>
            </form>

            {/* <GoogleLogin 
  clientId={clientID}
  buttonText="Continue with Google"
  onSuccess={onSuccess}
  onFailure={onFailure}
  cookiePolicy={'single_host_origin'}
  isSignedIn={true}
  className="w-full justify-center google_btn "
/> */}
            <div id='signInDiv'></div>

            <div className='flex mt-8 lg:mt-4'>
              <p className='mr-2 lg:text-base'>Don’t have an account?</p>
              <Link to="/signup" className='text-primarytext font-bold lg:text-base'>Sign up</Link>
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

export default Signin;
