import { useState } from 'react'
import Checkmark from './Checkmark'
import './PageSizeSelect.css'


export default function PageSizeSelect({ options, defaultValue }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="pagination__rowsize__select">
      <div
        className="pagination__rowsize__select__display"
        onClick={() => setOpen(!open)}
      >
        <span className="pagination__rowsize__select__value">{value}</span>
        <span className="pagination__rowsize__select__arrow">∨</span>
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
              }}
            >
              <span>{opt}</span>
              {value === opt && <Checkmark />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
