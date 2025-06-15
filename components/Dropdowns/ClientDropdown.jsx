import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import Loader from '../Layout/Loader';
import Select from 'react-select';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchClientsDrop, clearClientDropState } from "@/slices/DropdownSlice";
import { FormGroup, Label, Input, FormText } from 'reactstrap';
import { customStyles } from '@/utils/constants';
const ClientDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { clientsDropList, loading, error } = useSelector((state) => state.dropdown);
  const [searchString, setsearchString] = useState("");

  useEffect(() => {
    dispatch(fetchClientsDrop({ clientId: localStorage.getItem("clientId"), searchStr: searchString }));

  }, [dispatch]);

  const options = Array.isArray(clientsDropList) ?
  clientsDropList?.map((item) => ({
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
    <FormGroup>
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
    </FormGroup>
  );
};

export default ClientDropdown;
