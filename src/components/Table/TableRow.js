import React from 'react';
import EditIcon from "../../assets/icons/EditIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";

const TableRow = ({ row, onEdit , onDelete }) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(row.id);
    }
  };
    
      const handleDelete = () => {
        console.log("gfgfg")
        if (onDelete) {
          onDelete(row.id);
        }
      };
      return (
        <tr >
          {Object.entries(row)
        .filter(([key]) => key !== 'id')
        .map(([key, value], index) => (
          <td key={index} className=" px-4 py-2  text-center">
            {value}
          </td>
        ))}
          <td className=" px-4 py-2 text-center">
            <button onClick={handleEdit} className="text-blue-500">
            <EditIcon height="1.5rem" width="1.5rem"  />
            </button>
            <button onClick={handleDelete} className="text-red-500 ml-4">
            <DeleteIcon height="1.5rem" width="1.5rem" />
            </button>
          </td>
        </tr>
      );
    };

export default TableRow;
