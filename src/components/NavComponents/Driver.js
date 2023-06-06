import React, { useState } from 'react';
import Navbar from '../Navbar';
import Navtop from '../Navtop';
import Modal from '../smallcomponents/Modal';
import Dropdown from '../smallcomponents/Dropdown';
import { CommodityValidation } from '../../Schemas';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { selectDriverData, selectDriverId, setDriverData, setDriverId } from '../../reducers/driverSlice';
import { get  } from "../../services/api";
import  { useEffect } from 'react';
import { post  } from "../../services/api";
import { deleteRequest  } from "../../services/api";
import { put  } from "../../services/api";
import Alert from '../smallcomponents/Alert';
import SkeletonLoader
 from '../smallcomponents/SkeletonLoader';
import DynamicTable from '../Table/DynamicTable';
import DeleteModal from '../smallcomponents/DeleteModal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearDriverData } from '../../reducers/driverSlice';
const initialValues = {
    commodity_code: "",
    gl_code: null,
    name: "",
    description: "",
    commodity_group_id: "",
    rate_by_id: "",
    active_status: false,
  }

function Driver() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const [table, setTable] = useState("driver");


  const CreateTitle = "Add new commodities"
  const driverHeader = ['Driver Number', 'Name', 'Type' , 'Status', 'Phone', 'Truck', 'Trailer', 'Payable to', 'Email', 'Actions' ];


  const authToken = localStorage.getItem('authToken');
  const fetchCommodityGroups = async () => {
    try {
      const response = await get('/api/v1/commodity-groups' ,
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
      const response = await get('/api/v1/commodities/1/rates' ,
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
      const response = await post('/api/v1/commodity-groups' , commoditydata,
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
      const response = await post('/api/v1/commodities/1/rates' , defaultratedata,
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
//   const filteredData = tableData.filter((item) =>
//   item.CommodityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   item.CommodityCode.toLowerCase().includes(searchQuery.toLowerCase())

// );



  const handleEditAction = async (id) => {  
    try {
      const response = await get(`/api/v1/driver/${id}`, authToken);
      if(response.success){
        // Do something with the response data
        navigate('/adddriver');
        dispatch(setDriverData(response.data.driver)); // Store the data in Redux
        dispatch(setDriverId(id)); // Dispatching the ID to Redux
      }
    } catch (error) {
      console.error('Error while editing:', error);
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
  if(fetchedData.commodity_group_id) {
  setFieldValue('commodity_group_id', fetchedData.commodity_group_id.id);
  }
  else {
      setFieldValue('commodity_group_id', '');

  }
  if(fetchedData.rate_by_id) {
  setFieldValue('rate_by_id', fetchedData.rate_by_id.id);

  }
else {
    setFieldValue('rate_by_id', '');

}
  setFieldValue('active_status', fetchedData.active_status === 'Inactive');
};
const FetchDataToEdit = async (id) => {
  try {
    const response = await get(`/api/v1/commodities/${id}` ,
    authToken);
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
            setAlert({ show: true, message: 'Commodity Added Successfully!', type: 'success'  });
            console.log(initialValues)
            resetForm();     
               }
        } catch (error) {
        }
      } else {
        try {
          console.log("here")
          const response = await put(`/api/v1/commodities/${updateid}`, data, authToken);
          if (response.status) { // Check for a specific status code
            setIsModalOpen(false);
            setAlert({ show: true, message: 'Commodity Updated Successfully!', type: 'success'  });

            resetForm(initialValues);
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

const handleClick = () => {
  // openModal();
  dispatch(clearDriverData());
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

const fetchDriver = async () => {
  try {
    const response = await get('/api/v1/driver', authToken);
    // if (Array.isArray(response.data)) {
    //   // settableData(response.data);
    //   console.log(tableData)
    // }
    settableData(response.data.drivers.map(item => ({
      id: item.id,
      DriverNumber: item.drivernumber,
      Name: item.firstname,
      Type: item.type,
      Status: item.active_status,
      Phone: item.phonenumber,
      Truck: item.truck,
      Trailer: item.trailer,
      PayableTo: item.pay_to,
      Email: item.email,
    })));
  } catch (error) {
    console.error('Error fetching commodities:', error);
  }
};
// useEffect(() => {
//   if (!isModalOpen) {
//     fetchCommodities();
//   }
// }, [isModalOpen]);

useEffect(() => {
  fetchDriver();
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
      const response =  await deleteRequest(`https://phplaravel-980736-3436689.cloudwaysapps.com/api/v1/driver/${itemToDelete}` ,
      authToken);
      setAlert({ show: true, message: 'Driver Deleted Successfully!', type: 'success'  });
      fetchDriver(); // Re-fetch the list of commodities after deleting
      setIsDeleteModalOpen(false); // Close the delete modal
    } catch (error) {
      console.error('Error', error);
    }
  };
  
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  
  return (
        <div className="main-content_css pl-8 pr-16">
          <div className="flex justify-between items-center">
            <div className="flex mt-8">
              <h4 className=" font-medium text-3xl leading-8">
                 Driver List
              </h4>
              
            </div>
            <div className="flex items-center mt-10">
            <Link
            to="/adddriver"
  className=" text-white py-4 px-8 rounded-lg leading-4 btn_css"
  onClick={handleClick}
  type="button"
>
  Add New Driver
</Link>
            </div>
          </div>
          <hr className="mt-12" />

<div className='mt-11'>
  <div className='commodity_alert'>
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
      
      <DynamicTable headers={driverHeader} data={tableData} onEdit={handleEditAction} onDelete={handleDeleteAction}  onChange={table}/>
      </div>
      </div>
  );
}

export default Driver;