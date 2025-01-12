import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import $ from 'jquery';
import Select from 'react-select';
import { fetchGroupsDrop, clearGroupDropState } from "@/slices/Groupslice";

export const GroupsDropdown = ({ onChange ,existingdata}) => {
  const dispatch = useDispatch();
  const { groupDrop, loading, error } = useSelector((state) => state.groups);
  const [selectedGroupId, setSelectedGroupId] = useState([]);
  const selectRef = useRef(null);
  const [SearchStr, setSearchStr] = useState("")
  // Fetch groups when the component mounts


  useEffect(() => {
    dispatch(fetchGroupsDrop({ clientId: localStorage.getItem("clientId"), SearchStr: SearchStr }));

  }, [dispatch]);

  useEffect(() => {
    if(existingdata){
      setSelectedGroupId(existingdata || [])
    }
  }, [existingdata]);


  // Notify parent of selected group changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedGroupId);
    }
  }, [selectedGroupId, onChange]);

  
  const Options = groupDrop.map(group => ({
    value: group.id,
    label: group.name
  }));

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedGroupId(selectedIds);
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error loading: {error}</p>;


  
  return (
    <>
      <div>
      <Select
        id="groupSelect"
        value={Options.filter(option => selectedGroupId.includes(option.value))}
        onChange={handleSelectChange}
        options={Options}
        isMulti
        className="border border-gray-300 rounded-lg"
        isSearchable
        placeholder="Select"
        required
      />
      </div>
    </>
  );
};

export default GroupsDropdown;
