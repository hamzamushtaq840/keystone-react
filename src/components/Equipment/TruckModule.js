import React, { useState } from 'react';
// import Dropdown from '../smallcomponents/Dropdown';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, post } from "../../services/api";
import arrowBack from './../../assets/arrow-back.png';
// import Alert from '../smallcomponents/Alert';s
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate } from 'react-router-dom';
import { clearEquipmentData, selectEquipmentData, selectEquipmentId } from '../../reducers/equipmentSlice';
import { TruckValidation } from '../../utils/schema';
import StatusDropdown from "./../Dropdowns/CustomDropdown";
import CustomDropdown from "./../Dropdowns/TruckDropdown";

function AddTruck() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(
    {
      number: "",
      model: "",
      make: "",
      truck_type: "",
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
      ifta_account: "",
      puc_oregon: "",
      combine_weight: "",
      net_weight: "",
      fuel_interface: "",
      edi_equipment: "",
      notes: ""

    });


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [makeGroups, setmakeGroups] = useState([]);
  const [truckType, setTruckType] = useState([]);

  const [states, setStates] = useState([]);

  const [defaultRate, setdefaultRate] = useState([]);
  const [selectedCommodityGroup, setSelectedCommodityGroup] = useState('');
  const [selectedDefaultRate, setSelectedDefaultRate] = useState('');
  const [tableData, settableData] = useState([]);
  const [currentAction, setCurrentAction] = useState("Add");
  const [fetchCommodity, setFetchCommodity] = useState("");
  const [fetchRate, setFetchRate] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [table, setTable] = useState("truckMaintenance");

  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [maintenanceTable, setmaintenanceTable] = useState([]);

  const [fetchStatus, setfetchStatus] = useState("");
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [updateid, setUpdateId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('truck');

  const truckMaintenance = ['Date', 'Mileage', 'Maintenence Type', 'Maintenence Performed By', 'Maintenance Performed', 'Location', 'Bill to', 'Amount', 'Action'];
  const [apiError, setApiError] = useState(null);

  const equipmentData = useSelector(selectEquipmentData);
  const equipmentId = useSelector(selectEquipmentId);
  useEffect(() => {
    console.log(Object.keys(equipmentData).length);
    console.log(equipmentData, "data")
    initialValues.number = equipmentData.number
  }, []);


  // Clear the redux store
  useEffect(() => {
    // Clear the store when the component unmounts
    return () => {
      dispatch(clearEquipmentData());
    };
  }, [dispatch]);

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



  const options = ["Active", "Inactive"];


  useEffect(() => {
    if (equipmentData) {
      console.log(equipmentData, "Fahad Check here")
      setInitialValues({
        number: equipmentData.number || "",
        model: equipmentData.model || "",
        make: equipmentData.make || "",
        truck_type: equipmentData.type || "",
        status: equipmentData.status || "",
        vehicle_number: equipmentData.vehicle_number || "",
        license: equipmentData.license || "",
        state: equipmentData.state || "",
        length: equipmentData.length || "",
        height: equipmentData.height || "",
        width: equipmentData.width || "",
        number_of_axles: equipmentData.number_of_axles || "",
        unloaded_weight: equipmentData.unloaded_weight || "",
        irp_registered: equipmentData.irp_registered || "",
        irp_account_number: equipmentData.irp_account || "",
        ifta_registered: equipmentData.ifta_registered || "",
        ifta_account_number: equipmentData.ifta_account || "",
        puc_oregon: values.puc_oregon || equipmentData.puc_oregon || "",
        combine_weight: equipmentData.combine_weight || "",
        net_weight: equipmentData.net_weight || "",
        fuel_interface: equipmentData.fuel_interface || "",
        edi_equipment: equipmentData.edi_equipment || "",
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

  const handleNumberChange = (event) => {
    // Clear the API error when the input value changes
    setApiError('');

    // Call the handleChange function provided by Formik
    handleChange(event);
  };


  const useCustomFormik = (initialValues) => {
    const formik = useFormik({
      initialValues: initialValues,
      enableReinitialize: true,
      validationSchema: TruckValidation,

      onSubmit: async (values, { resetForm }) => {
        const data = {
          id: null || equipmentId,
          number: values.number,
          model: values.model,
          make: values.make,
          truck_type: values.truck_type,
          type: "truck",
          status: values.status,
          vehicle_number: values.vehicle_number,
          license: values.license,
          state: values.state,
          length: values.length,
          height: values.height,
          width: values.width,
          number_of_axles: values.number_of_axles,
          unloaded_weight: values.unloaded_weight,
          irp_registered: values.irp_registered,
          irp_account_number: values.irp_account_number,
          ifta_registered: values.ifta_registered,
          ifta_account_number: values.ifta_account_number,
          puc_oregon: values.puc_oregon,
          combine_weight: values.combine_weight,
          net_weight: values.net_weight,
          fuel_interface: values.fuel_interface,
          edi_equipment: values.edi_equipment,
          notes: values.notes,
          // maintenance: maintenanceRecords
        };
        console.log(data)
        if (Object.keys(equipmentData).length === 0) {
          try {
            const response = await post('/api/v1/equipment/store', data, authToken);
            if (response.success) {
              setAlert({ show: true, message: 'Equipment Added Successfully!', type: 'success' });
              navigate('/equipment')
              resetForm();
            }
          } catch (error) {
            // console.log(error.response.data.errors.number, "fahad");
            if (error.response.data.errors.number) {
              console.log("here")
              const numberErrors = error.response.data.errors.number;
              setApiError(numberErrors.join('. '));
            }
          }
        } else {
          try {
            const response = await post(`/api/v1/equipment/update/${equipmentId}`, data, authToken);
            if (response.success) { // Check for a specific status code
              setAlert({ show: true, message: 'Equipment Updated Successfully!', type: 'success' });
              navigate('/equipment')

              // setIsModalOpen(false);
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
      const response = await get('/api/v1/equipment/create/truck',
        authToken);
      //   if (Array.isArray(response.data)) {
      setmakeGroups(response.data.makes);
      setTruckType(response.data.types);

      setStates(response.data.states)
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
        setFieldValue("statusType", "");
      } else {
        setFieldValue("statusType", option);
      }
    };

    return <CustomDropdown {...props} selectedValue={values.status} onOptionClick={onOptionClick} />;
  };
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm(initialValues);

  };

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentAction("Add")
  };
  useEffect(() => {
    console.log(maintenanceTable, "here")
  }, [maintenanceRecords]);

  // const setDataToMaintenanceTable = () => {
  //   console.log("here")

  // }
  const formatDate = (date) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    return formatter.format(date);
  };
  const handleMaintenance = (event) => {
    event.preventDefault();

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    // Create an object from the form values
    const newRecord = {
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      start_time: values.start_time,
      end_time: values.end_time,
      maintenance_type: values.maintenance_type,
      performed_by: values.performed_by,
      maintenance_performed: values.maintenance_performed,
      location: values.location,
      bill_to: values.bill_to,
      amount: values.amount,
      mileage: values.mileage
    };

    // Add the new record to the maintenanceRecords array
    setMaintenanceRecords([...maintenanceRecords, newRecord]);
    console.log(maintenanceRecords);

    // Update the maintenanceTable state by appending the new record
    setmaintenanceTable([
      ...maintenanceTable,
      {
        Date: newRecord.start_date,
        Mileage: newRecord.mileage,
        MaintenanceType: newRecord.maintenance_type,
        MaintenancePerformedBy: newRecord.performed_by,
        MaintenancePerformed: newRecord.maintenance_performed,
        Location: newRecord.location,
        Billto: newRecord.bill_to,
        Amount: newRecord.amount,
      },
    ]);

    // Reset the form values (if necessary)
    // resetForm(); // You'll need to implement this function in your code
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
        {/* <Alert
        show={alert.show}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, show: false })}
      /> */}

        <div className='w-4/5 mx-auto mb-8'>
          <h5 className='text-2xl font-semibold'>Add Truck</h5>
        </div>
        <form className="grid grid-cols-3 gap-4 w-4/5 mx-auto">
          <div>
            <label htmlFor="number" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Truck Number</label>
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
            <label htmlFor="model" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Model Number</label>
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
                console.log('values.make after setFieldValue: ', values.make);
              }}
              // onFetchedCommodity={fetchCommodity}
              allowAddNew={true}
            />



            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="truck_type" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Truck Type</label>
            <CustomDropdown
              id="truck_type"
              name='truck_type'
              values={Array.isArray(truckType) ? truckType : []}
              placeholder={"Select Truck Type"}

              value={values.truck_type}
              onChange={(value) => {
                const selectedMake = truckType.find((truck_type) => truck_type === value);
                if (selectedMake) {
                  setFieldValue('truck_type', selectedMake);
                } else {
                  setFieldValue('truck_type', '');
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
            <label htmlFor="vehicle_number" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Truck ID Number</label>
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
            <label htmlFor="unloaded_weight" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Unloaded truck weight</label>
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
            <label htmlFor="irp_registered" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>IRP Registered?</label>
            <CustomDropdown
              id="irp_registered"
              name='irp_registered'
              values={Array.isArray(states) ? states : []}
              value={values.irp_registered}
              onChange={(value) => {
                const selectedState = states.find((make) => make === value);
                if (selectedState) {
                  setFieldValue('irp_registered', selectedState);
                } else {
                  setFieldValue('irp_registered', '');
                }
              }}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="irp_account_number" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>IRP account number</label>
            <input
              id="irp_account_number"
              name='irp_account_number'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.irp_account_number}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="ifta_registered" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>IFTA Registered?</label>
            <CustomDropdown
              id="ifta_registered"
              name='ifta_registered'
              values={Array.isArray(states) ? states : []}
              value={values.ifta_registered}
              onChange={(value) => {
                const selectedState = states.find((make) => make === value);
                if (selectedState) {
                  setFieldValue('ifta_registered', selectedState);
                } else {
                  setFieldValue('ifta_registered', '');
                }
              }}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="ifta_account_number" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>IFTA account number</label>
            <input
              id="ifta_account_number"
              name='ifta_account_number'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.ifta_account_number}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="puc_oregon" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>PUC Oregon</label>
            <input
              id="puc_oregon"
              name='puc_oregon'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.puc_oregon}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="combine_weight" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Combine weight</label>
            <input
              id="combine_weight"
              name='combine_weight'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.combine_weight}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="net_weight" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Net weight</label>
            <input
              id="net_weight"
              name='net_weight'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.net_weight}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="fuel_interface" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Fuel Interface</label>
            <input
              id="fuel_interface"
              name='fuel_interface'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.fuel_interface}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="edi_equipment" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>EDI equipment</label>
            <input
              id="edi_equipment"
              name='edi_equipment'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom w-full focus:ring-transparent lg:h-11 lg:text-base"
              value={values.edi_equipment}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>
          <div>
            <label htmlFor="notes" className='text-primarytext mb-2 lg:mb-1 lg:text-base'>Notes</label>
            <textarea
              id="notes"
              name='notes'
              type="string"
              className="px-4 py-2 border-gray-400 rounded h-12 btn_custom focus:ring-transparent lg:h-11 lg:text-base notes_input"
              value={values.notes}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {/* { errors.email && touched.email ? <span className='text-red-500'>{errors.email}</span> : null} */}
          </div>


        </form>



        {/* <DynamicTable headers={truckMaintenance} data={maintenanceTable} onEdit={handleEditAction} onDelete={handleDeleteAction} onChange={table} /> */}

        <div className='float-right mt-6 mb-14'>
          <Link to="/equipment" className="font-semibold mt-6 border-primarybtn border text-primarybtn transition duration-300 ease-in-out rounded-lg px-12 py-3 ml-4">Cancel</Link>

          {Object.keys(equipmentData).length === 0 ? (
            <button onClick={handleSubmit} className="font-semibold mt-6 bg-primarybtn text-white transition duration-300 ease-in-out rounded-lg px-12 py-3 ml-4">Save</button>
          ) : (
            <button onClick={handleSubmit} className="font-semibold mt-6 bg-primarybtn text-white transition duration-300 ease-in-out rounded-lg px-12 py-3 ml-4">Update</button>
          )}



        </div>
      </div>
    </div>
  );
}

export default AddTruck;