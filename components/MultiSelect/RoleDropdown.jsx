import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchRolesDrop, clearRoleDropState } from "@/slices/RoleSlice";

export const RolesDropdown = ({ onChange, error }) => {
  const dispatch = useDispatch();
  const { roleDrop, loading, error: fetchError } = useSelector((state) => state.roles);
  const selectRef = useRef(null);
  const [selectedRoleId, setselectedRoleId] = useState([]);



  // Fetch groups when the component mounts
  useEffect(() => {
    dispatch(fetchRolesDrop({ clientId: localStorage.getItem("clientId") }));

  }, [dispatch]);


  // Notify parent of selected group changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedRoleId);
    }
  }, [selectedRoleId, onChange]);

  // Handle select/deselect groups (via select2)
  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: "Select",
        allowClear: true,
        multiple: true,
      });

      $(selectRef.current).on("change", (e) => {
        const selectedValues = $(selectRef.current).val() || [];
        setselectedRoleId(selectedValues);
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off("change");
      }
    };
  }, [roleDrop]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  // Filter out the selected groups from the available options
  const availableRole = roleDrop.filter(
    (roleDrop) => !selectedRoleId.includes(roleDrop.clientId)
  );
  return (
    <>
      <div>
        <select
          ref={selectRef}
          id="Select"
          value={selectedRoleId}
          onChange={(e) => setselectedRoleId(Array.from(e.target.selectedOptions, option => option.value))}
          multiple
          required
        >
          <option value="0">Select</option>
          {availableRole && availableRole.length > 0 ? (
            availableRole.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))
          ) : (
            <option disabled>No records found</option>
          )}
        </select>
      </div>
    </>
  );
};

export default RolesDropdown;
