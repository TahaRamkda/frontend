import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Loader from '../Layout/Loader';
import { customStyles } from '@/utils/constants';
import { fetchSendernamesDrop } from '@/slices/DropdownSlice';
const SendernameDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const [selectedSenderId, setSelectedSenderId] = useState(0);
  const { sendernameDrop, loading, error } = useSelector((state) => state.dropdown);

  useEffect(() => {
    dispatch(fetchSendernamesDrop({ clientId: localStorage.getItem('clientId') }));
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  // Format sendername data for react-select
  const options = Array.isArray(sendernameDrop)?
  sendernameDrop?.map((item) => ({
    value: item.id,
    label: item.name,
  })) : [];

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (selected) => {
    const label = selected ? selected.label : '';
    const selectedValue = selected ? selected.value : '0';
    setSelectedSenderId(selectedValue);
    onChange({ target: { name, value: selectedValue, label: label } });
  };


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

export default SendernameDropdown;