import React from "react";

const DateTimePicker = ({ label, value, onChange, className = "", ...props }) => {
  return (
    <div className={`flex flex-col space-y-1 text-start ${className}`}>
      {label && <label className="font-medium text-gray-700 text-sm">{label}</label>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded py-1 px-2 w-full text-sm appearance-none "
        {...props}
      />
    </div>
  );
};

export default DateTimePicker;
