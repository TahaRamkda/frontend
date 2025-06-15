import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Loader from '../Layout/Loader';
import { fetchGroupsDrop, clearGroupDropState } from "@/slices/DropdownSlice";
import { customStyles } from '@/utils/constants';
const GroupDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const { groupDropdownData, loading, error } = useSelector((state) => state.dropdown);
  const [SearchStr, setSearchStr] = useState("")

  useEffect(() => {
    dispatch(fetchGroupsDrop({ clientId: localStorage.getItem('clientId') }));
  }, [dispatch]);

 const options = Array.isArray(groupDropdownData) ?
 groupDropdownData?.map((item) => ({
    value: item.id,
    label: item.name,
  })) : [];

  const selectedOption = options.find((opt) => opt.value === value) || 0;

  const handleChange = (selected) => {
    
    const selectedValue = selected ? selected.value : 0;
    onChange({ target: { name, value: selectedValue } });
    
  };
  
  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">Error loading: {error}</p>;

  return (
    <div>
      <Select
        name={name}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder="Select"
        isClearable
        styles={customStyles}
        classNamePrefix="react-select"
        noOptionsMessage={() => "No record found"}
      />
    </div>
  );
};

export default GroupDropdown;
