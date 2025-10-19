import './Checkmark.css'

function Checkmark() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="checkmark">
      <path
        d="M17 6L8 14L4 10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Checkmark;