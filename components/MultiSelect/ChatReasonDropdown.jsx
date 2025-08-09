import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Loader from "../Layout/Loader";
import { fetchAppSettingDrop } from "@/slices/DropdownSlice";
import { FormGroup, Label, Input, FormText } from "reactstrap";
import { cli } from "winston/lib/winston/config";

const ChatReasonDropdown = ({ name, value, onChange, existingdata }) => {
  const dispatch = useDispatch();
 const { appSettingDropdownData, loading, error } = useSelector((state) => state.dropdown);
  const [selectedId, setSelectedId] = useState([]);

  const [senderId, setSenderId] = useState(0);

  // Effect to fetch agents when search string or senderId changes
  useEffect(() => {
    dispatch(fetchAppSettingDrop({ keyName: "chatreason"}));
  }, [dispatch]);

  // Effect to notify parent component when selected agent changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedId);
    }
  }, [selectedId, onChange]);

  useEffect(() => {
    if (existingdata) {
      setSelectedId(existingdata || []);
    }
  }, [existingdata]);
  // Mapping the fetched agent data into the format that react-select expects
  const Options =
    appSettingDropdownData.map((reason) => ({
      value: reason.id,
      label: reason.name,
    })) || [];

  // Handle when selection changes
  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setSelectedId(selectedIds);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  return (
    <div>
      <Select
        id="reasonSelect"
        name={name}
        value={Options.filter((option) => selectedId.includes(option.value))}
        onChange={handleSelectChange}
        options={Options}
        isMulti
        noOptionsMessage={() => "No records found"}
        className="border border-gray-300 rounded-lg"
        isSearchable
        placeholder="Select"
        required
      />
    </div>
  );
};

export default ChatReasonDropdown;
