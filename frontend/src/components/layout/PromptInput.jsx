import { useState, useEffect } from 'react'
import '@components/layout/PromptInput.css'
import Button from '@components/common/Button'

function PromptInput({ title, value, placeholder, onConfirm = null, onChange = null }) {

  const [newValue, setNewValue] = useState(value)
  const [originValue, setOriginValue] = useState(value)
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    setNewValue(value)
    setOriginValue(value)
  }, [value])

  const handleChange = (e) => {
    setNewValue(e.target.value)
    setDisabled(false)
  }

  const handleCancel = () => {
    setNewValue(originValue)
    setDisabled(true)
  }

  const handleConfirm = () => {
    setOriginValue(newValue)
    setDisabled(true)
    onConfirm && onConfirm(newValue)
  }

  return (
    <div className="prompt-input-container">
      <div className="prompt-input-label-row">
        <label className="prompt-input-label">{title}</label>
        <div className="prompt-input-buttons">
          <Button text="回退" disabled={disabled} onClick={handleCancel} />
          <Button text="保存" disabled={disabled} onClick={handleConfirm} />
        </div>
      </div>
      <textarea
        className="prompt-input-textarea"
        value={newValue}
        onChange={handleChange}
        placeholder={placeholder}
        rows={6}
      />
    </div>
  )
}

export default PromptInput

