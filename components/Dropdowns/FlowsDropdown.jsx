import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import Loader from "../Layout/Loader";
import { fetchFlowDropdown, clearFlowDropdownState } from "@/slices/DropdownSlice";
const FlowDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { flowDropdownData, loading, error } = useSelector(
    (state) => state.dropdown
  );
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    dispatch(
        fetchFlowDropdown({
        clientId: localStorage.getItem("clientId"),
      })
    );

  }, [dispatch]);

 const options = Array.isArray(flowDropdownData) ?
 flowDropdownData?.map((item) => ({
    value: item.id,
    label: item.name,
  })) : [];

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (selected) => {
    const selectedValue = selected ? selected.value : '0';
    onChange({ target: { name, value: selectedValue } });
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  return (
    <div>
      
     <Select
        name={name}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder="Select"
        isClearable
        classNamePrefix="react-select"
        noOptionsMessage={() => "No record found"}
      />
    </div>
  );
};

export default FlowDropdown;

