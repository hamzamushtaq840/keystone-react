import React, { useState } from 'react';
import Navbar from '../Navbar';
import Navtop from '../Navtop';
import Modal from '../smallcomponents/Modal';
import Dropdown from '../smallcomponents/Dropdown';
import { CommodityValidation } from '../../Schemas';
import { useFormik } from 'formik';
import axios from 'axios';
import { get } from "../../services/api";
import { useEffect } from 'react';
import { post } from "../../services/api";
import { deleteRequest } from "../../services/api";
import { put } from "../../services/api";
import Alert from '../Alert';
import SkeletonLoader
  from '../smallcomponents/SkeletonLoader';
import DynamicTable from '../Table/DynamicTable';
import DeleteModal from '../smallcomponents/DeleteModal';
const initialValues = {
  commodity_code: "",
  gl_code: null,
  name: "",
  description: "",
  commodity_group_id: "",
  rate_by_id: "",
  active_status: false,
}

function Commodity() {

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [commodityGroups, setCommodityGroups] = useState([]);
  const [defaultRate, setdefaultRate] = useState([]);
  const [selectedCommodityGroup, setSelectedCommodityGroup] = useState('');
  const [selectedDefaultRate, setSelectedDefaultRate] = useState('');
  const [tableData, settableData] = useState([]);
  const [currentAction, setCurrentAction] = useState("Add");
  const [fetchCommodity, setFetchCommodity] = useState("");
  const [fetchRate, setFetchRate] = useState("");
  const [fetchStatus, setfetchStatus] = useState("");
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [updateid, setUpdateId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [table, setTable] = useState("Commodity");
  const [apiError, setApiError] = useState(null);


  const CreateTitle = "Add new commodities"
  const headers = ['Commodity Code / GL Revenue Code', 'Commodity Name', 'Commodity Group', 'Default Rate by', 'Commodity Status', 'Action'];


  const authToken = localStorage.getItem('authToken');
  const fetchCommodityGroups = async () => {
    try {
      const response = await get('/api/v1/commodity-groups',
        authToken);
      if (Array.isArray(response.data)) {
        setCommodityGroups(response.data);
      }
    } catch (error) {
      console.error('Error fetching commodity groups:', error);
    }
  };
  const fetchdefaultRateBy = async () => {
    try {
      const response = await get('/api/v1/commodities/1/rates',
        authToken);
      if (Array.isArray(response.data)) {
        setdefaultRate(response.data);
      }
    } catch (error) {
      console.error('Error fetching default rates:', error);
    }
  };
  useEffect(() => {
    if (isModalOpen) {
      fetchCommodityGroups();
      fetchdefaultRateBy();
    }
  }, [isModalOpen]);



  const PostCommodityGroup = async (data) => {

    const commoditydata = { name: data };
    try {
      const response = await post('/api/v1/commodity-groups', commoditydata,
        authToken);
      // setFieldValue('commodity_group_id', null);
      fetchCommodityGroups();
      return response.data;


      //   setCommodityGroups(response.data);
    } catch (error) {
      console.error('Error fetching commodity groups:', error);
    }
  };

  const PostDefaultRate = async (data, onValueAdded) => {
    const defaultratedata = { name: data };
    try {
      const response = await post('/api/v1/commodities/1/rates', defaultratedata,
        authToken);
      fetchdefaultRateBy();
      return response.data;

      if (onValueAdded) {
        onValueAdded(data);
      }

      //   setCommodityGroups(response.data);
    } catch (error) {
      console.error('Error fetching commodity groups:', error);
    }
  };


  // Searchbar Functionality 
  const filteredData = tableData.filter((item) =>
    item.CommodityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.CommodityCode.toLowerCase().includes(searchQuery.toLowerCase())

  );


  const handleEditAction = (id) => {

    // Open the modal   
    setIsModalOpen(true);
    setUpdateId(id);
    setCurrentAction("")
    FetchDataToEdit(id);

  };
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  // const handleDeleteAction = (id) => {
  //   // Open the modal
  //   // setIsModalOpen(true);
  //   // setCurrentAction("")
  //   // FetchDataToEdit(id);
  //   DeleteDataFromRow(id);
  // };
  // const DeleteDataFromRow = async (id) => {
  //   try{
  //     const response =  await deleteRequest(`http://phplaravel-980736-3436689.cloudwaysapps.com/api/v1/commodities/${id}` ,
  //     authToken);
  //     setAlert({ show: true, message: 'Commodity Deleted Successfully!', type: 'success'  });
  //     fetchCommodities(); // Re-fetch the list of commodities after deleting
  //   }
  //   catch (error)
  // {
  //   console.error('Error', error)
  // }}
  const setFormValues = (fetchedData) => {
    setFieldValue('gl_code', fetchedData.gl_code);
    setFieldValue('commodity_code', fetchedData.commodity_code);
    setFieldValue('name', fetchedData.name);
    setFieldValue('description', fetchedData.description);
    if (fetchedData.commodity_group_id) {
      setFieldValue('commodity_group_id', fetchedData.commodity_group_id.id);
    }
    else {
      setFieldValue('commodity_group_id', '');

    }
    if (fetchedData.rate_by_id) {
      setFieldValue('rate_by_id', fetchedData.rate_by_id.id);

    }
    else {
      setFieldValue('rate_by_id', '');

    }
    setFieldValue('active_status', fetchedData.active_status === 'Inactive');
  };
  const FetchDataToEdit = async (id) => {
    try {
      const response = await get(`/api/v1/commodities/${id}`,
        authToken);
      // setIsChecked(response);

      //   values.gl_code = response.data.gl_code
      //    values.name = response.data.name
      //  values.description = response.data.description
      //  values.commodity_group_id = response.data.commodity_group_id.id
      //  values.rate_by_id = response.data.rate_by_id.id
      // //   values.rate_by_id = response.data.rate_by_id
      // // response.active_status
      setFormValues(response.data); // Use the setFormValues function

      //  setFetchCommodity(response.data.commodity_group_id.name)
      //  setFetchRate( response.data.rate_by_id.name)
      //  setfetchStatus(response.data.active_status)
      //  if(response.data.active_status === "Active")
      //  {
      //   values.active_status = false
      // }
      // else{
      //   values.active_status = true

      // }

    } catch (error) {
      console.error('Error fetching commodity data:', error);
    }
  }

  const useCustomFormik = (initialValues, currentAction, updateid, authToken) => {

    const formik = useFormik({
      initialValues: initialValues,
      validationSchema: CommodityValidation,

      onSubmit: async (values, { resetForm }) => {
        const data = {
          gl_code: values.gl_code,
          commodity_code: values.commodity_code,
          name: values.name,
          description: values.description,
          commodity_group_id: values.commodity_group_id,
          rate_by_id: values.rate_by_id,
          active_status: values.active_status,
        };
        if (currentAction === 'Add') {
          try {
            const response = await post('/api/v1/commodities', data, authToken);
            if (response.status) {
              setIsModalOpen(false);
              setAlert({ show: true, message: 'Commodity Added Successfully!', type: 'success' });
              setIsChecked(false);
              resetForm();
            }
          } catch (error) {
            setApiError(error.response.data.message);

          }
        } else {
          try {
            console.log("here")
            const response = await put(`/api/v1/commodities/${updateid}`, data, authToken);
            if (response.status) { // Check for a specific status code
              setIsModalOpen(false);
              setAlert({ show: true, message: 'Commodity Updated Successfully!', type: 'success' });

              resetForm(initialValues);
              setIsChecked(false);

              setFetchCommodity('')
              setFetchRate('')
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
    resetForm
  } = formik;

  const fetchCommodities = async () => {
    try {
      const response = await get('/api/v1/commodities', authToken);
      // if (Array.isArray(response.data)) {
      //   settableData(response.data);
      //   console.log(tableData)
      // }
      settableData(response.data.map(item => ({
        id: item.id,
        CommodityCode: item.commodity_code,
        CommodityName: item.name,
        CommodityGroup: item.commodity_group_id,
        DefaultRateby: item.rate_by_id,
        CommodityStatus: item.active_status,
        GLRevenueCode: item.gl_code,

      })));
    } catch (error) {
      console.error('Error fetching commodities:', error);
    }
  };
  useEffect(() => {
    if (!isModalOpen) {
      fetchCommodities();
    }
  }, [isModalOpen]);

  useEffect(() => {
    fetchCommodities();
  }, []);


  const handleCheckboxChange = (e) => {
    const newCheckedValue = !isChecked;
    setIsChecked(newCheckedValue);
    setFieldValue('active_status', newCheckedValue);
  };



  const openModal = () => {
    setIsModalOpen(true);
    setCurrentAction("Add")
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm(initialValues);
    setIsChecked(false);

  };
  // Delete Modal
  const openDeleteModal = (id) => {
    setIsDeleteModalOpen(true);
    setItemToDelete(id);
  };

  const handleDeleteAction = (id) => {
    openDeleteModal(id);
  };
  const handleDeleteConfirm = async (id) => {
    try {
      const response = await deleteRequest(`https://phplaravel-980736-3436689.cloudwaysapps.com/api/v1/commodities/${itemToDelete}`,
        authToken);
      setAlert({ show: true, message: 'Commodity Deleted Successfully!', type: 'success' });
      fetchCommodities(); // Re-fetch the list of commodities after deleting
      setIsDeleteModalOpen(false); // Close the delete modal
    } catch (error) {
      console.error('Error', error);
    }
  };


  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);

  };

  const handleCommodityChange = (event) => {
    // Clear the API error when the input value changes
    setApiError('');

    // Call the handleChange function provided by Formik
    handleChange(event);
  };

  return (
    <div className="flex h-screen">
      <div className="p-4 navbar_css border-r">
        <Navbar />
      </div>
      <div className="main-body_css">
        <div className="nav-top_css border-b flex justify-end">
          <Navtop />
        </div>
        <div className="main-content_css pl-8 pr-16">
          <div className="flex justify-between items-center">
            <div className="flex mt-8">
              <h4 className=" font-medium text-3xl leading-8">
                Commodity List
              </h4>

            </div>
            <div className="flex items-center mt-10">
              <button
                className=" text-white py-4 px-8 rounded-lg leading-4 btn_css"
                onClick={openModal}
                type="button"
              >
                Add Commodity
              </button>
            </div>
          </div>
          <hr className="mt-12" />

          <div className='mt-11'>
            <div className='commodity_alert z-50'>
              <Alert
                show={alert.show}
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ ...alert, show: false })}

              />
              <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDeleteConfirm}
              />

            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='float-right search_input mb-7 focus:ring-transparent'
            />

            <DynamicTable headers={headers} data={filteredData} onEdit={handleEditAction} onDelete={handleDeleteAction} onChange={table} />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} >
        <form onSubmit={handleSubmit}>
          <h1 className='text-3xl font-semibold text-center mb-10'> {currentAction === "Add" ? CreateTitle : "Update Commodity"}</h1>

          <div className='flex justify-between'>
            <div className='w-2/4'>

              <label htmlFor="commodity_code" className='text-primarytext mb-2'>Commodity Code</label>

              <input
                id="commodity_code"
                name='commodity_code'
                type="string"
                placeholder="Enter Commodity Code"
                value={values.commodity_code}
                onChange={handleCommodityChange}
                onBlur={handleBlur}
                className="px-4 py-2 border border-gray-400 rounded h-12  modal_btn_custom focus:ring-transparent flex flex-col w-11/12"
              />
              {errors.commodity_code && touched.commodity_code && !apiError ? (
                <span className='form-error text-red-500'>{errors.commodity_code}</span>
              ) : null}
              {apiError ? (
                <span className='form-error text-red-500'>{apiError}</span>
              ) : null}
            </div>
            <div className='w-2/4'>
              <label htmlFor="name" className='text-primarytext mb-2'>Commodity Name</label>

              <input
                id="name"
                name='name'
                type="text"
                placeholder="Enter Commodity Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="px-4 py-2 border border-gray-400 rounded h-12  modal_btn_custom focus:ring-transparent flex flex-col w-full"
              />
              {errors.name && touched.name ? <span className='form-error text-red-500' >{errors.name}</span> : null}

            </div>
          </div>
          <div className='flex flex-col justify-around mt-6'>
            <label htmlFor="description" className='text-primarytext mb-2'>Description</label>
            <textarea
              id="description"
              name='description'
              type="text"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Commodity Description"
              className="px-4 py-2 border border-gray-400 rounded modal_btn_custom h-32 w-full focus:ring-transparent"
            />
          </div>
          <div className='flex mt-6 justify-between'>
            <div className='commodity_dropdown_div' style={{ width: '46%' }}
            >
              <p className='text-primarytext'>Commodity Group</p>
              <Dropdown
                id="commodity_group_id"
                name='commodity_group_id'
                className="w-11/12"
                values={commodityGroups.map((group) => group.name)}
                value={commodityGroups.find((group) => group.id === values.commodity_group_id)?.name || ''}
                onChange={(value) => {
                  const selectedGroup = commodityGroups.find((group) => group.name === value);
                  if (selectedGroup) {
                    setFieldValue('commodity_group_id', selectedGroup.id);
                    setSelectedCommodityGroup(selectedGroup.id);
                  } else {
                    setFieldValue('commodity_group_id', '');
                    setSelectedCommodityGroup('');
                  }
                }}
                onAddMore={async (value) => {
                  const newRate = await PostCommodityGroup(value);
                  if (newRate) {
                    setCommodityGroups((prevCommodityGroup) => [...prevCommodityGroup, newRate]);
                    setFieldValue('commodity_group_id', newRate.id);
                    setSelectedCommodityGroup(newRate.id);
                  }
                }}

                onFetchedCommodity={fetchCommodity}
              />
            </div>
            <div className='commodity_dropdown_div ' style={{ width: '50%' }}
            >
              <p className='text-primarytext'>Default Rate by</p>


              <Dropdown
                id="rate_by_id"
                name='rate_by_id'
                className="float-right "
                values={defaultRate.map((group) => group.name)}
                value={defaultRate.find((group) => group.id === values.rate_by_id)?.name || ''}
                onChange={(value) => {
                  const selectedRate = defaultRate.find((group) => group.name === value);
                  if (selectedRate) {
                    setFieldValue('rate_by_id', selectedRate.id);
                    setSelectedDefaultRate(selectedRate.id);
                  } else {
                    setFieldValue('rate_by_id', '');
                    setSelectedDefaultRate('');
                  }
                }}
                onAddMore={async (value) => {
                  const newRate = await PostDefaultRate(value);
                  if (newRate) {
                    setdefaultRate((prevDefaultRate) => [...prevDefaultRate, newRate]);
                    setFieldValue('rate_by_id', newRate.id);
                    setSelectedDefaultRate(newRate.id);
                  }
                }}
                onFetchedRate={fetchRate}
              />


            </div>


          </div>
          <div className='w-2/4 mt-6'>

            <label htmlFor="gl_code" className='text-primarytext mb-2'>GL revenue code</label>

            <input
              id="gl_code"
              name='gl_code'
              type="string"
              placeholder="Enter Gl revenue Code"
              value={values.gl_code}
              onChange={handleChange}
              onBlur={handleBlur}
              className="px-4 py-2 border border-gray-400 rounded h-12  modal_btn_custom focus:ring-transparent flex flex-col w-11/12"
            />
            {/* { errors.gl_code && touched.gl_code ? <span className='form-error text-red-500' >{errors.gl_code}</span> : null}  */}
          </div>
          <div className="mt-4 cursor-pointer">
            <div
              onClick={handleCheckboxChange}
              className="flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id="active_status"
                className="form-checkbox text-custom-gray h-4 w-4 rounded "
                checked={isChecked}
                value={isChecked}

                readOnly
              />
              <label htmlFor="active_status" className="ml-2 text-zinc-600">
                Inactive Commodity
              </label>
            </div>
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
              className="text-white py-4 px-8 rounded-lg leading-4 btn_css ml-2"
              type="submit"

            >
              {currentAction === "Add" ? "Add Commodity" : "Update Commodity"}
            </button>

          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Commodity;