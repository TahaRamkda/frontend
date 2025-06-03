import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import Loader from "../Layout/Loader";
import $ from 'jquery';
import Select from 'react-select';
import { fetchFlowDropdown, clearFlowDropdownState } from "@/slices/DropdownSlice";

export const FlowsDropdown = ({ onChange }) => {
  const dispatch = useDispatch();
  const { flowDropdownData, loading, error } = useSelector((state) => state.dropdown);
  const [selectedFlowId, setSelectedFlowId] = useState([]);
  const [searchString, setSearchString] = useState("");
  const selectRef = useRef(null);

  // Fetch flows when the component mounts
  useEffect(() => {
    dispatch(fetchFlowDropdown({ clientId: localStorage.getItem("clientId"), searchStr: searchString }));

  }, [dispatch]);

  // Notify parent of selected template changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedFlowId);
    }
  }, [selectedFlowId, onChange]);

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedFlowId(selectedIds);
  };
 const Options = flowDropdownData?.map(template => ({
    value: template.id,
    label: template.name
  })) || [];

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  // Filter out the selected flows from the available options

  return (
    <>
      <div>
      <Select
        id="flowSelect"
        value={Options.filter(option => selectedFlowId.includes(option.value))}
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

export default FlowsDropdown;
