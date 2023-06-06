import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { deleteRequest, get, post, put } from "../../services/api";
import DynamicTable from '../Table/DynamicTable';
import Alert from '../Alert';
import DeleteModal from './../Modals/DeleteModal';
import MaintenanceForm from './MaintenanceModal';

import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const initialValues = {
  commodity_code: "",
  gl_code: null,
  name: "",
  description: "",
  commodity_group_id: "",
  rate_by_id: "",
  active_status: false,
}

function MaintenanceListing() {

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [commodityGroups, setCommodityGroups] = useState([]);
  const [defaultRate, setdefaultRate] = useState([]);
  const [selectedCommodityGroup, setSelectedCommodityGroup] = useState('');
  const [selectedDefaultRate, setSelectedDefaultRate] = useState('');
  const [tableData, settableData] = useState([]);
  const [currentAction, setCurrentAction] = useState("Add");
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [updateid, setUpdateId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [table, setTable] = useState("Commodity");
  const [selectedTab, setSelectedTab] = useState('truck');
  const [selectedTable, setSelectedTable] = useState('truckMaintenance');
  const [maintenanceFetchedData, setMaintenanceFetchedData] = useState(null);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [trailerTableData, setTrailerTableData] = useState([]);

  const [equipmenNumber, setEquipmentNumber] = useState(null);

  const CreateTitle = "Add new commodities"
  const truckMaintenance = ['Truck Number', 'Date', 'Mileage', 'Maintenence Type', 'Maintenence Performed By', 'Maintenance Performed', 'Location', 'Bill to', 'Amount', 'Action'];
  const trailerMaintenance = ['Trailer Number', 'Date', 'Mileage', 'Maintenence Type', 'Maintenence Performed By', 'Maintenance Performed', 'Location', 'Bill to', 'Amount', 'Action'];


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openMaintenanceModal = (row) => {
    setIsMaintenanceModalOpen(true)

  }
  const handleMaintenanceAction = (id) => {
    openMaintenanceModal(id);


  }

  const handleEditActionTrailer = (row) => {
    // Open the modal   
    const id = row.id
    FetchDataToEdit(id)
    setCurrentAction("Update")

    if (row.TruckNumber) {
      setEquipmentNumber(row.TruckNumber)
    }
    else {
      setEquipmentNumber(row.TrailerNumber)

    }
    setIsMaintenanceModalOpen(true)

  };


  const handleEditAction = (row) => {

    const id = row.id
    FetchDataToEdit(id)
    setCurrentAction("Update")

    if (row.TruckNumber) {
      setEquipmentNumber(row.TruckNumber)
    }
    else {
      setEquipmentNumber(row.TrailerNumber)

    }
    // Open the modal   
    setIsMaintenanceModalOpen(true)
    // FetchDataToEdit(id);

  };
  const handleDeleteAction = (id) => {
    openDeleteModal(id);
  };

  const data1 = [
    {
      label: "Truck",
      value: "truck",
      desc: <DynamicTable headers={truckMaintenance} data={tableData} onEdit={handleEditAction} onDelete={handleDeleteAction} onMaintenance={handleMaintenanceAction} onChange={selectedTable} />,
    },
    {
      label: "Trailer",
      value: "trailer",

      desc: <DynamicTable headers={trailerMaintenance} data={trailerTableData} onEdit={handleEditActionTrailer} onDelete={handleDeleteAction} onMaintenance={handleMaintenanceAction} onChange={selectedTable} />,
    }


  ];

  const handleTabClick = (tabValue) => {
    setSelectedTab(tabValue)

    if (selectedTable === "truckMaintenance") {
      setSelectedTable("trailerMaintenance");
    } else {
      setSelectedTable("truckMaintenance");
    }

  };

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
    fetchMaintenance();
  }, [isMaintenanceModalOpen]);

  const closeMaintenanceModal = () => {
    setCurrentAction("Add")
    setIsMaintenanceModalOpen(false);
    setEquipmentNumber(null)
    resetForm();
  }

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
  //   const filteredData = tableData.filter((item) =>
  //   item.CommodityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   item.CommodityCode.toLowerCase().includes(searchQuery.toLowerCase())

  // );



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


  const FetchDataToEdit = async (id) => {
    try {
      const response = await get(`/api/v1/maintenance/edit/${id}`,
        authToken);
      setMaintenanceFetchedData(response.data.maintenance)
      //   setFormValues(response.data); // Use the setFormValues function

    } catch (error) {
      console.error('Error fetching commodity data:', error);
    }
  }


  const useCustomFormik = (initialValues, currentAction, updateid, authToken) => {

    const formik = useFormik({
      initialValues: initialValues,
      // validationSchema: CommodityValidation,

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
              setAlert({ show: true, message: 'Commodity Updated Successfully!', type: 'success' });

              resetForm(initialValues);
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

  const fetchMaintenance = async () => {
    try {
      const response = await get(`/api/v1/maintenance/index/${selectedTab}`, authToken);
      // if (Array.isArray(response.data)) {
      //   settableData(response.data);
      //   console.log(tableData)
      // }
      if (selectedTab === "truck") {
        settableData(response.data.maintenances.map(item => ({
          id: item.id,
          TruckNumber: item.trucks.number,
          Date: item.end_date,
          Mileage: item.mileage,
          MaintenanceType: item.maintenance_type,
          MaintenancePerformedBy: item.performed_by,
          MaintenancePerformed: item.maintenance_performed,
          Location: item.location,
          Billto: item.bill_to,
          Amount: item.amount
        })));

      }
      else if (selectedTab === "trailer") {
        setTrailerTableData(response.data.maintenances.map(item => ({
          id: item.id,
          TrailerNumber: item.trailers.number,
          Date: item.end_date,
          Mileage: item.mileage,
          MaintenanceType: item.maintenance_type,
          MaintenancePerformedBy: item.performed_by,
          MaintenancePerformed: item.maintenance_performed,
          Location: item.location,
          Billto: item.bill_to,
          Amount: item.amount

        })));

      }
    } catch (error) {
      console.error('Error fetching commodities:', error);
    }
  };


  useEffect(() => {
    fetchMaintenance();
  }, [selectedTable]);


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


  const handleDeleteConfirm = async (id) => {
    try {
      const response = await deleteRequest(`https://phplaravel-980736-3436689.cloudwaysapps.com/api/v1/maintenance/delete/${itemToDelete}`,
        authToken);
      setAlert({ show: true, message: 'Maintenance Deleted Successfully!', type: 'success' });
      fetchMaintenance(); // Re-fetch the list of commodities after deleting
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
        <div className="flex  mt-8">
          <h4 className=" font-medium text-3xl leading-8">
            Maintenance Log List
          </h4>
        </div>
        <div className="flex items-center mt-10">
          {selectedTab === 'truck' && (
            <button
              className="text-white py-4 px-8 rounded-lg leading-4 btn_css"
              type="button"
              onClick={() => openMaintenanceModal()}
            >
              New Log Entry
            </button>
          )}
          {selectedTab === 'trailer' && (
            <button
              className="text-white py-4 px-8 rounded-lg leading-4 btn_css"
              type="button"
              onClick={() => openMaintenanceModal()}

            >
              New Log Entry
            </button>
          )}
        </div>
      </div>
      <hr className="mt-12" />

      <div className='mt-12'>
        <div className='commodity_alert z-50'>
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

        <MaintenanceForm
          isOpen={isMaintenanceModalOpen}
          onClose={closeMaintenanceModal}
          selectedtab={selectedTab}
          selectedequipment={equipmenNumber}
          fetcheddata={maintenanceFetchedData}
          onAction={currentAction}
        />


        <Tabs value="truck" >
          <TabsHeader>
            {data1.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => handleTabClick(value)}
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

        {/* <DynamicTable headers={headers} data={tableData} onEdit={handleEditAction} onDelete={handleDeleteAction} /> */}
      </div>
    </div>
  );
}

export default MaintenanceListing;