import React, { useRef } from 'react';
import './UploadButton.css';

export default function UploadButton({ onFileSelect, accept, multiple = false }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect?.(multiple ? Array.from(files) : files[0]);
    }
  };

  return (
    <>
      <button className="upload-button" onClick={handleClick}>
        上传文件
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
};