import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TrailerImage from './../../assets/TrailerImage.png';
import TruckImage from './../../assets/truckimage.png';
import { setEquipmentData, setEquipmentId } from '../../reducers/equipmentSlice';
import { deleteRequest, get, post, put } from "../../services/api";
import DynamicTable from '../Table/DynamicTable';
import Alert from '../Alert';
import DeleteModal from './../Modals/DeleteModal';
import MaintenanceForm from './../Maintenance/MaintenanceModal';

import { useSelector } from 'react-redux';
import arrowBack from './../../assets/arrow-back.png';
import TruckIcon1 from './../../assets/icons/TruckIcon1';
import TruckIcon2 from './../../assets/icons/TruckIcon2';
import TruckIcon3 from './../../assets/icons/TruckIcon3';
import TruckIcon4 from './../../assets/icons/TruckIcon4';

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

function EquipmentDashboard() {
  const dispatch = useDispatch();

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
  const [equipmentData, setEquipmentDataState] = useState({
    status: '',
    vehicle_number: '',
    license: '',
    length: '',
    height: '',
    width: '',
    unloaded_weight: '',
    irp_registered: '',
    ifta_registered: '',
    irp_account: '',
    ifta_account: '',
    puc_oregon: '',
    combine_weight: '',
    net_weight: '',
    fuel_interface: '',
    edi_equipment: '',
    notes: '',
    number: '',
    model: '',
    laden_weight: '',
    door_style: '',
    generator_information: '',


  });
  const [equipmenNumber, setEquipmentNumber] = useState('');

  const CreateTitle = "Add new commodities"
  const truckMaintenance = ['Truck Number', 'Date', 'Mileage', 'Maintenence Type', 'Maintenence Performed By', 'Maintenance Performed', 'Location', 'Bill to', 'Amount', 'Action'];
  const trailerMaintenance = ['Trailer Number', 'Date', 'Mileage', 'Maintenence Type', 'Maintenence Performed By', 'Maintenance Performed', 'Location', 'Bill to', 'Amount', 'Action'];

  const id = useSelector((state) => state.equipmentDashboard.id);
  const selectedequipment = useSelector((state) => state.equipmentDashboard.selectedEquipment)
  useEffect(() => {
    fetchEquipmentData();
    // dispatch(setEquipmentData(selectedequipment)); // Store the data in Redux

    // console.log(id, selectedequipment, "fahad here")
  }, [id, selectedequipment]);
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };


  const handleDeleteConfirm = async (id) => {
    try {
      const response = await deleteRequest(`https://phplaravel-980736-3436689.cloudwaysapps.com/api/v1/maintenance/delete/${itemToDelete}`,
        authToken);
      setAlert({ show: true, message: 'Maintenance Deleted Successfully!', type: 'success' });
      // fetchMaintenance(); // Re-fetch the list of commodities after deleting
      setIsDeleteModalOpen(false); // Close the delete modal
    } catch (error) {
      console.error('Error', error);
    }
  };
  const fetchEquipmentData = async () => {
    try {
      const response = await get(`/api/v1/equipment/edit/${id}/${selectedequipment}`,
        authToken);
      if (response.success) {
        setEquipmentDataState(prevData => ({
          ...prevData,
          ...response.data.equipment
        }));

        if (selectedequipment === "truck") {
          settableData(response.data.maintenance.map(item => ({
            id: item.id,
            TruckNumber: equipmentData.number,
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
        else if (selectedequipment === "trailer") {
          setTrailerTableData(response.data.maintenance.map(item => ({
            id: item.id,
            // TrailerNumber: item.trailers.number,
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
        dispatch(setEquipmentData(response.data.equipment));
        dispatch(setEquipmentId(id));
        // dispatch(setEquipmentId(id)); // Dispatching the ID to Redux

      }
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  };
  useEffect(() => {
    // fetchEquipmentData();
    console.log(equipmentData, "fahad here")
  }, [equipmentData]);
  useEffect(() => {
    fetchEquipmentData();
    // dispatch(setEquipmentData(selectedequipment)); // Store the data in Redux

    // console.log(id, selectedequipment, "fahad here")
  }, [isMaintenanceModalOpen]);
  const navigate = useNavigate();

  const openMaintenanceModal = (row) => {
    console.log(equipmentData.number, "data here")
    setEquipmentNumber(equipmentData.number)
    // setEquipmentNumber(row.TrailerNumber)

    setIsMaintenanceModalOpen(true)

  }
  const handleMaintenanceAction = (id) => {
    openMaintenanceModal(id);


  }

  const closeMaintenanceModal = () => {
    setCurrentAction("Add")
    setIsMaintenanceModalOpen(false);
    setEquipmentNumber(null)
    resetForm();
  }

  const handleEditActionTrailer = (row) => {
    // Open the modal   
    const id = row.id
    FetchDataToEdit(id)
    setCurrentAction("Update")

    setEquipmentNumber(equipmentData.number)

    setIsMaintenanceModalOpen(true)

  };


  const handleEditAction = (row) => {

    const id = row.id
    FetchDataToEdit(id)
    setCurrentAction("Update")

    setEquipmentNumber(equipmentData.number)




    // Open the modal   
    setIsMaintenanceModalOpen(true)
    // FetchDataToEdit(id);

  };
  const handleDeleteAction = (id) => {
    openDeleteModal(id);
  };

  const ShipmentData = [];
  const data1 = [
    {
      label: "Maintenance",
      value: "truck",
      desc: <div className="pr-4">


        <div className="flex justify-between items-center">
          <div className="flex  mt-6">
            <h4 className=" font-medium text-3xl leading-8" style={{ fontFamily: 'Poppins', color: 'black' }}>
              Maintenance Log List
            </h4>
          </div>
          <div className="flex items-center mt-8 ">
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
            selectedtab={selectedequipment}
            selectedequipment={equipmenNumber}
            fetcheddata={maintenanceFetchedData}
            onAction={currentAction}
          />



          {selectedequipment === 'truck' ? (
            <>

              <DynamicTable headers={truckMaintenance} data={tableData} onEdit={handleEditAction} onDelete={handleDeleteAction} onMaintenance={handleMaintenanceAction} onChange={selectedTable} />
            </>
          ) : (
            <>
              <DynamicTable headers={trailerMaintenance} data={trailerTableData} onEdit={handleEditActionTrailer} onDelete={handleDeleteAction} onMaintenance={handleMaintenanceAction} onChange={selectedTable} />

            </>
          )}

        </div>
      </div>,
    },
    {
      label: "Shipment",
      value: "trailer",

      desc: <DynamicTable headers={trailerMaintenance} data={ShipmentData} onEdit={handleEditActionTrailer} onDelete={handleDeleteAction} onMaintenance={handleMaintenanceAction} onChange={selectedTable} />,
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
  // useEffect(() => {
  //   fetchMaintenance();
  // }, [isMaintenanceModalOpen]);



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

  // const fetchMaintenance = async () => {
  //   try {
  //     const response = await get(`/api/v1/maintenance/index/${selectedTab}`, authToken);
  //     // if (Array.isArray(response.data)) {
  //     //   settableData(response.data);
  //     //   console.log(tableData)
  //     // }
  //     if(selectedTab === "truck") {
  //         settableData(response.data.maintenances.map(item => ({
  //           id: item.id,
  //           TruckNumber: item.trucks.number,
  //           Date: item.end_date,
  //           Mileage: item.mileage,
  //           MaintenanceType: item.maintenance_type,
  //           MaintenancePerformedBy: item.performed_by,
  //           MaintenancePerformed: item.maintenance_performed,
  //           Location: item.location,
  //           Billto: item.bill_to,
  //           Amount: item.amount
  //         })));

  //       }
  //       else if(selectedTab === "trailer") {
  //         setTrailerTableData(response.data.maintenances.map(item => ({
  //           id: item.id,
  //           TrailerNumber: item.trailers.number,
  //           Date: item.end_date,
  //           Mileage: item.mileage,
  //           MaintenanceType: item.maintenance_type,
  //           MaintenancePerformedBy: item.performed_by,
  //           MaintenancePerformed: item.maintenance_performed,
  //           Location: item.location,
  //           Billto: item.bill_to,
  //           Amount: item.amount

  //         })));

  //       }
  //   } catch (error) {
  //     console.error('Error fetching commodities:', error);
  //   }
  // };


  // useEffect(() => {
  //     fetchMaintenance();
  // }, [selectedTable]);


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

  const openEditPage = () => {
    if (selectedequipment === 'truck') {
      // dispatch(setEquipmentData(selectedequipment)); // Store the data in Redux
      navigate('/addtruck');

    }
    else {
      navigate('/addtrailer');

    }
  }





  return (
    <div>
      <Link to="/equipment" className='flex w-full items-center mb-6 mt-16 ml-8'>
        <img src={arrowBack} />
        <p className="font-medium text-base leading-6  ">
          Back to Equipment
        </p>
      </Link>
      <hr className="mt-7" />
      <div className="main-content_css pl-8 pr-16 flex">
        <div className='w-3/4 mt-6'>
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
        </div>
        <div className="w-1/4 pl-4 mt-16 border border-solid border-gray-800 pr-8 pt-8  h-fit  pb-3">  {/* This is the new second column. */}
          <div className='flex justify-end'>
            <button
              className="text-white py-4 px-8 rounded-lg leading-4 btn_css float-right mb-4"
              type="button"
              onClick={() => openEditPage()}
            >
              Edit
            </button>
          </div>
          <div className='flex justify-between'>
            {selectedequipment === 'truck' ? (
              <>
                <img src={TruckImage} />
              </>
            ) : (
              <>
                <img src={TrailerImage} />
              </>
            )}
            <div className='flex flex-col justify-evenly'>
              <div>
                <h5 className='text-pirmaryColor font-semibold text-2xl'> {selectedequipment === 'truck' ? 'Truck Number' : 'Trailer Number'}</h5>
                <p className='text-blue-gray-600 font-semibold text-base'>{equipmentData.number}</p>
              </div>
              <div>
                <h5 className='text-pirmaryColor font-semibold text-2xl'> Model Year</h5>
                <p className='text-blue-gray-600 font-semibold text-base'>{equipmentData.model}</p>
              </div>
            </div>
          </div>
          <div className='flex justify-evenly mt-12'>
            <TruckIcon1 />
            <TruckIcon2 />
            <TruckIcon3 />
            <TruckIcon4 />
          </div>
          <hr className='mt-10' />
          <div className='overflow-auto info-div'>
            <div className='flex justify-between items-baseline'>
              <p className='text-primarytext font-medium  mt-10'>Status</p>
              <p className='text-blue-gray-600 text-base leading-4 '>{equipmentData.status}</p>
            </div>
            <div className='flex justify-between items-baseline'>
              <p className='text-primarytext  font-medium  mt-6'>
                {selectedequipment === 'truck' ? 'Truck ID Number' : 'Trailer ID Number'}
              </p>
              <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.vehicle_number}</p>
            </div>
            <div className='flex justify-between items-baseline'>
              <p className='text-primarytext  font-medium mt-6'>License Plate State/Province</p>
              <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.license}</p>
            </div>
            <div className='flex justify-between items-baseline'>
              <p className='text-primarytext  font-medium  mt-6'>Length</p>
              <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.length}</p>
            </div>
            <div className='flex justify-between items-baseline' >
              <p className='text-primarytext  font-medium  mt-6'>Height</p>
              <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.height}</p>
            </div>
            <div className='flex justify-between items-baseline'>
              <p className='text-primarytext  font-medium mt-6 '>Width</p>
              <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.width}</p>
            </div>
            {selectedequipment === 'truck' ? (
              <>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium  mt-6'>Unloaded Truck weight</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.unloaded_weight}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium  mt-6'>IRP Registered?</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.irp_registered}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium mt-6'>IRP account number</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.irp_account}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium mt-6'>IFTA Registered?</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.ifta_registered}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium mt-6'>IFTA account number</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.ifta_account}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium mt-6'>PUC Oregon</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.puc_oregon}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium mt-6'>Combine weight</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.combine_weight}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium mt-6'>Net weight</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.net_weight}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium mt-6'>Fuel Interface</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.fuel_interface}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium mt-6'>EDI equipment</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.edi_equipment}</p>
                </div>
                <div className='flex flex-col'>
                  <p className='text-primarytext  font-medium mt-6 pb-4'>Notes</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.notes}</p>
                </div>
              </>
            ) : (
              <>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium  mt-6'>Laden Weight</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.laden_weight}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium  mt-6'>Door Style</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.door_style}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium  mt-6'>Generator Information</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.generator_information}</p>
                </div>
                <div className='flex justify-between items-baseline'>
                  <p className='text-primarytext  font-medium  mt-6'>Unloaded Trailer weight</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.unloaded_weight}</p>
                </div>
                <div className='flex flex-col'>
                  <p className='text-primarytext  font-medium mt-6 pb-4'>Notes</p>
                  <p className='text-blue-gray-600 text-base leading-4'>{equipmentData.notes}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentDashboard;