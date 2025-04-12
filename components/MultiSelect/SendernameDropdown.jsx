import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Loader from '../Layout/Loader';        
import { fetchSendernamesDrop, clearSendernameDropState } from "@/slices/sendernameSlice";


const SendernamesDropdown = ({ name, value, onChange, error, existingdata  }) => {
  const dispatch = useDispatch();
  const { sendernameDrop, loading, error: fetchError } = useSelector((state) => state.sendernames);
  const selectRef = useRef(null);
  const [selectedSenderId, setSelectedSenderId] = useState([]);

  useEffect(() => {
    dispatch(fetchSendernamesDrop({ clientId: localStorage.getItem("clientId") }));
  }, [dispatch]);

  // Effect to notify parent component when selected agent changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedSenderId);
    }
  }, [selectedSenderId, onChange]);
  
  useEffect(() => {
      if(existingdata){
        setSelectedSenderId(existingdata || [])
      }
    }, [existingdata]);
  

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedSenderId(selectedIds);
  };
 const Options = sendernameDrop?.map(sendername => ({
    value: sendername.id,
    label: sendername.name
  })) || [];

  // Handle select/deselect seder (via select2)
 
  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading  {error}</p>;

  // Filter out the selected groups from the available options
  const availableSenders = sendernameDrop.filter(
    (sendernameDrop) => !selectedSenderId.includes(sendernameDrop.senderId)
  );

  return (
    <>
      <div className="mb-4">
      <Select
        id="agentSelect"
        name={name}
        value={Options.filter(option => selectedSenderId.includes(option.value))}
        onChange={handleSelectChange}
        options={Options}
        isMulti
        isSearchable
        placeholder="Select"
        noOptionsMessage={() => "No records found"}
        className="border border-gray-300 rounded-lg text-sm"
        required
      />
      </div>
    </>
  );
};

export default SendernamesDropdown;
