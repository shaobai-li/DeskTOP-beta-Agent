import { useState, useEffect, useRef } from 'react'
import expandArrow from '../../assets/icons8-expand-arrow-52.png';
import checkMark from './icons8-done.svg'
import './PageSizeSelect.css'


export default function PageSizeSelect({ options, defaultValue, onValueChange }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    // 只在下拉菜单打开时添加监听器
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // 清理函数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="pagination__rowsize__select" ref={selectRef}>
      <div
        className="pagination__rowsize__select__display"
        onClick={() => setOpen(!open)}
      >
        <span className="pagination__rowsize__select__value">{value}</span>
        <img src={expandArrow} alt="expandArrow" className="pagination__rowsize__select__arrow" />
      </div>

      {open && (
        <div className="pagination__rowsize__select__dropdown">
          {options.map((opt) => (
            <div
              key={opt}
              className="pagination__rowsize__select__option"
              onClick={() => {
                setValue(opt);
                setOpen(false);
                if (onValueChange) {
                  onValueChange(opt);
                }
              }}
            >
              <span>{opt}</span>
              {value === opt && <img src={checkMark} alt="checkmark" className="pagination__rowsize__select__checkmark"/>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
