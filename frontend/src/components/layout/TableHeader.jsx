import React from 'react';
function TableHeader({ headers }) {
  return (
    <thead>
      <tr>
        {headers.map(header => (
          <th key={header}>
            {header.charAt(0).toUpperCase() + header.slice(1).replace('_', ' ')}
          </th>
        ))}
        <th style={{ width: 48 }}></th>
      </tr>
    </thead>
  );
}

export default TableHeader;