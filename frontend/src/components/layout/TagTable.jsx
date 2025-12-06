import React from 'react';
// import './TagTable.css'
import TableHeader from './TableHeader';   
import TableBody from './TableBody';

function TagTable({ tags, onDelete, onEdit }) {
  
  const headers = ['标签名称', '标签描述', '创建时间', '更新时间'];
  const fields = ['name', 'description', 'createdAt', 'updatedAt'];

    return (
        <div className="table-wrapper">
          <table className="simple-table">
            <TableHeader headers={headers} />
            <TableBody data={tags} fields={fields} onDelete={onDelete} onEdit={onEdit} />
          </table>
        </div>
    );
};

export default TagTable;