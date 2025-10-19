import { useState } from 'react'
import Checkmark from './Checkmark'
import './PageSizeSelect.css'


export default function PageSizeSelect({ options, defaultValue }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="custom-select">
      <div
        className="select-display"
        onClick={() => setOpen(!open)}
      >
        <span className="select-value">{value}</span>
        <span className="select-arrow">∨</span>
      </div>

      {open && (
        <div className="select-dropdown">
          {options.map((opt) => (
            <div
              key={opt}
              className="select-option"
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
