import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import Loader from '../Layout/Loader';
import 'select2/dist/js/select2.min.js';
import { fetchSurveyDropdown } from '@/slices/ReportSlice';
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const AgentDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const {SurveyDropdown,loading,error} = useSelector((state) => state.reports);
  const [searchString, setsearchString] = useState("")
  const [SenderId, setSenderId] = useState(0)

  useEffect(() => {
    dispatch(fetchSurveyDropdown({}));

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
  }, [SurveyDropdown, onChange]);

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
        className='focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        required
      >
        <option value="0">Select</option>
        {SurveyDropdown && SurveyDropdown.length > 0 ? (
          SurveyDropdown.map((Survey) => (
            <option key={Survey.id} value={Survey.id}>
              {Survey.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>
    </div>
  );
};

export default AgentDropdown;
