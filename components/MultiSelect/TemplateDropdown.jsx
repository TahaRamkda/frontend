import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import Loader from "../Layout/Loader";
import $ from 'jquery';
import Select from 'react-select';
import { fetchTemplatesDrop, clearTemplateDropState } from "@/slices/TemplateSlice";

export const TemplatesDropdown = ({ onChange }) => {
  const dispatch = useDispatch();
  const { templateDropdownData, loading, error } = useSelector((state) => state.templates);
  const [selectedTemplateId, setSelectedTemplateId] = useState([]);
  const [searchString, setsearchString] = useState("")
  const [transactionType, settransactionType] = useState(0)
  const selectRef = useRef(null);

  // Fetch templates when the component mounts
  useEffect(() => {
    dispatch(fetchTemplatesDrop({ clientId: localStorage.getItem("clientId"), TransactonType: transactionType }));

  }, [dispatch]);

  // Notify parent of selected template changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedTemplateId);
    }
  }, [selectedTemplateId, onChange]);

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedTemplateId(selectedIds);
  };
 const Options = templateDropdownData?.map(template => ({
    value: template.id,
    label: template.name
  })) || [];

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  // Filter out the selected templates from the available options

  return (
    <>
      <div>
      <Select
        id="agentSelect"
        value={Options.filter(option => selectedTemplateId.includes(option.value))}
        onChange={handleSelectChange}
        options={Options}
        isMulti
        isSearchable
        noOptionsMessage={() => "No records found"}
        placeholder="Select"
        className="border border-gray-300 rounded-lg text-sm"
        required
      />
      </div>
    </>
  );
};

export default TemplatesDropdown;
