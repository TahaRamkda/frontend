import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from 'jquery';
import Select from 'react-select';
import Loader from "../Layout/Loader";
import { fetchClientsDrop, clearClientDropState } from "@/slices/clientSlice";

export const ClientsDropdown = ({ onChange }) => {
  const dispatch = useDispatch();
  const { clientsDrop, loading, error } = useSelector((state) => state.clients);
  const [selectedClientId, setSelectedClientId] = useState([]);
  const [searchString, setsearchString] = useState("")
  const selectRef = useRef(null);

  // Fetch clients when the component mounts
  useEffect(() => {
    dispatch(fetchClientsDrop({ clientId: localStorage.getItem("clientId"), searchStr: searchString }));

  }, [dispatch]);

  // Notify parent of selected client changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedClientId);
    }
  }, [selectedClientId, onChange]);

  const Options = clientsDrop?.map(client => ({
    value: client.id,
    label: client.name
  })) || [];

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedClientId(selectedIds);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;


  
  return (
    <>
      <div className="mb-4">
      <Select
        id="clientSelect"
        value={Options.filter(option => selectedClientId.includes(option.value))}
        onChange={handleSelectChange}
        options={Options}
        isMulti
        className="border border-gray-300 rounded-lg"
        isSearchable
        noOptionsMessage={() => "No records found"}
        placeholder="Select"
        required
        menuPortalTarget={document.body} // Add this line
      />
      </div>
    </>
  );
};

export default ClientsDropdown;
