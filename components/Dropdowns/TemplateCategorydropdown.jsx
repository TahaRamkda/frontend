import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchtemplatecategory, cleaTemplateCategoryState } from '@/slices/MasterSlice';
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const TemplateCategoryDropdown = ({ name, value, onChange, disabled }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { templatecategory, loading, error } = useSelector((state) => state.Master);
  const [searchString, setsearchString] = useState("")

  useEffect(() => {
    dispatch(fetchtemplatecategory({}));

  }, [dispatch]);

  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: 'Select',
        allowClear: true,
      });

      $(selectRef.current).on('change', (e) => {
        let selectedValue = e.target.value;
        if (!selectedValue) {
          selectedValue = "0";
        }
        onChange({ target: { name, value: selectedValue } });
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off('change');
      }
    };
  }, [templatecategory, onChange]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  return (
    <div>
      <Input
        type="select"
        innerRef={selectRef}
        name={name}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
      >
        <option value="0">Select</option>
        {templatecategory && templatecategory.length > 0 ? (
          templatecategory.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>
    </div>
  );
};

export default TemplateCategoryDropdown;
