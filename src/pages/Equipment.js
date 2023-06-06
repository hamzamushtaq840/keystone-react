import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setEquipmentData, setEquipmentId } from '../store/reducers/equipmentSlice';
import { deleteRequest, get, post, put } from "../services/api";
import Alert from '../components/Alert';
import DynamicTable from '../components/Table/DynamicTable';
import CustomDropdown from "../smallcomponents/CustomDropdownWithFormik";
import DeleteModal from '../smallcomponents/DeleteModal';
import MaintenanceForm from '../smallcomponents/Maintenance';
import Navbar from '../components/Navbar/Navbar';
import Navtop from '../components/Navbar/Navtop';

const initialValues = {
  gl_code: "",
  name: "",
  description: "",
  commodity_group_id: "",
  rate_by_id: "",
  active_status: false,
}

function Equipment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [commodityGroups, setCommodityGroups] = useState([]);
  const [defaultRate, setdefaultRate] = useState([]);
  const [selectedCommodityGroup, setSelectedCommodityGroup] = useState('');
  const [selectedDefaultRate, setSelectedDefaultRate] = useState('');
  const [tableData, settableData] = useState([]);
  const [trailerTableData, setTrailerTableData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

  const [currentAction, setCurrentAction] = useState("Add");
  const [fetchCommodity, setFetchCommodity] = useState("");
  const [fetchRate, setFetchRate] = useState("");
  const [fetchStatus, setfetchStatus] = useState("");
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [updateid, setUpdateId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [equipmenNumber, setEquipmentNumber] = useState('');

  const [selectedTab, setSelectedTab] = useState('truck');
  const trailerHeaders = ['Trailer Number', 'Trailer Type', 'Trailer ID number', 'Status', 'Number of Axles', 'License Plate Number', 'License Plate State', 'Generator information', 'Door Style', 'Action'];
  const truckHeaders = ['Truck Number', 'Truck Type', 'Status', 'Number of Axles', 'License Plate Number', 'License Plate State', 'IRP Registered', 'Action'];


  const handleEditAction = async (id) => {

    // Calling the API
    try {
      const response = await get(`/api/v1/equipment/edit/${id}/${selectedTab}`, authToken);
      if (response.success) {
        // Do something with the response data
        navigate('/addtruck');
        dispatch(setEquipmentData(response.data.equipment)); // Store the data in Redux
        dispatch(setEquipmentId(id)); // Dispatching the ID to Redux
      }
    } catch (error) {
      console.error('Error while editing:', error);
    }
  };
  const handleEditActionTrailer = async (id) => {
    // Open the modal   
    navigate('/addtrailer');

    // Calling the API
    try {
      const response = await get(`/api/v1/equipment/edit/${id}/${selectedTab}`, authToken);
      if (response.success) {
        // Do something with the response data
        console.log(response.data);
        navigate('/addtrailer');

        dispatch(setEquipmentData(response.data.equipment)); // Store the data in Redux
        dispatch(setEquipmentId(id)); // Dispatching the ID to Redux

      }
    } catch (error) {
      console.error('Error while editing:', error);
    }
  };


  const handleTabClick = (tabValue) => {
    setSelectedTab(tabValue);
  };

  const handleDeleteAction = (id) => {
    openDeleteModal(id);
  };

  const handleMaintenanceAction = (id) => {
    openMaintenanceModal(id);
    // dispatch(setEquipmentId(id));

  }
  const data1 = [
    {
      label: "Truck",
      value: "truck",
      desc: <DynamicTable headers={truckHeaders} data={tableData} onEdit={handleEditAction} onDelete={handleDeleteAction} onMaintenance={handleMaintenanceAction} onChange={selectedTab} />,

    },
    {
      label: "Trailer",
      value: "trailer",
      desc: <DynamicTable headers={trailerHeaders} data={trailerTableData} onEdit={handleEditActionTrailer} onDelete={handleDeleteAction} onMaintenance={handleMaintenanceAction} onChange={selectedTab} />,
    }


  ];

  const options = ["Truck", "Trailer"];


  const CreateTitle = "Add new commodities"
  const data = [
    { CommodityCode: 'SH1234', CommodityName: 'Couch', CommodityGroup: 'Furniture', DefaultRateby: 'Flat Amount', CommodityStatus: 'Active' },
    { CommodityCode: 'SH1234', CommodityName: 'Couch', CommodityGroup: 'Furniture', DefaultRateby: 'Flat Amount', CommodityStatus: 'Inactive' },
    { CommodityCode: 'SH1234', CommodityName: 'Couch', CommodityGroup: 'Furniture', DefaultRateby: 'Flat Amount', CommodityStatus: 'Active' },

  ];

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    fetchEquipment();

  }, [selectedTab]);

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);
  const fetchEquipment = async () => {
    try {
      const response = await get(`/api/v1/equipment/index/${selectedTab}`, authToken);
      if (Array.isArray(response.data)) {
        settableData(response.data);
        console.log(tableData)
      }
      if (selectedTab === "truck") {
        settableData(response.data.equipments.map(item => ({
          id: item.id,
          TruckNumber: item.number,
          TruckType: item.type,
          Status: item.status,
          NumberofAxles: item.number_of_axles,
          LicensePlateNumber: item.license,
          LicensePlateState: item.state,
          IRPRegistered: item.irp_registered,
        })));

      }
      else if (selectedTab === "trailer") {
        setTrailerTableData(response.data.equipments.map(item => ({
          id: item.id,
          TrailerNumber: item.number,
          TrailerType: item.type,
          TrailerIDnumber: item.vehicle_number,
          Status: item.status,
          NumberofAxles: item.number_of_axles,
          LicensePlateNumber: item.license,
          LicensePlateState: item.state,
          Generatorinformation: item.generator_information,
          DoorStyle: item.door_style,

        })));

      }
    } catch (error) {
      console.error('Error fetching commodities:', error);
    }
  };

  const useCustomFormik = (initialValues, currentAction, updateid, authToken) => {
    const formik = useFormik({
      initialValues: initialValues,
      onSubmit: async (values, { resetForm }) => {
        const data = {
          gl_code: values.gl_code,
          name: values.name,
          description: values.description,
          commodity_group_id: values.commodity_group_id,
          rate_by_id: values.rate_by_id,
          active_status: values.active_status,
        };
        console.log(data);
        if (currentAction === 'Add') {
          try {
            const response = await post('/api/v1/commodities', data, authToken);
            if (response.status) {
              setIsModalOpen(false);

              resetForm();
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('id', updateid);
          try {
            const response = await put(`/api/v1/commodities/${updateid}`, data, authToken);
            if (response.status) { // Check for a specific status code
              setIsModalOpen(false);
              values.gl_code = ""

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

  // CustomDropdown component with userType value update

  const CustomDropdownWithFormik = (props) => {
    const onOptionClick = (option) => {
      if (option === "Select an option") {
        setFieldValue("userType", "");
      } else {
        setFieldValue("userType", option);
        setFieldTouched("userType", true);

      }
    };

    return <CustomDropdown {...props} selectedValue={values.userType} onOptionClick={onOptionClick} />;
  };



  const handleCheckboxChange = (e) => {
    const newCheckedValue = !isChecked;
    setIsChecked(newCheckedValue);
    setFieldValue('active_status', newCheckedValue);
  };

  const openModal = () => {
    setIsModalOpen(true);
    console.log(currentAction)
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();

  };

  // Delete API
  const openDeleteModal = (id) => {
    setIsDeleteModalOpen(true);
    setItemToDelete(id);
  };

  const openMaintenanceModal = (row) => {
    if (row.TruckNumber) {
      setEquipmentNumber(row.TruckNumber)
    }
    else {
      setEquipmentNumber(row.TrailerNumber)

    }
    setIsMaintenanceModalOpen(true)
  }
  const closeMaintenanceModal = () => {
    console.log("close")
    setIsMaintenanceModalOpen(false);
  }

  const handleDeleteConfirm = async (id) => {
    try {
      const response = await deleteRequest(`https://phplaravel-980736-3436689.cloudwaysapps.com/api/v1/equipment/delete/${itemToDelete}/${selectedTab}`,
        authToken);
      setAlert({ show: true, message: 'Equipment Deleted Successfully!', type: 'success' });
      fetchEquipment(); // Re-fetch the list of commodities after deleting
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
                Equipment List
              </h4>
            </div>
            <div className="flex items-center mt-10">
              {selectedTab === 'truck' && (
                <Link
                  to="/addtruck"
                  className="text-white py-4 px-8 rounded-lg leading-4 btn_css"
                  type="button"
                >
                  Add Equipment
                </Link>
              )}
              {selectedTab === 'trailer' && (
                <Link
                  to="/addtrailer"

                  className="text-white py-4 px-8 rounded-lg leading-4 btn_css"
                  type="button"
                >
                  Add Equipment
                </Link>
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

export default Equipment;