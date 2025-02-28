import React from "react";

const SearchBar = ({ label, value, onChange, className = "", ...props }) => {
  return (
    <div className={`flex flex-col mb-1  text-start ${className}`}>
      {label && <label className="font-medium text-gray-700 text-sm">{label}</label>}
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded py-1 px-2 w-full mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        {...props}
      />
    </div>
  );
};

export default SearchBar;


















