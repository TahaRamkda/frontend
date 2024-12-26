import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchGroup, clearGroupState } from "@/slices/GroupSlice";

export const GroupDropdown = ({ onChange }) => {
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector((state) => state.groups);
  const [selectedGroupId, setSelectedGroupId] = useState([]);
  const selectRef = useRef(null);

  // Fetch groups when the component mounts
  useEffect(() => {
    dispatch(fetchGroup({ clientId: localStorage.getItem("clientId"), pageSize : 100000, pageNo: 1 }));
    return () => {
      dispatch(clearGroupState());
    };
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
  }, [groups]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  // Filter out the selected groups from the available options
  const availableGroups = groups.filter(
    (group) => !selectedGroupId.includes(group.groupId)
  );

  return (
    <>
      <div className="mb-4">
        <select
          ref={selectRef}
          id="groupSelect"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(Array.from(e.target.selectedOptions, option => option.value))}
          multiple
          required
        >
          <option value="">Select</option>
          {availableGroups && availableGroups.length > 0 ? (
            availableGroups.map((group) => (
              <option key={group.groupId} value={group.groupId}>
                {group.groupName}
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

export default GroupDropdown;
