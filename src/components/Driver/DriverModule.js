import React, { useState } from 'react';
// import Dropdown from '../smallcomponents/Dropdown';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import arrowBack from './../../assets/arrow-back.png';
import { deleteRequest, get, post, put } from "../../services/api";
import StatusDropdown from "./../Dropdowns/CustomDropdown";
// import Alert from '../smallcomponents/Alert';s
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import moment from 'moment';
import { useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { useDropzone } from 'react-dropzone';
import { FilePond, registerPlugin } from 'react-filepond';
import PhoneInput from 'react-phone-input-2';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DriverValidation } from '../../utils/schema';
import DynamicTable from '../Table/DynamicTable';
import Alert from '../Alert';
import DeleteModal from './../Modals/DeleteModal';
import Modal from './../Modals/Modal';
import CustomDropdown from "./../Dropdowns/TruckDropdown";

import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { selectDriverData, selectDriverId } from '../../reducers/driverSlice';
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);



function AddTruck() {

  const CreateTitle = "Save"
  const MainTitle = "Add Driver"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [makeGroups, setmakeGroups] = useState([]);
  const [defaultRate, setdefaultRate] = useState([]);
  const [selectedCommodityGroup, setSelectedCommodityGroup] = useState('');
  const [selectedDefaultRate, setSelectedDefaultRate] = useState('');
  const [tableData, settableData] = useState([]);
  const [currentDocumentAction, setCurrentDocumentAction] = useState("add");
  const [fetchCommodity, setFetchCommodity] = useState("");
  const [fetchRate, setFetchRate] = useState("");
  const [searchQuery, setSearchQuery] = useState('');

  const [fetchStatus, setfetchStatus] = useState("");
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [updateid, setUpdateId] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [dob, setdob] = useState(new Date());
  const [driverDocuments, setDriverDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [table, setTable] = useState("document");
  const formatValue = (name) => name.toLowerCase().replace(' ', '_');
  const [data1, setData1] = useState([]);
  const [isdisabled, setisDisabled] = useState(true);
  const [driverID, setDriverID] = useState(true);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const driverDocumentsTable = ['Name', 'Exp Date', 'Attachments', 'Action'];
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const driverData = useSelector(selectDriverData);
  const driverRowID = useSelector(selectDriverId);

  const [profilePic, setProfilePic] = useState(null);
  const [driverAction, setDrvierAction] = useState("add")
  const [states, setStates] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const truckNumbers = trucks.map(truck => truck.number);
  const [initialValues, setInitialValues] = useState(
    {
      drivernumber: null,
      firstname: "",
      lastname: "",
      dob: null,  // date object for DatePicker
      active_status: "",
      fuelcardnumber: "",
      phonenumber: "",
      email: "",
      hiredate: "",  // you may want to change this to date object if you are using DatePicker
      address: "",
      // address2: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",  // added country
      pay_to: "",
      truck_id: "",
      trailer_id: "",
      licensenumber: "",
      license_state_id: "",
    });



  useEffect(() => {
    if (Object.keys(driverData).length != 0) {
      setDrvierAction("update")
      setisDisabled(false)
      setInitialValues({
        drivernumber: driverData.drivernumber || "",
        firstname: driverData.firstname || "",
        lastname: driverData.lastname || "",
        dob: driverData.dob ? moment(driverData.dob, "MM-DD-YYYY").toDate() : null, active_status: driverData.active_status || "",
        phonenumber: driverData.phonenumber || "",
        email: driverData.email || "",
        address: driverData.address || "",
        // address2:  driverData.address2 || "",
        truck_id: driverData.truck || "",
        trailer_id: driverData.trailer || "",
        hiredate: driverData.hiredate ? moment(driverData.hiredate, "MM-DD-YYYY").toDate() : null, fuelcardnumber: driverData.fuelcardnumber || "",
        city: driverData.city || "",
        state: driverData.state || "",
        zipcode: driverData.zipcode || "",
        country: values.country || driverData.country || "",
        licensenumber: driverData.licensenumber || "",
        license_state_id: driverData.license_state_id || "",
      });
    }
  }, [driverData]);
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    const file = acceptedFiles[0];

    // Create an object URL for the file
    const imageUrl = URL.createObjectURL(file);

    // Update state with the new image URL
    setProfilePic(imageUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


  const handleEditAction = (id) => {

    // Open the modal   
    setIsModalOpen(true);
    setUpdateId(id);
    setCurrentDocumentAction("update")
    FetchDataToEdit(id)
  };
  const FetchDataToEdit = async (id) => {
    const driver_id = driverRowID || driverID;
    try {
      const response = await get(`/api/v1/driver/${driver_id}/documents/${id}`,
        authToken);
      // setIsChecked(response);
      if (response.success) {
        setFieldValue('name', response.data.document.name);
        setFieldValue('exp_date', moment(response.data.document.validity_end_date, "MM-DD-YYYY").toDate());
      }

    } catch (error) {
      console.error('Error fetching commodity data:', error);
    }
  }

  // Delete Modal
  const openDeleteModal = (id) => {
    setIsDeleteModalOpen(true);
    setItemToDelete(id);
  };

  const handleDeleteAction = (id) => {
    openDeleteModal(id);
  };

  const handleDeleteConfirm = async () => {
    const id = driverRowID || driverID;

    try {
      const response = await deleteRequest(`https://phplaravel-980736-3436689.cloudwaysapps.com/api/v1/driver/${id}/documents/${itemToDelete}`,
        authToken);
      setAlert({ show: true, message: 'Driver Deleted Successfully!', type: 'success' });
      // fetchDriver(); // Re-fetch the list of commodities after deleting
      setIsDeleteModalOpen(false); // Close the delete modal
    } catch (error) {
      console.error('Error', error);
    }
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleTabClick = (value, typeId) => {
    if (value !== selectedTab) {
      setSelectedTab(value);
      setSelectedTypeId(typeId);
    }
  };
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);


  const authToken = localStorage.getItem('authToken');

  const statusOption = ["User", "Admin"];

  // Searchbar Functionality 
  //   const filteredData = tableData.filter((item) =>
  //   item.CommodityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   item.CommodityCode.toLowerCase().includes(searchQuery.toLowerCase())

  // );

  const handleSubmitDocuments = () => {



    // setIsModalOpen(false);
    // resetForm(initialValues);
    // Clear the form (if you want to)
    // setValues({ firstname: '', lastname: '' });

    // Clear the files (if you want to)
    setFiles([]);
  };

  const saveDocuments = async (typeId) => {
    // Get form data
    const { name, exp_date } = values;

    // Convert the files to Base64 format
    const base64Files = await Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }));
    const expiry_date = formatDate(exp_date);
    // Add the data and base64 files to the driverDocuments
    const newDoc = {
      typeId: selectedTypeId, // Use the stored typeId
      name: name,
      validity_end_date: expiry_date,
      file: base64Files,
    };
    const documents = JSON.stringify(newDoc);
    setDriverDocuments(prevDocs => [...prevDocs, newDoc]);
    const id = driverRowID || driverID;
    if (currentDocumentAction === "add") {
      try {
        // Use fetch to send the request. Adjust the headers and settings as needed
        const response = await post(`/api/v1/driver/${id}/documents`, documents, authToken);

        if (response.success) {
          console.log('Documents saved successfully.');
          setAlert({ show: true, message: 'Documents Added Successfully!', type: 'success' });

          fetchDocuments();
          setIsModalOpen(false);
          resetForm(initialValues);
        }

      } catch (error) {
        console.log('Error while saving documents:', error);
      }
    }
    else if (currentDocumentAction === "update") {
      try {
        // Use fetch to send the request. Adjust the headers and settings as needed
        const response = await put(`/api/v1/driver/${id}/documents/${updateid}`, documents, authToken);

        if (response.success) {
          setAlert({ show: true, message: 'Driver Updated Successfully!', type: 'success' });

          console.log('Documents saved successfully.');
          fetchDocuments();
          setIsModalOpen(false);
          resetForm(initialValues);
        }

      } catch (error) {
        console.log('Error while saving documents:', error);
      }
    }
  };

  const fetchDocuments = async () => {
    const id = driverRowID || driverID;
    try {
      const response = await get(`/api/v1/driver/${id}/documents`, authToken);
      if (response.success) {
        setDriverDocuments(response.data.documents.map(item => ({
          id: item.id,
          name: item.name,
          validaty_end_date: item.validity_end_date,
          Attachments: item.file_path,
          document_type_id: item.document_type_id  // This is important for filtering in `documenttabs` function
        })));
      }
    } catch (error) {
      console.log('Error while fetching documents:', error);
    }
  }



  const updateData = ({ states, trucks, trailers }) => {
    setStates(states);
    const truckNumbersAsString = trucks.map(number => number.toString());
    const trailerNumbersAsString = trailers.map(number => number.toString());

    setTrucks(truckNumbersAsString);
    setTrailers(trailerNumbersAsString);
  }

  const documenttabs = async () => {
    try {
      const response = await get('/api/v1/document-types', authToken);
      if (response.success) {
        updateData(response.data);
        const transformedData = response.data.document_types.map((doc, index) => {
          // Filter driverDocuments for the current document type
          const currentDriverDocuments = driverDocuments.filter(document => document.document_type_id === doc.id);

          return {
            id: doc.id, // Set the ID based on the index
            label: doc.name,
            value: formatValue(doc.name),
            desc: (
              <DynamicTable
                headers={driverDocumentsTable}
                data={currentDriverDocuments} // pass the filtered documents
                onEdit={handleEditAction}
                onDelete={handleDeleteAction}
                onChange={table}
              />
            ),
          };
        });
        console.log(transformedData, "Fahad here")
        setData1(transformedData); // Set the state variable
      }
    } catch (error) {
      console.log('Error while fetch types:', error);
    }
  };
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        // await fetchDocuments();
        await documenttabs();
      } catch (error) {
        console.log('Error while fetching tabs:', error);
      }
    };
    fetchTabs();
  }, [driverDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, []);
  useEffect(() => {
    console.log(trucks, "truckshere")
  }, [trucks]);
  useEffect(() => {
    documenttabs();
    fetchDocuments();
  }, [alert]);
  // useEffect(() => {
  //   fetchDocuments();
  // }, [driverID]);
  useEffect(() => {
    if (data1.length > 0) {
      setSelectedTab(data1[0].value); // Set the default tab value
      setSelectedTypeId(data1[0].id); // Set the default tab's id
    }
  }, [data1]);

  const formatDate = (date) => {
    if (!date) {
      return '';
    }
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }
  const useCustomFormik = (initialValues) => {
    const formik = useFormik({
      initialValues: initialValues,
      enableReinitialize: true,
      validationSchema: DriverValidation, // Make sure to import or define DriverValidation
      onSubmit: async (values, { resetForm }) => {
        const dobFormatted = formatDate(values.dob);
        const hireDateFormatted = formatDate(values.hiredate);

        const data = {
          drivernumber: values.drivernumber,
          firstname: values.firstname,
          lastname: values.lastname,
          dob: dobFormatted,
          active_status: values.active_status,
          phonenumber: values.phonenumber,
          email: values.email,
          address: values.address,
          // address2: values.address2,
          truck_id: values.truck_id,
          trailer_id: values.trailer_id,
          hiredate: hireDateFormatted,
          pay_to: values.pay_to,
          fuelcardnumber: values.fuelcardnumber,
          city: values.city,
          state: values.state,
          zipcode: values.zipcode,
          country: values.country,
          licensenumber: values.licensenumber,
          license_state_id: values.license_state_id,
        };
        console.log(data);

        if (driverAction === 'add') {
          try {
            const response = await post('/api/v1/driver', data, authToken);
            if (response.success) {
              setisDisabled(false);
              setDrvierAction("update");
              // resetForm();
              const driverId = response.data.driver.id; // Assuming the response contains the driver id.
              setDriverID(driverId);
            }
          } catch (error) {
            console.log(error);
          }
        } else if (driverAction === 'update') {
          const id = driverRowID || driverID;

          try {
            const response = await put(`/api/v1/driver/${id}`, data, authToken);
            if (response.success) {
              setisDisabled(false);
              // setDrvierAction("update");
              // resetForm();
              const driverId = response.data.driver.id; // Assuming the response contains the driver id.
              setDriverID(driverId);
            }
          } catch (error) {
            console.log(error);
          }
        }
      },
    });

    return formik;
  };


  const formik = useCustomFormik(initialValues, currentDocumentAction, updateid, authToken);
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
    setFieldTouched
  } = formik;



  const handleCheckboxChange = (e) => {
    const newCheckedValue = !isChecked;
    setIsChecked(newCheckedValue);
    setFieldValue('ifta_check', newCheckedValue);
  };


  // Documents Modal
  const openModal = () => {
    setIsModalOpen(true);
    setCurrentDocumentAction("add")
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm(initialValues);
  };

  const handlePhoneChange = (value) => {
    handleChange({ target: { name: 'phonenumber', value } });
  };

  const handlePhoneBlur = () => {
    handleBlur({ target: { name: 'phonenumber' } });
  };


  // Use an effect to log the state after it has updated
  // useEffect(() => {

  // }, [driverDocuments]);

  // const saveDocuments = async (event) => { 
  //   try {
  //     const response = await fetch('/driver/1/documents', {
  //       method: 'POST', // or 'PUT' if you're updating data
  //       body: formData, // The form data
  //     });

  //     const result = await response.json();

  //     // handle success
  //     console.log(result);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }


  return (

    <div className="main-content_css pl-8 pr-16">
      <div className="flex justify-between">
        <div className="flex flex-col mt-8 w-full">
          <Link to="/driver" className='flex w-full items-center mb-6'>
            <img src={arrowBack} />
            <p className="font-medium text-base leading-6  ">
              Back to driver
            </p>
          </Link>
          <h4 className=" font-medium text-3xl leading-8">
            New Driver
          </h4>

        </div>
        <div className="flex items-center mt-10">



        </div>
      </div>
      <hr className="mt-12" />

      <div className='mt-12'>
        <div className='flex justify-center'>
          <Alert
            show={alert.show}
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        </div>
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDeleteConfirm}
        />
        <div className='w-4/5 mx-auto mb-8'>
          <h5 className='text-2xl font-semibold'>{driverAction === "add" ? MainTitle : "Update Driver"}</h5>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 w-4/5 mx-auto">
          <div className="col-span-3 sm:col-span-1 mx-auto my-auto">
            <div {...getRootProps()} style={{
              height: '100px',
              width: '100px',
              borderRadius: '50%',
              border: '1px dashed #ddd',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              backgroundSize: 'cover',
              backgroundImage: `url(${profilePic})`,
              color: profilePic ? 'transparent' : 'black'
            }}>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop the files here ...</p> :
                  <p>Upload Image</p>
              }
            </div>
          </div>
          <div className="col-span-3 sm:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>First name</label>
              <input
                id="firstname"
                name='firstname'
                type="string"
                className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent  lg:text-base"
                value={values.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.firstname && touched.firstname ? <span className='text-red-500'>{errors.firstname}</span> : null}
            </div>

            <div>
              <label htmlFor="lastname" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Last name</label>
              <input
                id="lastname"
                name='lastname'
                type="string"
                className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent  lg:text-base"
                value={values.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.lastname && touched.lastname ? <span className='text-red-500'>{errors.lastname}</span> : null}
            </div>


            <div>
              <label htmlFor="dob" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Date of birth</label>
              <DatePicker
                id="dob"
                selected={values.dob}
                onChange={(date) => setFieldValue('dob', date)}
                dateFormat="MM/dd/yyyy"
                className="px-4 py-2 border border-gray-400 rounded h-12 modal_btn_custom focus:ring-transparent flex flex-col w-full"
              />


              {errors.dob && touched.dob ? <span className='text-red-500'>{errors.dob}</span> : null}
            </div>
            <div>
              <label htmlFor="active_status" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Status</label>
              <StatusDropdown
                id="active_status"
                name='active_status'
                value={values.active_status}
                onChange={(value) => formik.setFieldValue('active_status', value)} />

              {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
            </div>
            <div>
              <label htmlFor="drivernumber" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Driver number</label>
              <input
                id="drivernumber"
                name='drivernumber'
                type="string"
                className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent  lg:text-base"
                value={values.drivernumber}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.drivernumber && touched.drivernumber ? <span className='text-red-500'>{errors.drivernumber}</span> : null}
            </div>
            <div>
              <label htmlFor="fuelcardnumber" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Fuel Card Number</label>
              <input
                id="fuelcardnumber"
                name='fuelcardnumber'
                type="string"
                className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent  lg:text-base"
                value={values.fuelcardnumber}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.fuelcardnumber && touched.fuelcardnumber ? <span className='text-red-500'>{errors.fuelcardnumber}</span> : null}
            </div>
          </div>
          <div>
            <label htmlFor="phonenumber" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Phone</label>
            <PhoneInput
              id="phonenumber"
              name="phonenumber"
              placeholder="Enter Number"
              value={values.phonenumber}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              enableSearch
              country="us"
              inputClass="px-4 py-2 border-none rounded-r h-12 custom_input   focus:ring-transparent driver_phone "
              containerClass="phone-input-container"
              countriesOnly
              countryCodeEditable={false}
            />
            {errors.phonenumber && touched.phonenumber ? <span className='text-red-500'>{errors.phonenumber}</span> : null}
          </div>

          <div>
            <label htmlFor="email" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Email</label>
            <input
              id="email"
              name='email'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full important focus:ring-transparent  lg:text-base"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null}
          </div>
          <div>
            <label htmlFor="hiredate" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Hire Date</label>
            <DatePicker
              id="hiredate"
              selected={values.hiredate}
              onChange={(date) => setFieldValue('hiredate', date)}
              dateFormat="MM/dd/yyyy"
              className="px-4 py-2 border border-gray-400 rounded h-12 modal_btn_custom focus:ring-transparent flex flex-col w-full"
            />

            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="address" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Address Line 1</label>
            <input
              id="address"
              name='address'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent  lg:text-base"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.address && touched.address ? <span className='text-red-500'>{errors.address}</span> : null}
          </div>
          {/* <div>
        <label htmlFor="address2" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Address Line 2</label>
        <input 
            id="address2"
            name='address2'
            type="string" 
            className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent  lg:text-base"
            value={values.address2}
            onChange={handleChange}
            onBlur={handleBlur}
        />
        { errors.address2 && touched.address2 ? <span className='text-red-500'>{errors.address2}</span> : null}
    </div> */}
          <div>
            <label htmlFor="city" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>City</label>
            <input
              id="city"
              name='city'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent  lg:text-base"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.city && touched.city ? <span className='text-red-500'>{errors.city}</span> : null}
          </div>
          <div>
            <label htmlFor="state" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>State</label>
            <CustomDropdown
              id="state"
              name='state'
              values={Array.isArray(states) ? states : []}
              value={values.state}
              placeholder={"Select State"}

              onChange={(value) => {
                const selectedState = states.find((make) => make === value);
                if (selectedState) {
                  setFieldValue('state', selectedState);
                } else {
                  setFieldValue('state', '');
                }
              }}
            />
            {errors.state && touched.state ? <span className='text-red-500'>{errors.state}</span> : null}
          </div>
          <div>
            <label htmlFor="zipcode" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Zip</label>
            <input
              id="zipcode"
              name='zipcode'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent  lg:text-base"
              value={values.zipcode}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.zipcode && touched.zipcode ? <span className='text-red-500'>{errors.zipcode}</span> : null}
          </div>
          <div>
            <label htmlFor="country" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Country</label>
            <input
              id="country"
              name='country'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent  lg:text-base"
              value={values.country}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.country && touched.country ? <span className='text-red-500'>{errors.country}</span> : null}
          </div>
          <div>
            <label htmlFor="pay_to" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Pay to</label>
            <input
              id="pay_to"
              name='pay_to'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent  lg:text-base"
              value={values.pay_to}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.pay_to && touched.pay_to ? <span className='text-red-500'>{errors.pay_to}</span> : null}
          </div>
          <div>
            <label htmlFor="truck_id" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Truck</label>
            <CustomDropdown
              id="truck_id"
              name='truck_id'
              className='text-3xl'
              placeholder={"Select Truck"}

              values={Array.isArray(trucks) ? trucks : []}
              value={values.truck_id}
              onChange={(value) => {
                const selectedMake = trucks.find((number) => number === value);
                if (selectedMake) {
                  setFieldValue('truck_id', selectedMake);
                } else {
                  setFieldValue('truck_id', '');
                }
              }}
            />
            {errors.truck_id && touched.truck_id ? <span className='text-red-500'>{errors.truck_id}</span> : null}
          </div>
          <div>
            <label htmlFor="trailer_id" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Trailer</label>
            <CustomDropdown
              id="trailer_id"
              name='trailer_id'
              className='text-3xl'
              placeholder={"Select Trailer"}

              values={Array.isArray(trailers) ? trailers : []}
              value={values.trailer_id}
              onChange={(value) => {
                const selectedMake = trailers.find((number) => number === value);
                if (selectedMake) {
                  setFieldValue('trailer_id', selectedMake);
                } else {
                  setFieldValue('trailer_id', '');
                }
              }}
            />
            {errors.trailer_id && touched.trailer_id ? <span className='text-red-500'>{errors.trailer_id}</span> : null}
          </div>
          <div>
            <label htmlFor="licensenumber" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Driver license number</label>
            <input
              id="licensenumber"
              name='licensenumber'
              type="text"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent  lg:text-base"
              value={values.licensenumber}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.licensenumber && touched.licensenumber ? <span className='text-red-500'>{errors.licensenumber}</span> : null}
          </div>
          <div>
            <label htmlFor="license_state_id" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Driver license state</label>
            <CustomDropdown
              id="license_state_id"
              name='license_state_id'
              values={Array.isArray(states) ? states : []}
              value={values.license_state_id}
              placeholder={"Select State"}

              onChange={(value) => {
                const selectedState = states.find((make) => make === value);
                if (selectedState) {
                  setFieldValue('license_state_id', selectedState);
                } else {
                  setFieldValue('license_state_id', '');
                }
              }}
            />
            {errors.license_state_id && touched.license_state_id ? <span className='text-red-500'>{errors.license_state_id}</span> : null}
          </div>

          <div
            onClick={handleCheckboxChange}
            className="flex items-center cursor-pointer mt-5"
          >
            <input
              type="checkbox"
              id="ifta_check"
              className="form-checkbox text-custom-gray h-4 w-4 rounded "
              checked={isChecked}
              value={isChecked}

              readOnly
            />
            <label htmlFor="active_status" className="ml-2 text-zinc-600">
              IFTA handled by company
            </label>
          </div>






          {/* <button type="submit" className="font-semibold mt-6 bg-primarybtn  text-white  transition duration-300 ease-in-out rounded-lg  px-12 py-3 ml-4">Save</button> */}
          <div>
            <button type='submit' className="font-semibold mt-6 bg-primarybtn  text-white  transition duration-300 ease-in-out rounded-lg  px-12 py-3 ml-4 w-3/12 float-right" >{driverAction === "add" ? CreateTitle : "Update"}</button>
          </div>
        </form>
        <hr className="mt-12" />
        <div className={isdisabled ? "disabled" : ""}>
          <div className='mx-auto mb-8 mt-4 flex justify-between items-baseline'>
            <h5 className='text-2xl font-semibold'>Documents</h5>

            <div className=''>

              <button onClick={openModal} className="font-semibold mt-6 bg-primarybtn  text-white  transition duration-300 ease-in-out rounded-lg  px-12 py-3 ml-4">Add</button>
            </div>

          </div>
          <Tabs value="driver_license" className="driver_tabs">
            <TabsHeader>
              {data1.map(({ label, value, id }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => handleTabClick(value, id)}
                  className={selectedTab === value ? 'selected-tab' : ''}
                >
                  {label}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              {data1.map(({ value, desc }) => (
                <TabPanel key={value} value={value}>
                  {desc}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>


          <Modal isOpen={isModalOpen} onClose={closeModal} >
            <div className='mb-16'>
              <h5 className='text-2xl font-semibold text-center'>Upload Documents</h5>
            </div>
            <form >

              <div className='flex justify-center'>
                <div>
                  <label htmlFor="name" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Name</label>
                  <input
                    id="name"
                    name='name'
                    type="string"
                    className="px-4 py-2 border-gray-400 rounded h-12 btn_custom focus:ring-transparent  lg:text-base w-11/12"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label htmlFor="exp_date" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Expiry Date</label>
                  <DatePicker
                    id="exp_date"
                    selected={values.exp_date}
                    onChange={(date) => setFieldValue('exp_date', date)}
                    dateFormat="MM/dd/yyyy"
                    className="px-4 py-2 border border-gray-400 rounded h-12 modal_btn_custom focus:ring-transparent flex flex-col w-full"
                  />
                </div>
              </div>

              <div className='mt-6'>
                <FilePond
                  allowMultiple={true}
                  onupdatefiles={fileItems => {
                    // Set current file objects to this.state
                    setFiles(fileItems.map(fileItem => fileItem.file));
                  }}
                  onprocessfile={(error, file) => {
                    if (error) {
                      console.error('File processing failed: ', error);
                    } else {
                      console.log('File processed: ', file);
                      // You can now send the file to your server manually
                    }
                  }}
                />
              </div>

              <div className='flex justify-center mt-12'>
                <button
                  className="text-black py-4 px-8 rounded-lg leading-4 border border-gray-400 mr-2"
                  onClick={closeModal}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={saveDocuments}
                  className="text-white py-4 px-8 rounded-lg leading-4 btn_css ml-2"
                  type="button"

                >
                  Save</button>

              </div>
            </form>

          </Modal>
          <div className='float-right mt-6 mb-14'>

          </div>
        </div>


      </div>
    </div>
  );
}

export default AddTruck;