import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import Loader from "../Layout/Loader";
import $ from 'jquery';
import Select from 'react-select';
import { fetchTemplatesDrop, clearTemplateDropState } from "@/slices/DropdownSlice";

export const TemplatesDropdown = ({ onChange, SenderId }) => {
  const dispatch = useDispatch();
  const { templateDropdownData, loading, error } = useSelector((state) => state.dropdown);
  const [selectedTemplateId, setSelectedTemplateId] = useState([]);
  const [searchString, setsearchString] = useState("")
  const [transactionType, settransactionType] = useState(0)
  const selectRef = useRef(null);

  // Fetch templates when the component mounts
  useEffect(() => {
    dispatch(fetchTemplatesDrop({ clientId: localStorage.getItem("clientId"), TransactonType: transactionType, senderId: SenderId }));

  }, [dispatch, SenderId, transactionType]);
const Options = Array.isArray(templateDropdownData)
  ? templateDropdownData.map((item) => ({
      value: item.id,
      label: item.name,
    }))
  : [];
  // Notify parent of selected template changes
  useEffect(() => {
  const selectedOptions = Options.filter(option =>
    selectedTemplateId.includes(option.value)
  );
  if (onChange) {
    onChange(selectedOptions); // ✅ Send the full selected option objects
  }
}, [selectedTemplateId, onChange, Options]);


  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedTemplateId(selectedIds);
  };
 

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
