import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import Loader from '../Layout/Loader';
import 'select2/dist/js/select2.min.js';
import { fetchlanguage, clearLanguageState } from '@/slices/MasterSlice';
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const LanguageDropdown = ({ name, value, onChange, disabled }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { languages, loading, error } = useSelector((state) => state.Master);

  useEffect(() => {
    dispatch(fetchlanguage({}));

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
  }, [languages, onChange]);

  if (loading) return <Loader />;
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
        {languages && languages.length > 0 ? (
          languages.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>
    </div>
  );
};

export default LanguageDropdown;
