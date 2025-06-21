import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Loader from '../Layout/Loader';
import { customStyles } from '@/utils/constants';
import { fetchSurveyDropdown } from '@/slices/ReportSlice';
import { FormGroup, Label, Input, FormText } from 'reactstrap';
const SurveyDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const {SurveyDropdown,loading,error} = useSelector((state) => state.reports);
  const [searchString, setsearchString] = useState("")
  const [SenderId, setSenderId] = useState(0)

  useEffect(() => {
    dispatch(fetchSurveyDropdown({}));

  }, [dispatch]);

 const options = Array.isArray(SurveyDropdown) ?
 SurveyDropdown?.map((item) => ({
    value: item.id,
    label: item.name,
  })) : [];

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (selected) => {
    const selectedValue = selected ? selected.value : '0';
    setSelectedSenderId(selectedValue);
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

export default SurveyDropdown;
