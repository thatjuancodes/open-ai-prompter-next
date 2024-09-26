import { useEffect, useState } from "react"

const TextArea = ({
  label = 'Enter a value here',
  value,
  className,
  onChange = () => {},
  onKeyDown = () => {},
} : TextInputProps) => {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (e) => {
    setCurrentValue(e.target.value)
    onChange(e.target.value)
  }

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  return (
    <div className='w-full mt-5'>
      <textarea
        rows={4}
        className={`${className} w-full border border-gray-300 rounded p-5 resize-none`}
        value={currentValue}
        onChange={handleChange}
        placeholder={label}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

export default TextArea