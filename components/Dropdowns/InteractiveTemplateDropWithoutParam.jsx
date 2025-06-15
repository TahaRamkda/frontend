import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import Loader from "../Layout/Loader";
import { fetchInteractiveTemplateDropWithoutParam,clearInteractiveTemplateDropStateState } from "@/slices/DropdownSlice";
import { FormGroup, Label, Input, FormText } from "reactstrap";
import { customStyles } from '@/utils/constants';
const InteractiveTemplateDropdown = ({ name, value, onChange, TransactionType, SenderId }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { interactiveTempWithoutParamDropdownData, loading, error } = useSelector(
    (state) => state.dropdown
  );
  const [transactionType, settransactionType] = useState(0);

  useEffect(() => {
    if (TransactionType) {
      settransactionType(TransactionType);
    }
  }, [TransactionType]);

  useEffect(() => {
    dispatch(
        fetchInteractiveTemplateDropWithoutParam({
            clientId: localStorage.getItem("clientId"),
            senderId: SenderId
      })
    );
  }, [dispatch, transactionType]);

  const options = Array.isArray(interactiveTempWithoutParamDropdownData)?
  interactiveTempWithoutParamDropdownData?.map((item) => ({
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
        styles={customStyles}
        classNamePrefix="react-select"
        noOptionsMessage={() => "No record found"}
      />
    </div>
  );
};

export default InteractiveTemplateDropdown;

