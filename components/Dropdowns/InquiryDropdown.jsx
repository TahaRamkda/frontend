import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { customStyles } from '@/utils/constants';
import Loader from '../Layout/Loader';
import { fetchEnquiryDrop, clearEnquiryDropState } from '@/slices/DropdownSlice';
const EnquiryDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const { enquiryDropdownData, loading, error } = useSelector((state) => state.dropdown);
  const [SearchStr, setSearchStr] = useState("")

  useEffect(() => {
    dispatch(fetchEnquiryDrop({ clientId: localStorage.getItem('clientId') }));
  }, [dispatch]);

 const options = Array.isArray(enquiryDropdownData) ?
 enquiryDropdownData?.map((item) => ({
    value: item.enquiryId,
    label: item.name,
  })) : [];

  const selectedOption = options.find((opt) => opt.value === value) || 0;

  const handleChange = (selected) => {
    
    const selectedValue = selected ? selected.value : 0;
    onChange({ target: { name, value: selectedValue } });
    
  };
  
  if (loading) return <Loader />;


  return (
    <div>
      <Select
        name={name}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder="Select"
        styles={customStyles}
        isClearable
        classNamePrefix="react-select"
        noOptionsMessage={() => "No record found"}
      />
    </div>
  );
};

export default EnquiryDropdown;
