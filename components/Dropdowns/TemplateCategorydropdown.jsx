import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Layout/Loader';
import Select from 'react-select';
import { fetchtemplatecategory } from '@/slices/DropdownSlice';
const TemplateCategoryDropdown = ({ name, value, onChange, disabled }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { templateCategoryList, loading, error } = useSelector((state) => state.dropdown);

  useEffect(() => {
    dispatch(fetchtemplatecategory({}));

  }, [dispatch]);

 const options = Array.isArray(templateCategoryList)?
 templateCategoryList?.map((item) => ({
    value: item.id,
    label: item.name,
  })) : [];

  const selectedOption = options.find((opt) => opt.value === value) || 0;

  const handleChange = (selected) => {
    
    const selectedValue = selected ? selected.value : 0;
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
        classNamePrefix="react-select"
        noOptionsMessage={() => "No record found"}
      />
    </div>
  );
};

export default TemplateCategoryDropdown;


