import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchGroupsDrop, clearGroupDropState } from "@/slices/Groupslice";

export const GroupsDropdown = ({ onChange }) => {
  const dispatch = useDispatch();
   const { groupDrop, loading, error } = useSelector((state) => state.groups);
  const [selectedGroupId, setSelectedGroupId] = useState([]);
  const selectRef = useRef(null);
  const [SearchStr, setSearchStr] = useState("")
  // Fetch groups when the component mounts
 
  
  useEffect(() => {
     dispatch(fetchGroupsDrop({ clientId: localStorage.getItem("clientId") , SearchStr:SearchStr}));
    
   }, [dispatch]);
 

  // Notify parent of selected group changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedGroupId);
    }
  }, [selectedGroupId, onChange]);

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
        setSelectedGroupId(selectedValues);
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off("change");
      }
    };
  }, [groupDrop]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  // Filter out the selected groups from the available options
  const availableGroup = groupDrop.filter(
    (groupDrop) => !selectedGroupId.includes(groupDrop.clientId)
  );
  return (
    <>
      <div>
        <select
          ref={selectRef}
          id="groupSelect"
          innerRef={selectRef}
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(Array.from(e.target.selectedOptions, option => option.value))}
          multiple
          required
        >
          <option value="">Select</option>
          {availableGroup && availableGroup.length > 0 ? (
            availableGroup.map((group) => (
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

export default GroupsDropdown;
