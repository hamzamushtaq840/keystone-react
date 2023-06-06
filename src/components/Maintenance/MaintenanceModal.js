import { format, parse } from 'date-fns';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from 'react-redux';
import { showAlert } from '../../reducers/alert';
import { get, post, put } from "../../services/api";
import CustomDropdown from "./../Dropdowns/TruckDropdown";
import Modal from '../Modals/Modal';

const MaintenanceForm = ({ isOpen, onClose, selectedtab, selectedequipment, fetcheddata, onAction }) => {
  const [initialValues, setInitialValues] = useState(
    {
      number: "",
      start_date: "",
      end_date: "",
      start_time: new Date().setHours(8, 0, 0),  // set default start time to 8:00
      end_time: new Date().setHours(17, 0, 0),  // set default end time to 17:00
      mileage: "",
      maintenance_performed: "",
      maintenance_type: "",
      performed_by: "",
      location: "",
      bill_to: "",
      amount: ""

    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState("Add");
  const [updateid, setUpdateId] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [truckNumber, setTruckNumber] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [apiError, setApiError] = useState(null);
  const [maintenanceType, setMaintenanceType] = useState([]);


  const dispatch = useDispatch();

  const authToken = localStorage.getItem('authToken');


  // const closeModal = () => {
  //     setIsModalOpen(false);
  //     resetForm(initialValues);

  //   };
  useEffect(() => {
    fetchMaintenanceData();

  }, [selectedtab]);

  useEffect(() => {
    resetForm();
  }, [isOpen]);
  useEffect(() => {
    if (fetcheddata?.start_date) {
      setStartDate(new Date(fetcheddata.start_date));
      setEndDate(new Date(fetcheddata.end_date));

    }
  }, [fetcheddata]);

  useEffect(() => {
    if (fetcheddata) {

      setStartDate(new Date(fetcheddata.start_date));
      setEndDate(new Date(fetcheddata.end_date));

    }
  }, [fetcheddata]);

  useEffect(() => {
    if (fetcheddata) {
      setInitialValues({
        number: fetcheddata.number || "",
        start_time: fetcheddata.start_time ? parse(fetcheddata.start_time, "HH:mm:ss", new Date()) : "",
        end_time: fetcheddata.end_time ? parse(fetcheddata.end_time, "HH:mm:ss", new Date()) : "",
        maintenance_type: fetcheddata.maintenance_type || "",
        performed_by: fetcheddata.performed_by || "",
        maintenance_performed: fetcheddata.maintenance_performed || "",
        location: fetcheddata.location || "",
        bill_to: fetcheddata.bill_to || "",
        amount: fetcheddata.amount || "",
        mileage: fetcheddata.mileage || "",
      });
    }
  }, [fetcheddata]);


  const fetchMaintenanceData = async () => {
    try {
      const response = await get(`/api/v1/maintenance/create/${selectedtab}`, authToken);
      if (response.data && Array.isArray(response.data.numbers)) {
        // Convert numbers to strings
        setMaintenanceType(response.data.maintenance_types)
        const truckNumbersAsString = response.data.numbers.map(number => number.toString());
        setTruckNumber(truckNumbersAsString);
      }
    } catch (error) {
      console.error('Error fetching commodity groups:', error);
    }
  };
  // const changeCurrentAction = () => {
  //   setCurrentAction("Update")


  // };

  const resetFormValues = () => {
    resetForm({
      values: {
        number: "",
        start_date: "",
        end_date: "",
        start_time: new Date().setHours(8, 0, 0),  // set default start time to 8:00
        end_time: new Date().setHours(17, 0, 0),  // set default end time to 17:00
        mileage: "",
        maintenance_performed: "",
        maintenance_type: "",
        performed_by: "",
        location: "",
        bill_to: "",
        amount: ""
      }
    });
  };
  const useCustomFormik = (initialValues) => {
    const formik = useFormik({
      initialValues: initialValues,
      enableReinitialize: true,
      onSubmit: async (values, { resetForm }) => {
        const data = {
          type: selectedtab,
          id: null || fetcheddata?.id,
          number: values.number || selectedequipment,
          start_date: startDate,
          end_date: endDate,
          start_time: format(values.start_time, "HH:mm:ss"),
          end_time: format(values.end_time, "HH:mm:ss"),
          mileage: values.mileage,
          maintenance_performed: values.maintenance_performed,
          maintenance_type: values.maintenance_type,
          performed_by: values.performed_by,
          location: values.location,
          bill_to: values.bill_to,
          amount: values.amount,

        };

        console.log(data);
        if (onAction === 'Update') {
          try {
            const response = await put(`/api/v1/maintenance/update/${fetcheddata.id}`, data, authToken);
            if (response.success) { // Check for a specific status code
              setIsMaintenanceModalOpen(false);
              dispatch(showAlert({ message: 'Maintenance Updated Successfully!', type: 'success' }));


              onClose();
              resetFormValues();
            }
          } catch (error) {
            console.error('Error updating the commodity:', error);
          }
        } else {
          console.log(authToken)
          try {
            const response = await post('/api/v1/maintenance/store', data, authToken);
            if (response.success) {
              resetFormValues();
              console.log(selectedequipment, "fahad")
              setAlert({ show: true, message: 'Maintenance Added Successfully!', type: 'success' });

              // setIsMaintenanceModalOpen(false);
              onClose();
              //   setIsModalOpen(false);

              //   resetForm();     
            }
          } catch (error) {
            if (error.response.data.errors.number) {
              const numberErrors = error.response.data.errors.number;
              setApiError(numberErrors.join('. '));
            }
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

  const handleNumberChange = (event) => {
    // Clear the API error when the input value changes
    setApiError('');

    // Call the handleChange function provided by Formik
    handleChange(event);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <h1 className='text-3xl font-semibold text-center mb-10'>Add new entry</h1>
        {/* <input type="text" value={selectedequipment} readOnly /> */}

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label htmlFor="number" className='text-primarytext mb-2  lg:text-base'>
              {selectedtab === 'truck' ? 'Truck Number' : 'Trailer Number'}
            </label>
            {selectedequipment != null ? (
              <input
                id="number"
                name='number'
                type="text"
                value={selectedequipment}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2 border border-gray-400 rounded h-12  modal_btn_custom focus:ring-transparent flex flex-col w-full"
              />
            ) : (
              <CustomDropdown
                id="number"
                name='number'
                className='text-3xl'
                values={Array.isArray(truckNumber) ? truckNumber : []}
                value={values.number}
                onChange={(value) => {
                  if (apiError) {
                    setApiError('');
                  }
                  const selectedMake = truckNumber.find((number) => number === value);
                  if (selectedMake) {
                    setFieldValue('number', selectedMake);
                  } else {
                    setFieldValue('number', '');
                  }
                }}
              />
            )}
            {errors.number && touched.number && !apiError ? (
              <span className='form-error text-red-500'>{errors.number}</span>
            ) : null}
            {apiError ? (
              <span className='form-error text-red-500'>{apiError}</span>
            ) : null}
          </div>

          <div>
            <label htmlFor="start_date" className='text-primarytext mb-2'>Start Date</label>
            <DatePicker
              id="start_date"
              selected={startDate || (fetcheddata?.start_date ? new Date(fetcheddata.start_date) : new Date())} onChange={(date) => setStartDate(date)}
              dateFormat="MM/dd/yyyy"
              className="px-4 py-2 border border-gray-400 rounded h-12 modal_btn_custom focus:ring-transparent w-full"
            />
          </div>

          <div>
            <label htmlFor="end_date" className='text-primarytext mb-2'>End Date</label>
            <DatePicker
              id="end_date"
              selected={endDate || (fetcheddata?.end_date ? new Date(fetcheddata.end_date) : new Date())} onChange={(date) => setEndDate(date)}
              dateFormat="MM/dd/yyyy"
              className="px-4 py-2 border border-gray-400 rounded h-12 modal_btn_custom focus:ring-transparent w-full"
            />
          </div>

          <div>
            <label htmlFor="start_time" className='text-primarytext mb-2 '>Start Time</label>

            <DatePicker
              id="start_time"
              name='start_time'
              selected={values.start_time}
              onChange={(date) => setFieldValue('start_time', date)}
              // onChange={(date) => setFieldValue('start_time', date)}

              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="px-4 py-2 border border-gray-400 rounded h-12  modal_btn_custom focus:ring-transparent flex flex-col w-full"
            />
          </div>

          <div>
            <label htmlFor="end_time" className='text-primarytext mb-2'>End Time</label>

            <DatePicker
              id="end_time"
              name="end_time"
              selected={values.end_time}
              onChange={(date) => setFieldValue('end_time', date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="px-4 py-2 border border-gray-400 rounded h-12 modal_btn_custom focus:ring-transparent flex flex-col w-full"
            />

          </div>
          <div>
            <label htmlFor="maintenance_type" className='text-primarytext mb-2'>Maintenance Type </label>

            <CustomDropdown
              id="maintenance_type"
              name='maintenance_type'
              values={Array.isArray(maintenanceType) ? maintenanceType : []}
              value={values.maintenance_type}
              onChange={(value) => {
                const selectedType = maintenanceType.find((make) => make === value);
                if (selectedType) {
                  setFieldValue('maintenance_type', selectedType);
                } else {
                  setFieldValue('maintenance_type', '');
                }
              }}
            />
            {/* <input 
    id="maintenance_type"
    name='maintenance_type'
    type="string" 
    value={values.maintenance_type}
    onChange={handleChange}
    onBlur={handleBlur}
     className="px-4 py-2 border border-gray-400 rounded h-12  modal_btn_custom focus:ring-transparent flex flex-col w-full"
      /> */}
          </div>

          <div>
            <label htmlFor="performed_by" className='text-primarytext mb-2'>Maintenance Performed By</label>

            <input
              id="performed_by"
              name='performed_by'
              type="string"
              value={values.performed_by}
              onChange={handleChange}
              onBlur={handleBlur}
              className="px-4 py-2 border border-gray-400 rounded h-12  modal_btn_custom focus:ring-transparent flex flex-col w-full"
            />
          </div>


          <div className='col-span-2 flex flex-col'>
            <label htmlFor="maintenance_performed" className='text-primarytext mb-2'>Maintenance Performed</label>
            <textarea
              id="maintenance_performed"
              name='maintenance_performed'
              type="text"
              value={values.maintenance_performed}
              onChange={handleChange}
              onBlur={handleBlur}
              className="px-4 py-2 border border-gray-400 rounded h-12 modal_btn_custom focus:ring-transparent"
            />
          </div>

          <div>
            <label htmlFor="location" className='text-primarytext mb-2 '>Location</label>

            <input
              id="location"
              name='location'
              type="string"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              className="px-4 py-2 border border-gray-400 rounded h-12  modal_btn_custom focus:ring-transparent flex flex-col w-full"
            />
          </div>
          <div>
            <label htmlFor="bill_to" className='text-primarytext mb-2'>Bill to</label>

            <input
              id="bill_to"
              name='bill_to'
              type="string"
              value={values.bill_to}
              onChange={handleChange}
              onBlur={handleBlur}
              className="px-4 py-2 border border-gray-400 rounded h-12  modal_btn_custom focus:ring-transparent flex flex-col w-full"
            />
          </div>

          <div>
            <label htmlFor="amount" className='text-primarytext mb-2'>Amount</label>

            <input
              id="amount"
              name='amount'
              type="string"
              value={values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              className="px-4 py-2 border border-gray-400 rounded h-12  modal_btn_custom focus:ring-transparent flex flex-col w-full"
            />
          </div>

          <div>
            <label htmlFor="mileage" className='text-primarytext mb-2'>Mileage</label>

            <input
              id="mileage"
              name='mileage'
              type="string"
              value={values.mileage}
              onChange={handleChange}
              onBlur={handleBlur}
              className="px-4 py-2 border border-gray-400 rounded h-12  modal_btn_custom focus:ring-transparent flex flex-col w-full"
            />
          </div>
        </div>
        <div className='flex gap-4 items-center justify-center mt-12'>
          <button
            className=" border-primarybtn border text-primarybtn transition duration-300 ease-in-out rounded-lg px-8 py-3 "
            onClick={() => {
              resetFormValues();
              onClose();
            }}
            type="button"
          >
            Cancel
          </button>
          <button
            className="text-white py-4 px-8 rounded-lg leading-4 btn_css"
            type="submit"
          // onClick={changeCurrentAction}
          >
            {onAction === "Update" ? "Update" : "Save"}

          </button>
        </div>

      </form>


    </Modal>

  );
};

export default MaintenanceForm;