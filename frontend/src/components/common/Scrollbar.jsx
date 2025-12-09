import React from 'react';

const Scrollbar = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={`overflow-y-auto overflow-x-hidden ${className}
        scrollbar scrollbar-thumb-rounded-full
        scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600
        scrollbar-track-transparent
        hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500
        scrollbar-w-2
      `}

      style={{
        contain: 'none',              // 关键第1行
        overscrollBehavior: 'none',   // 关键第2行（防止穿透滚动）
        overflow: 'auto',             // 关键第3行
      }}
      // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
      {...rest}
    >
      {children}
    </div>
  );
};

export default Scrollbar;