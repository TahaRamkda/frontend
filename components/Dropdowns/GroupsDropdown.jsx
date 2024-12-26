import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchGroup, clearGroupState } from "@/slices/GroupSlice";

const GroupsDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null); 
  const { groups, loading, error,pageSize, currentPage } = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(fetchGroup({ clientId: localStorage.getItem("clientId"),pageSize:10000, pageNo: 1 }));
    return () => {
      dispatch(clearGroupState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: "Select Group",
        allowClear: true,
      });

      $(selectRef.current).on("change", (e) => {
        let selectedValue = e.target.value;
        if (!selectedValue) {
          selectedValue = "0";
        }
        onChange({ target: { name, value: selectedValue } });
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off("change");
      }
    };
  }, [groups, onChange, name]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading: {error}</p>;

  return (
    <div >
     
      <select
        ref={selectRef}
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded py-1 px-2 w-full text-sm"
        required
      >
        <option value="">Select</option>
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <option key={group.groupId} value={group.groupId}>
              {group.groupName}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </select>
     
    </div>
  );
};

export default GroupsDropdown;
