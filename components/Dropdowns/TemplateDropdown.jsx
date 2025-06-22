import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Loader from "../Layout/Loader";
import { customStyles } from '@/utils/constants';
import {
  fetchTemplatesDrop,
  clearTemplateDropState,
} from "@/slices/DropdownSlice";
const TemplateDropdown = ({ name, value, onChange, TransactionType, SenderId }) => {
  const dispatch = useDispatch();
  const { templateDropdownData, loading, error } = useSelector(
    (state) => state.dropdown
  );
  const [transactionType, settransactionType] = useState(0);
  
  useEffect(() => {
    
    if (TransactionType) {
      settransactionType(TransactionType);
    }
  }, [TransactionType]);
 const options = Array.isArray(templateDropdownData)
  ? templateDropdownData.map((item) => ({
      value: item.id,
      label: item.name,
    }))
  : [];
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (selected) => {
    
    const selectedValue = selected ? selected.value : "0";
    onChange({ target: { name, value: selectedValue } });
  };

  useEffect(() => {
    dispatch(
      fetchTemplatesDrop({
        clientId: localStorage.getItem("clientId"),
        TransactionType: transactionType,
        senderId: SenderId,
      })
    );
  }, [dispatch, transactionType, SenderId]);


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
        styles={customStyles}
        isClearable
        classNamePrefix="react-select"
        noOptionsMessage={() => "No record found"}
      />
    </div>
  );
};

export default TemplateDropdown;
