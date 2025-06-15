import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Layout/Loader';
import Select from 'react-select';
import { fetchActiveAgentsDrop, cleaActiveAgenDroptState } from '@/slices/DropdownSlice';
import { customStyles } from '@/utils/constants';
const ActiveAgentDropdown = ({ name, value, onChange,SenderId }) => {
 

   const dispatch = useDispatch();
  const { activeAgentDropList, loading, error } = useSelector((state) => state.dropdown);

   useEffect(() => {
    dispatch(fetchActiveAgentsDrop({ clientId: localStorage.getItem("clientId"), senderId:SenderId  }));

  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  // Format sendername data for react-select
  const options = Array.isArray(activeAgentDropList) ?
   activeAgentDropList?.map((item) => ({
    value: item.id,
    label: item.name,
  })) : [];

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (selected) => {
    const selectedValue = selected ? selected.value : '0';
    onChange({ target: { name, value: selectedValue } });
  };

  // Inline styles for react-select
 


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

export default ActiveAgentDropdown;

