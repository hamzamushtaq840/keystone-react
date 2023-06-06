import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import logo from '../assets/Logo.png';
import searchicon from '../assets/searchicon.png';
import companyimage from '../assets/companyonboard.png';
import { CompanyDetails } from '../utils/schema';
import moment from 'moment-timezone';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { post } from "../services/api";
import { get } from "../services/api";

function CompanyInfo() {
  const [timezones, setTimezones] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [dotNumberError, setDotNumberError] = useState('');
  const [initialValues, setinitialValues] = useState({
    dot_number: "",
    companyname: "",
    address: "",
    country: "",
    city: "",
    zipcode: "",
    state: "",
    phonenumber: "",
    timezone: "1"
  })
  const navigate = useNavigate();
  useEffect(() => {
    FetchTimeZone();
  }, []);

  const FetchTimeZone = async () => {
    try {
      const response = await get(`/api/v1/timezones`);
      setTimezones(response.data);
    } catch (error) {
      console.error('Error fetching commodity data:', error);
    }
  }

  const handlePhoneChange = (value) => {
    handleChange({ target: { name: 'phonenumber', value } });
  };

  const handlePhoneBlur = () => {
    handleBlur({ target: { name: 'phonenumber' } });
  };
  const SearchDotNumber = async () => {
    const dot_number = document.getElementById('dot_number').value;

    // Validate the DOT number
    try {
      await CompanyDetails.validateAt('dot_number', { dot_number });
    } catch (error) {
      console.error('Validation error:', error.message);
      return;
    }
    try {
      const response = await axios.get(`https://mobile.fmcsa.dot.gov/qc/services/carriers/${dot_number}?webKey=6c771d2c3eb9245cfe8775fc0a17c1792a4cbb59&format=json`);

      if (response.data.content === null) {
        setDotNumberError("No record found");
      } else {
        setDotNumberError("");

        const { legalName, phyCountry, phyCity, phyZipcode, phyState, phyStreet } = response.data.content.carrier;
        console.log(legalName);

        resetForm({
          values: {
            ...initialValues,
            dot_number: values.dot_number,
            companyname: legalName,
            address: phyStreet,
            country: phyCountry,
            city: phyCity,
            zipcode: phyZipcode,
            state: phyState,
          },
        });

        console.log(initialValues);
      }
    }
    catch (error) {
      console.error('Error:', error);
    }
  }
  const customTheme = (theme) => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        primary25: 'lightblue',
        primary: 'deepskyblue',
      },
    };
  };
  const selectOptions = timezones.map((timezone) => ({
    value: timezone.id, // Use the timezone ID as the value
    label: `${timezone.name} (${timezone.abbreviation})`,
  }));
  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: initialValues,
    validationSchema: CompanyDetails,
    onSubmit: async (values) => {
      const data = {
        dot_number: values.dot_number,
        companyname: values.companyname,
        address: values.address,
        country: values.country,
        city: values.city,
        zipcode: values.zipcode,
        state: values.state,
        phonenumber: values.phonenumber,
        timezone: values.timezone
      };
      console.log(data)
      const userId = localStorage.getItem('userId');
      console.log(userId)
      const authToken = localStorage.getItem('authToken');
      console.log(userId, authToken)
      try {
        const response = await post(
          `/api/v1/users/${userId}/companies`,
          data,
          authToken
        );
        navigate('/invite');

      } catch (error) {
        console.error('Error:', error);
      }

    }
  })

  // Dot Number Search
  const handleDotNumberChange = (e) => {
    handleChange(e); // Call your existing handleChange function

    if (e.target.value.length >= 5) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  return (
    <div className='flex'>

      <div className="w-1/2">
        <div className="flex flex-col items-center justify-center h-screen relative">

          <img src={logo} alt="logo" className="ml-20 mt-10 absolute top-0 left-0" />

          <div className='flex flex-col items-center bg-primaryBackground p-8 signin_css shadow-onboardingShadow'>
            <h2 className="text-4xl font-bold mb-4 text-primarytext">Company Information</h2>
            <p className='mb-12 leading-4'>Please insert your company details</p>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <label for="dot_number" className='text-primarytext mb-2 font-medium'>DOT Number<span className='ml-1 text-gray-400 text-sm '>(Optional)</span></label>
              <div className={`dropdown-wrapper ${showDropdown ? 'show-dropdown' : ''}`}>
                <input
                  id="dot_number"
                  name="dot_number"
                  type="name"
                  value={values.dot_number}
                  onChange={handleDotNumberChange}
                  onBlur={handleBlur}
                  className="px-4 py-2 border border-gray-400 rounded h-12  btn_custom focus:ring-transparent w-full"
                />

                {showDropdown && (
                  <div className="dropdown-content">
                    <a
                      className='cursor-pointer'
                      onClick={SearchDotNumber}
                    >
                      Search {values.dot_number}
                    </a>
                  </div>
                )}
              </div>

              {errors.dot_number && touched.dot_number ? <span className='form-error text-red-500' >{errors.dot_number}</span> : null}
              {dotNumberError && <span className="form-error text-red-500">{dotNumberError}</span>}


              <label for="companyname" className='text-primarytext mb-2 mt-2 font-medium'>Company</label>
              <input
                id="companyname"
                name='companyname'
                type="name"
                placeholder="Enter Company Name"
                value={values.companyname}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2 border  border-gray-400 rounded h-12 btn_custom focus:ring-transparent"

              />
              {errors.companyname && touched.companyname ? <span className='form-error text-red-500' >{errors.companyname}</span> : null}

              <label for="address" className='text-primarytext mb-2 mt-2 font-medium'>Address</label>
              <input
                id="address"
                name='address'
                type="address"
                placeholder="Enter Address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2 border  border-gray-400 rounded h-12 btn_custom focus:ring-transparent"

              />
              {errors.address && touched.address ? <span className='form-error text-red-500' >{errors.address}</span> : null}
              <div className='flex'>
                <div className='flex flex-col'>
                  <label for="city" className='text-primarytext mb-2 mt-2 font-medium'>City</label>
                  <input
                    id="city"
                    name='city'
                    type="name"
                    placeholder="Enter City"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-4 py-2 border  border-gray-400 rounded h-12 mr-6 small_input focus:ring-transparent"

                  />
                  {errors.city && touched.city ? <span className='form-error text-red-500' >{errors.city}</span> : null}
                </div>
                <div className='flex flex-col'>

                  <label for="state" className='text-primarytext mb-2 mt-2 font-medium'>State</label>
                  <input
                    id="state"
                    name='state'
                    type="name"
                    placeholder="Enter State"
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-4 py-2 border  border-gray-400 rounded h-12 small_input focus:ring-transparent"

                  />
                  {errors.state && touched.state ? <span className='form-error text-red-500' >{errors.state}</span> : null}
                </div>

              </div>
              <div className='flex'>
                <div className='flex flex-col'>
                  <label for="zipcode" className='text-primarytext mb-2 mt-2 font-medium'>Zip Code</label>
                  <input
                    id="zipcode"
                    name='zipcode'
                    type="name"
                    placeholder="Enter Zip Code"
                    value={values.zipcode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-4 py-2 border  border-gray-400 rounded h-12 small_input mr-6 focus:ring-transparent"

                  />
                  {errors.zipcode && touched.zipcode ? <span className='form-error text-red-500' >{errors.zipcode}</span> : null}
                </div>
                <div className='flex flex-col'>
                  <label for="country" className='text-primarytext mb-2 mt-2 font-medium'>Country</label>
                  <input
                    id="country"
                    name='country'
                    type="name"
                    placeholder="Enter Country"
                    value={values.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="px-4 py-2 border  border-gray-400 rounded h-12 small_input  focus:ring-transparent"

                  />
                  {errors.country && touched.country ? <span className='form-error text-red-500' >{errors.country}</span> : null}
                </div>

              </div>
              <label for="phonenumber" className='text-primarytext mb-2 mt-2 font-medium'>Phone Number</label>
              <div className="phone-input-wrapper">
                {/* <span className="phone-input-prefix">+1</span> */}
                <PhoneInput
                  id="phonenumber"
                  name="phonenumber"
                  placeholder="Enter Number"
                  value={values.phonenumber}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  enableSearch
                  country="us"
                  inputClass="px-4 py-2 border-none rounded-r h-12 custom_input focus:ring-transparent"
                  containerClass="phone-input-container"
                  countriesOnly
                  countryCodeEditable={false}
                />
              </div>



              {errors.phonenumber && touched.phonenumber ? <span className='form-error text-red-500' >{errors.phonenumber}</span> : null}
              <label for="timezone" className='text-primarytext mb-2 mt-2 font-medium'>Time Zone</label>

              <Select
                id="timezone"
                name="timezone"
                placeholder="Select a timezone"
                options={selectOptions}
                value={selectOptions.find((option) => option.value === values.timezone)}
                onChange={(selectedOption) => setFieldValue('timezone', selectedOption.value)}
                onBlur={handleBlur}
                theme={customTheme}
                styles={{
                  option: (provided) => ({
                    ...provided,
                    backgroundColor: 'white',
                    color: 'black',
                    fontSize: '16px',
                    padding: '8px',
                  }),
                  control: (provided) => ({
                    ...provided,
                    height: '40px',
                  }),

                }}
              />

              {errors.timezone && touched.timezone ? <span className='form-error text-red-500' >{errors.timezone}</span> : null}

              <button type="submit" className="font-semibold mt-6 bg-primarybtn  text-white  transition duration-300 ease-in-out rounded-lg self-end px-12 py-3">Save</button>
            </form>


          </div>
        </div>
      </div>
      <div className="w-1/2">
        <div className="bg-primaryBackground h-full flex flex-col justify-center items-center relative">
          <h5 className='text-2xl font-semibold mb-12'>Welcome to keystone! to set up your account fill yours company details</h5>
          <img src={companyimage} alt="logo" className="" />

        </div>

      </div>
    </div>

  )
}
export default CompanyInfo;
