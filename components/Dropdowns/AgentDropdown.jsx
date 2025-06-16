import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Layout/Loader';
import Select from 'react-select';
import { fetchAgentsDrop } from '@/slices/DropdownSlice';
const AgentDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { agentDropList, loading, error } = useSelector((state) => state.dropdown);
  const [searchString, setsearchString] = useState("")
  const [SenderId, setSenderId] = useState(0)

  useEffect(() => {
    dispatch(fetchAgentsDrop({ clientId: localStorage.getItem("clientId"), searchStr: searchString, senderId: SenderId }));

  }, [dispatch]);

 const options = Array.isArray(agentDropList) ?
 agentDropList?.map((item) => ({
    value: item.id,
    label: item.name,
  })) : [];

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (selected) => {
    const selectedValue = selected ? selected.value : '0';
    onChange({ target: { name, value: selectedValue } });
  };

  // Inline styles for react-select


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

export default AgentDropdown;
