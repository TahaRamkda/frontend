import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Loader from "../Layout/Loader";
import {
  fetchTemplatesDrop,
  clearTemplateDropState,
} from "@/slices/DropdownSlice";

const TemplateDropdown = ({ name, value, onChange, TransactionType }) => {
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
      })
    );
  }, [dispatch, transactionType]);
  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid #D1D5DB",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none",
      "&:hover": {
        borderColor: "#3B82F6",
      },
      minHeight: "2.5rem",
      outline: "none",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      outline: "none",
      boxShadow: "none",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3B82F6"
        : state.isFocused
        ? "#DBEAFE"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#111827",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
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
        styles={customStyles}
        classNamePrefix="react-select"
        noOptionsMessage={() => "No record found"}
      />
    </div>
  );
};

export default TemplateDropdown;
