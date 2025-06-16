import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'reactstrap';
import Loader from '../Layout/Loader';
import Select from "react-select";
import { fetchRolesDrop, clearRoleDropState } from "@/slices/DropdownSlice";
const RoleDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const { roleDrop, loading, error } = useSelector((state) => state.dropdown);

  useEffect(() => {
    dispatch(fetchRolesDrop({ clientId: localStorage.getItem("clientId") }));

  }, [dispatch]);

  const options = Array.isArray(roleDrop) ?
    roleDrop?.map((item) => ({
      value: item.id,
      label: item.name,
    })) : [];

  const selectedOption = options.find((opt) => opt.value === value) || 0;

  const handleChange = (selected) => {
    debugger
    const selectedValue = selected ? selected.value : 0;
    onChange({ target: { name, value: selectedValue } });
  };


  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">Error loading: {error}</p>;

  return (
    <div className="">

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

export default RoleDropdown;
