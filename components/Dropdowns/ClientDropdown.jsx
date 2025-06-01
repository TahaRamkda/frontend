import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import Loader from '../Layout/Loader';
import Select from 'react-select';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchClientsDrop, clearClientDropState } from "@/slices/clientSlice";
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const ClientDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { clientsDropList, loading, error } = useSelector((state) => state.clients);
  const [searchString, setsearchString] = useState("");

  useEffect(() => {
    dispatch(fetchClientsDrop({ clientId: localStorage.getItem("clientId"), searchStr: searchString }));

  }, [dispatch]);

  const options = clientsDropList?.map((item) => ({
    value: item.id,
    label: item.name,
  })) || [];

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (selected) => {
    const selectedValue = selected ? selected.value : '0';
    onChange({ target: { name, value: selectedValue } });
  };

  // Inline styles for react-select
  const customStyles = {
  control: (base, state) => ({
    ...base,
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
    boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : 'none',
    '&:hover': {
      borderColor: '#3B82F6',
    },
    minHeight: '2.5rem',
    outline: 'none',
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    outline: 'none',
    boxShadow: 'none',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#3B82F6'
      : state.isFocused
      ? '#DBEAFE'
      : 'white',
    color: state.isSelected ? 'white' : '#111827',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#111827',
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
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
      />
    </FormGroup>
  );
};

export default ClientDropdown;
