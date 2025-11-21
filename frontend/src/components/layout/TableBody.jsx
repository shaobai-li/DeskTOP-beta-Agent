import React from 'react';
import './TableBody.css';
import moreIcon from '@assets/icon-ui-ellipsis-horizontal.png'

function TableBody({ data }) {
  return (
    <tbody>
      {data.map((row, i) => (
        <tr key={i}>

          {Object.values(row)
            .slice(1)
            .map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}

          <td className="action-cell">
            <img src={moreIcon} alt="more" className="more-icon" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;
