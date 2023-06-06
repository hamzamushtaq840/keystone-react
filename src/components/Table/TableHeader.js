import React from 'react';

const TableHeader = ({ headers }) => {
  return (
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={index} className="px-4 py-2 commodity_table text-base h-12 font-semibold">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
