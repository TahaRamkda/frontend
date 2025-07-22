import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Layout/Loader";
import Select from "react-select";
import { customStyles } from '@/utils/constants';
import { fetchlanguage } from "@/slices/DropdownSlice";
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

  const selectedOption = options.find((opt) => opt.value === value) || "";

  const handleChange = (selected) => {
    const selectedValue = selected ? selected.value : "";
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
        styles={customStyles}
        isClearable
        classNamePrefix="react-select"
        noOptionsMessage={() => "No record found"}
      />
    </div>
  );
};

export default LanguageDropdown;
