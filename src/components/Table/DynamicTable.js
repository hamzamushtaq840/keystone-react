import React from 'react';
import DataTable from 'react-data-table-component';
import EditIcon from "../../assets/icons/EditIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import MaintenanceIcon from "../../assets/icons/MaintainIcon";
import { useNavigate } from "react-router-dom";
import { setId, selectedEquipment } from '../../reducers/equipmentDashboard';
import { useDispatch } from 'react-redux';
const DynamicTable = ({ data, onEdit, onDelete, onChange, onMaintenance }) => {
  const navigate = useNavigate();
  let columns = []

  const dispatch = useDispatch();
  const customStyles = {
    rows: {
      style: {
        cursor: 'pointer', // change row cursor style here
      },
    },
  };
  console.log(onChange)
  if (onChange === "Commodity") {
    columns = [
      { name: 'Commodity Code', selector: 'CommodityCode', sortable: true },
      { name: 'Commodity Name', selector: 'CommodityName', sortable: true },
      { name: 'Commodity Group', selector: 'CommodityGroup', sortable: true },
      { name: 'Default Rate by', selector: 'DefaultRateby', sortable: true },
      { name: 'Commodity Status', selector: 'CommodityStatus', sortable: true },
      { name: 'GL Revenue Code', selector: 'GLRevenueCode', sortable: true },

      {
        name: 'Action',
        cell: row => (
          <>
            <button onClick={() => onEdit(row.id)} className="text-blue-500">
              <EditIcon />
            </button>
            <button onClick={() => onDelete(row.id)} className="text-red-500 ml-4">
              <DeleteIcon />
            </button>
          </>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      }
    ];
  } else if (onChange === "truck") {
    columns = [
      { name: 'Truck Number', selector: 'TruckNumber', sortable: true },
      { name: 'Truck Type', selector: 'TruckType', sortable: true },
      { name: 'Status', selector: 'Status', sortable: true },
      { name: 'Number of Axles', selector: 'NumberofAxles', sortable: true },
      { name: 'License Plate Number', selector: 'LicensePlateNumber', sortable: true },
      { name: 'License Plate State', selector: 'LicensePlateState', sortable: true },
      { name: 'IRP Registered', selector: 'IRPRegistered', sortable: true },


      {
        name: 'Action',
        cell: row => (
          <>
            <button onClick={() => onEdit(row.id)} className="text-blue-500">
              <EditIcon />
            </button>
            <button onClick={() => onDelete(row.id)} className="text-red-500 ml-4">
              <DeleteIcon />
            </button>
            <button onClick={() => onMaintenance(row)} className="text-red-500 ml-4">
              <MaintenanceIcon />
            </button>
          </>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      }
    ];
  }
  else if (onChange === "truckMaintenance") {
    columns = [
      { name: 'Truck Number', selector: 'TruckNumber', sortable: true },
      { name: 'Date', selector: 'Date', sortable: true },
      { name: 'Mileage', selector: 'Mileage', sortable: true },
      { name: 'Maintenance Type', selector: 'MaintenanceType', sortable: true },
      { name: 'Maintenance Performed By', selector: 'MaintenancePerformedBy', sortable: true },
      { name: 'Maintenance Performed', selector: 'MaintenancePerformed', sortable: true },
      { name: 'Location ', selector: 'Location', sortable: true },
      { name: 'Bill to', selector: 'Billto', sortable: true },
      { name: 'Amount', selector: 'Amount', sortable: true },


      {
        name: 'Action',
        cell: row => (
          <>
            <button onClick={() => onEdit(row)} className="text-blue-500">
              <EditIcon />
            </button>
            <button onClick={() => onDelete(row.id)} className="text-red-500 ml-4">
              <DeleteIcon />
            </button>
          </>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      }
    ];
  }
  else if (onChange === "trailerMaintenance") {
    columns = [
      { name: 'Trailer Number', selector: 'TrailerNumber', sortable: true },
      { name: 'Date', selector: 'Date', sortable: true },
      { name: 'Mileage', selector: 'Mileage', sortable: true },
      { name: 'Maintenance Type', selector: 'MaintenanceType', sortable: true },
      { name: 'Maintenance Performed By', selector: 'MaintenancePerformedBy', sortable: true },
      { name: 'Maintenance Performed', selector: 'MaintenancePerformed', sortable: true },
      { name: 'Location ', selector: 'Location', sortable: true },
      { name: 'Bill to', selector: 'Billto', sortable: true },
      { name: 'Amount', selector: 'Amount', sortable: true },


      {
        name: 'Action',
        cell: row => (
          <>
            <button onClick={() => onEdit(row)} className="text-blue-500">
              <EditIcon />
            </button>
            <button onClick={() => onDelete(row.id)} className="text-red-500 ml-4">
              <DeleteIcon />
            </button>
          </>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      }
    ];
  }
  else if (onChange === "driver") {
    columns = [
      { name: 'Driver Number', selector: 'DriverNumber', sortable: true },
      { name: 'Name', selector: 'Name', sortable: true },
      { name: 'Type', selector: 'Type', sortable: true },
      { name: 'Status', selector: 'Status', sortable: true },
      { name: 'Phone', selector: 'Phone', sortable: true },
      { name: 'Truck', selector: 'Truck', sortable: true },
      { name: 'Trailer ', selector: 'Trailer', sortable: true },
      { name: 'Payable to', selector: 'PayableTo', sortable: true },
      { name: 'Email', selector: 'Email', sortable: true },


      {
        name: 'Action',
        cell: row => (
          <>
            <button onClick={() => onEdit(row.id)} className="text-blue-500">
              <EditIcon />
            </button>
            <button onClick={() => onDelete(row.id)} className="text-red-500 ml-4">
              <DeleteIcon />
            </button>
          </>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      }
    ];
  }
  else if (onChange === "document") {
    columns = [
      { name: 'Name', selector: 'name', sortable: true },
      { name: 'Exp Date', selector: 'validaty_end_date', sortable: true },
      {
        name: 'Attachments',
        selector: 'Attachments',
        cell: row => (
          <div>
            <a
              href={row.Attachments}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Document
            </a>
          </div>
        ),
        sortable: true,
      },


      {
        name: 'Action',
        cell: row => (
          <>
            <button onClick={() => onEdit(row.id)} className="text-blue-500">
              <EditIcon />
            </button>
            <button onClick={() => onDelete(row.id)} className="text-red-500 ml-4">
              <DeleteIcon />
            </button>
          </>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      }
    ];
  }
  else if (onChange === "trailer") {
    columns = [
      { name: 'Trailer Number', selector: 'TrailerNumber', sortable: true },
      { name: 'Trailer Type', selector: 'TrailerType', sortable: true },
      { name: 'Trailer ID number', selector: 'TrailerIDnumber', sortable: true },
      { name: 'Status', selector: 'Status', sortable: true },
      { name: 'Number of Axles', selector: 'NumberofAxles', sortable: true },
      { name: 'License Plate Number', selector: 'LicensePlateNumber', sortable: true },
      { name: 'License Plate State', selector: 'LicensePlateState', sortable: true },
      { name: 'Generator information', selector: 'Generatorinformation', sortable: true },
      { name: 'Door Style', selector: 'DoorStyle', sortable: true },



      {
        name: 'Action',
        cell: row => (
          <>
            <button onClick={() => onEdit(row.id)} className="text-blue-500">
              <EditIcon />
            </button>
            <button onClick={() => onDelete(row.id)} className="text-red-500 ml-4">
              <DeleteIcon />
            </button>
            <button onClick={() => onMaintenance(row)} className="text-red-500 ml-4">
              <MaintenanceIcon />
            </button>
          </>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      }
    ];
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClicked={(row, event) => {
        if (onChange === "truck" || onChange === "trailer") {
          dispatch(setId(row.id))
          dispatch(selectedEquipment(onChange))

          navigate('/equipmentdashboard');
        }
      }
      }
      customStyles={customStyles}
      pagination
      responsive
      highlightOnHover

    />
  );
};

export default DynamicTable;
