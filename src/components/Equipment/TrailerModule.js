import React, { useState } from 'react';

import { useFormik } from 'formik';
import { useEffect } from 'react';
import arrowBack from './../../assets/arrow-back.png';
import { get, post } from "../../services/api";
import StatusDropdown from "./../Dropdowns/CustomDropdown";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../Alert';
import CustomDropdown from "./../Dropdowns/TruckDropdown";
import { clearEquipmentData, selectEquipmentData, selectEquipmentId } from '../../reducers/equipmentSlice';
import { TrailerValidation } from '../../utils/schema';

function AddTruck() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(
    {
      number: "",
      model: "",
      make: "",
      trailer_type: "",
      // type: "truck",
      status: "",
      vehicle_number: "",
      license: "",
      state: "",
      length: "",
      height: "",
      width: "",
      number_of_axles: "",
      unloaded_weight: "",
      irp_registered: "",
      irp_account_number: "",
      ifta_registered: "",
      ifta_account_number: "",
      puc_oregon: "",
      combine_weight: "",
      net_weight: "",
      fuel_interface: "",
      edi_equipment: "",
      notes: ""

    });

  const equipmentData = useSelector(selectEquipmentData);
  const equipmentId = useSelector(selectEquipmentId);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [makeGroups, setmakeGroups] = useState([]);
  const [trailerType, setTrailerType] = useState([]);

  const [defaultRate, setdefaultRate] = useState([]);
  const [selectedCommodityGroup, setSelectedCommodityGroup] = useState('');
  const [selectedDefaultRate, setSelectedDefaultRate] = useState('');
  const [tableData, settableData] = useState([]);
  const [currentAction, setCurrentAction] = useState("Add");
  const [fetchCommodity, setFetchCommodity] = useState("");
  const [fetchRate, setFetchRate] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [apiError, setApiError] = useState(null);

  const [fetchStatus, setfetchStatus] = useState("");
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [updateid, setUpdateId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('trailer');
  const truckHeaders = ['Truck Number', 'Truck Type', 'Status', 'Number of Axles', 'License Plate Number', 'License Plate State', 'IRP Registered', 'Action'];
  const trailerHeaders = ['Trailer Number', 'Trailer Type', 'Trailer ID number', 'Status', 'Number of Axles', 'License Plate Number', 'License Plate State', 'Generator information', 'Door Style', 'Action'];

  const truckMaintenance = ['Commodity Code / GL Revenue Code', 'Commodity Name', 'Commodity Group', 'Default Rate by', 'Commodity Status', 'Action'];


  const handleEditAction = (id) => {

    // Open the modal   
    setIsModalOpen(true);
    setUpdateId(id);
    setCurrentAction("")

  };


  const handleDeleteAction = (id) => {
    console.log(id)
    // Open the modal
    // setIsModalOpen(true);
    // setCurrentAction("")
    // FetchDataToEdit(id);
  };

  const handleTabClick = (tabValue) => {
    setSelectedTab(tabValue);
  };


  const handleNumberChange = (event) => {
    // Clear the API error when the input value changes
    setApiError('');

    // Call the handleChange function provided by Formik
    handleChange(event);
  };


  const options = ["Truck", "Trailer"];
  const makeOptions = ["Truck", "Trailer"];


  const CreateTitle = "Add new commodities"
  const data = [
    { CommodityCode: 'SH1234', CommodityName: 'Couch', CommodityGroup: 'Furniture', DefaultRateby: 'Flat Amount', CommodityStatus: 'Active' },
    { CommodityCode: 'SH1234', CommodityName: 'Couch', CommodityGroup: 'Furniture', DefaultRateby: 'Flat Amount', CommodityStatus: 'Inactive' },
    { CommodityCode: 'SH1234', CommodityName: 'Couch', CommodityGroup: 'Furniture', DefaultRateby: 'Flat Amount', CommodityStatus: 'Active' },

  ];

  useEffect(() => {
    if (equipmentData) {
      console.log(equipmentData.model, "check here")
      setInitialValues({
        number: equipmentData.number || "",
        model: equipmentData.model || "",
        make: equipmentData.make || "",
        trailer_type: equipmentData.type || "",
        status: equipmentData.status || "",
        vehicle_number: equipmentData.vehicle_number || "",
        license: equipmentData.license || "",
        state: equipmentData.state || "",
        length: equipmentData.length || "",
        height: equipmentData.height || "",
        width: equipmentData.width || "",
        number_of_axles: equipmentData.number_of_axles || "",
        unloaded_weight: equipmentData.unloaded_weight || "",
        door_style: equipmentData.door_style || "",
        generator_information: equipmentData.generator_information || "",
        laden_weight: equipmentData.laden_weight || "",
        notes: equipmentData.notes || "",
      });
    }
  }, [equipmentData]);

  const authToken = localStorage.getItem('authToken');

  const statusOption = ["User", "Admin"];

  // Searchbar Functionality 
  const filteredData = tableData.filter((item) =>
    item.CommodityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.CommodityCode.toLowerCase().includes(searchQuery.toLowerCase())

  );
  // Clear the redux store
  useEffect(() => {
    // Clear the store when the component unmounts
    return () => {
      dispatch(clearEquipmentData());
    };
  }, [dispatch]);



  const useCustomFormik = (initialValues) => {
    const formik = useFormik({
      initialValues: initialValues,
      enableReinitialize: true,
      validationSchema: TrailerValidation,

      onSubmit: async (values, { resetForm }) => {
        const data = {
          id: null || equipmentId,
          number: values.number,
          model: values.model,
          make: values.make,
          trailer_type: values.trailer_type,
          type: "trailer",
          status: values.status,
          vehicle_number: values.vehicle_number,
          license: values.license,
          state: values.state,
          length: values.length,
          height: values.height,
          width: values.width,
          number_of_axles: values.number_of_axles,
          unloaded_weight: values.unloaded_weight,
          combine_weight: values.combine_weight,
          door_style: values.door_style,
          laden_weight: values.laden_weight,
          generator_information: values.generator_information,
          notes: values.notes
        };
        console.log(data);
        if (Object.keys(equipmentData).length === 0) {

          try {
            const response = await post('/api/v1/equipment/store', data, authToken);
            if (response.success) {
              setAlert({ show: true, message: 'Equipment Added Successfully!', type: 'success' });
              navigate('/equipment')
              setIsModalOpen(false);

              resetForm();
            }
          } catch (error) {
            if (error.response.data.errors.number) {
              console.log("here")
              const numberErrors = error.response.data.errors.number;
              setApiError(numberErrors.join('. '));
            }
          }
        }
        else {
          try {
            const response = await post(`/api/v1/equipment/update/${equipmentId}`, data, authToken);
            if (response.success) { // Check for a specific status code
              setAlert({ show: true, message: 'Equipment Updated Successfully!', type: 'success' });
              navigate('/equipment')
              resetForm();
            }
          } catch (error) {
            console.error('Error updating the commodity:', error);
          }
        }

      },
    });

    return formik;
  };

  const formik = useCustomFormik(initialValues, currentAction, updateid, authToken);
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

  const fetchMakeData = async () => {
    try {
      const response = await get('/api/v1/equipment/create/trailer',
        authToken);
      //   if (Array.isArray(response.data)) {
      setmakeGroups(response.data.makes);
      setTrailerType(response.data.types)
      console.log(response.data.makes)
      //   }
    } catch (error) {
      console.error('Error fetching commodity groups:', error);
    }
  };
  const PostMakeData = async (data) => {

    const commoditydata = { name: data };
    try {
      const response = await post('/api/v1/commodity-groups', commoditydata,
        authToken);
      // setFieldValue('commodity_group_id', null);
      fetchMakeData();

      //   setCommodityGroups(response.data);
    } catch (error) {
      console.error('Error fetching commodity groups:', error);
    }
  };
  useEffect(() => {
    fetchMakeData();
    //   fetchdefaultRateBy();

  }, []);

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
    <div className="main-content_css pl-8 pr-16">
      <div className="flex justify-between">
        <div className="flex flex-col mt-8 w-full">
          <Link to="/equipment" className='flex w-full items-center mb-6'>
            <img src={arrowBack} />
            <p className="font-medium text-base leading-6  ">
              Back to Equipment
            </p>
          </Link>
          <h4 className=" font-medium text-3xl leading-8">
            Add Equipment
          </h4>

        </div>
        <div className="flex items-center mt-10">



        </div>
      </div>
      <hr className="mt-12" />

      <div className='mt-12'>
        <Alert
          show={alert.show}
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
        />

        <div className='w-4/5 mx-auto mb-8'>
          <h5 className='text-2xl font-semibold'>Add Trailer</h5>
        </div>
        <form className="grid grid-cols-3 gap-4 w-4/5 mx-auto">
          <div>
            <label htmlFor="number" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Trailer Number</label>
            <input
              id="number"
              name='number'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.number}
              onChange={handleNumberChange}
              onBlur={handleBlur}
            />
            {errors.number && touched.number && !apiError ? (
              <span className='form-error text-red-500'>{errors.number}</span>
            ) : null}
            {apiError ? (
              <span className='form-error text-red-500'>{apiError}</span>
            ) : null}
          </div>
          <div>
            <label htmlFor="model" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Model Year</label>
            <select
              id="model"
              name='model'
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              defaultValue={values.model || equipmentData.model}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="" disabled>Select year</option>
              {Array.from({ length: 2024 - 1970 + 1 }, (_, index) => 1970 + index).map(year => (
                <option value={year} key={year}>{year}</option>
              ))}
            </select>
            {errors.model && touched.model ? <span className='text-red-500'>{errors.model}</span> : null}
          </div>
          <div>
            <label htmlFor="make" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Manufacturer</label>
            <CustomDropdown
              id="make"
              name='make'
              values={Array.isArray(makeGroups) ? makeGroups : []}
              placeholder={"Select Manufacturer"}
              value={values.make}
              onChange={(value) => {
                const selectedMake = makeGroups.find((make) => make === value);
                if (selectedMake) {
                  setFieldValue('make', selectedMake);
                } else {
                  setFieldValue('make', '');
                }
              }}
              onAddMore={(value) => {
                // PostMakeData(value);
                setmakeGroups((prevMakeGroups) => [...prevMakeGroups, value]);
                setFieldValue('make', value);
              }}
              onFetchedCommodity={fetchCommodity}
              allowAddNew={true}
            />


            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="trailer_type" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Trailer Type</label>
            <CustomDropdown
              id="trailer_type"
              name='trailer_type'
              values={Array.isArray(trailerType) ? trailerType : []}
              placeholder={"Select Trailer Type"}
              value={values.trailer_type}
              onChange={(value) => {
                const selectedMake = trailerType.find((trailer_type) => trailer_type === value);
                if (selectedMake) {
                  setFieldValue('trailer_type', selectedMake);
                } else {
                  setFieldValue('trailer_type', '');
                }
              }}
            />

            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="Status" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Status</label>
            <StatusDropdown
              id="status"
              name='status'
              value={values.status}
              onChange={(value) => formik.setFieldValue('status', value)} />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>

          <div>
            <label htmlFor="vehicle_number" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Trailer ID Number</label>
            <input
              id="vehicle_number"
              name='vehicle_number'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.vehicle_number}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.vehicle_number && touched.vehicle_number ? <span className='text-red-500'>{errors.vehicle_number}</span> : null}
          </div>
          <div>
            <label htmlFor="license" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>License Plate</label>
            <input
              id="license"
              name='license'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.license}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="state" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>License Plate State/Province</label>
            <input
              id="state"
              name='state'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.state}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="length" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Length</label>
            <input
              id="length"
              name='length'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.length}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.length && touched.length ? <span className='text-red-500'>{errors.length}</span> : null}
          </div>
          <div>
            <label htmlFor="height" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Height</label>
            <input
              id="height"
              name='height'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.height}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.height && touched.height ? <span className='text-red-500'>{errors.height}</span> : null}
          </div>
          <div>
            <label htmlFor="width" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Width</label>
            <input
              id="width"
              name='width'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.width}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.width && touched.width ? <span className='text-red-500'>{errors.width}</span> : null}
          </div>
          <div>
            <label htmlFor="number_of_axles" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Number of Axles</label>
            <input
              id="number_of_axles"
              name='number_of_axles'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.number_of_axles}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.number_of_axles && touched.number_of_axles ? <span className='text-red-500'>{errors.number_of_axles}</span> : null}
          </div>
          <div>
            <label htmlFor="unloaded_weight" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Unloaded Trailer weight</label>
            <input
              id="unloaded_weight"
              name='unloaded_weight'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.unloaded_weight}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.unloaded_weight && touched.unloaded_weight ? <span className='text-red-500'>{errors.unloaded_weight}</span> : null}
          </div>
          <div>
            <label htmlFor="door_style" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Door Styles</label>
            <input
              id="door_style"
              name='door_style'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.door_style}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="generator_information" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Generator Information</label>
            <input
              id="generator_information"
              name='generator_information'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.generator_information}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="laden_weight" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Laden Weight</label>
            <input
              id="laden_weight"
              name='laden_weight'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.laden_weight}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.laden_weight && touched.laden_weight ? <span className='text-red-500'>{errors.laden_weight}</span> : null}
          </div>

          <div>
            <label htmlFor="notes" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Notes</label>
            <input
              id="notes"
              name='notes'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom notes_input focus:ring-transparent lg:h-11 lg:text-base"
              value={values.notes}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          {/* <button type="submit" className="font-semibold mt-6 bg-primarybtn  text-white  transition duration-300 ease-in-out rounded-lg  px-12 py-3 ml-4">Save</button> */}


        </form>
        <div className='float-right mt-6 mb-14'>
          <Link to="/equipment" className="font-semibold mt-6 border-primarybtn border text-primarybtn transition duration-300 ease-in-out rounded-lg px-12 py-3 ml-4">Cancel</Link>

          {Object.keys(equipmentData).length === 0 ? (
            <button onClick={handleSubmit} className="font-semibold mt-6 bg-primarybtn text-white transition duration-300 ease-in-out rounded-lg px-12 py-3 ml-4">Save</button>
          ) : (
            <button onClick={handleSubmit} className="font-semibold mt-6 bg-primarybtn text-white transition duration-300 ease-in-out rounded-lg px-12 py-3 ml-4">Update</button>
          )}  </div>

        {/* <DynamicTable headers={truckMaintenance} data={filteredData} onEdit={handleEditAction} onDelete={handleDeleteAction} /> */}


      </div>
    </div>
  );
}

export default AddTruck;