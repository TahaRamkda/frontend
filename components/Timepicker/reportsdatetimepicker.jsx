import React from "react";



const ReportsDatetimepicker = ({ label, value, onChange, className = "", minDate, ...props }) => {
  const inputRef = React.useRef(null);

  const handleClick = () => {
    inputRef.current.showPicker();
  };

  const today = getToday();
  const defaultValue = value || (label === "From Date" ? getMonthStart() : getToday());

  return (
    <div className={`flex flex-col space-y-1 text-start ${className}`}>
      {label && <label className="font-medium text-gray-700 text-sm">{label}</label>}
      <div className="relative">
        <input
          ref={inputRef}
          type="date"
          value={defaultValue}
          min={minDate || (label === "From Date" ? getMonthStart() : "")}
          max={today}
          onChange={(e) => onChange(e.target.value)}
          onClick={handleClick}
          className="border rounded py-1 px-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          style={{ color: defaultValue ? "inherit" : "#999" }}
          {...props}
        />
      </div>
    </div>
  );
};

export default ReportsDatetimepicker;