import './PromptInput.css'

function PromptInput({ title, value, onChange, placeholder }) {
  return (
    <div className="prompt-input-container">
      <label className="prompt-input-label">{title}</label>
      <textarea
        className="prompt-input-textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={6}
      />
    </div>
  )
}

export default PromptInput

