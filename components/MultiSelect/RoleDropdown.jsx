import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import $ from 'jquery';
import Loader from "../Layout/Loader";
import Select from 'react-select';
import { fetchRolesDrop, clearRoleDropState } from "@/slices/RoleSlice";

export const RolesDropdown = ({ onChange, error,existingdata }) => {
  const dispatch = useDispatch();
  const { roleDrop, loading, error: fetchError } = useSelector((state) => state.roles);
  const selectRef = useRef(null);
  const [selectedRoleId, setselectedRoleId] = useState([]);



  // Fetch groups when the component mounts
  useEffect(() => {
    dispatch(fetchRolesDrop({ clientId: localStorage.getItem("clientId") }));

  }, [dispatch]);

 useEffect(() => {
    if(existingdata){
      setselectedRoleId(existingdata || [])
    }
  }, [existingdata]);

  // Notify parent of selected group changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedRoleId);
    }
  }, [selectedRoleId, onChange]);

  const Options = roleDrop?.map(role => ({
    value: role.id,
    label: role.name
  })) || [];

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setselectedRoleId(selectedIds);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  // Filter out the selected groups from the available options
  const availableRole = roleDrop.filter(
    (roleDrop) => !selectedRoleId.includes(roleDrop.clientId)
  );
  return (
    <>
      <div>
      <Select
        id="groupSelect"
        value={Options.filter(option => selectedRoleId.includes(option.value))}
        onChange={handleSelectChange}
        options={Options}
        isMulti
        className="border border-gray-300 rounded-lg"
        isSearchable
        placeholder="Select"
        noOptionsMessage={() => "No records found"}
        required
      />
      </div>
    </>
  );
};

export default RolesDropdown;
