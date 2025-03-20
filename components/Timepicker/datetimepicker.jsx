import React from "react";
export const getMonthStart = () => {
  const date = new Date();
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1))
    .toISOString()
    .split("T")[0];
};

export const getToday = () => {
  return new Date().toISOString().split("T")[0];
};
const DateTimePicker = ({ label, value, onChange, className = "",minDate, ...props }) => {
  const inputRef = React.useRef(null);

  const handleClick = () => {
    inputRef.current.showPicker();
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className={`flex flex-col space-y-1 text-start ${className}`}>
      {label && <label className="font-medium text-gray-700 text-sm">{label}</label>}
      <div className="relative">
        <input
          ref={inputRef}
          type="date"
          value={value}
          min={minDate || ""} // Use minDate if provided, otherwise no minimum
          max={today}
          onChange={(e) => onChange(e.target.value)}
          onClick={handleClick}
          className="border rounded py-1 px-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          style={{ 
            // Hide the default browser UI that shows the icon separately
            color: value ? 'inherit' : '#999', // Better visibility for placeholder
          }}
          {...props}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;