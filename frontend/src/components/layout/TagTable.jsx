import React from 'react';
import './TagTable.css'
import TableHeader from './TableHeader';   
import TableBody from './TableBody';

function TagTable({ tags }) {
  
  const headers = ['标签名称', '标签描述', '创建时间', '更新时间'];
  console.log(tags);
    return (
        <div className="table-wrapper">
          <table className="simple-table">
            <TableHeader headers={headers} />
            <TableBody data={tags} />
          </table>
        </div>
    );
};

export default TagTable;