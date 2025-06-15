import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layout/Loader";
import Select from "react-select";
import { fetchlanguage } from "@/slices/DropdownSlice";
import { customStyles } from '@/utils/constants';
const LanguageDropdown = ({ name, value, onChange, disabled }) => {
  const dispatch = useDispatch();
  const { languages, loading, error } = useSelector((state) => state.dropdown);

  useEffect(() => {
    dispatch(fetchlanguage({}));
  }, [dispatch]);

  const options = Array.isArray(languages) ?
    languages?.map((item) => ({
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
        styles={customStyles}
        classNamePrefix="react-select"
        noOptionsMessage={() => "No record found"}
      />
    </div>
  );
};

export default LanguageDropdown;
