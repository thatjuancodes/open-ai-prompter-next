import { useEffect, useState } from "react";

const TextInput = ({
  label = 'Enter a value here',
  value,
  className,
  type = 'text',
  onChange = () => {},
  onKeyDown = () => {},
} : TextInputProps) => {
  const [currentValue, setCurrentValue] = useState(value)

  const handleChange = (e) => {
    setCurrentValue(e.target.value);
    onChange(e.target.value);
  };

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <div className='w-full mt-5'>
      <input
        type={type}
        className={`${className} w-full border border-gray-300 rounded p-5`}
        value={currentValue}
        onChange={handleChange}
        placeholder={label}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

export default TextInput