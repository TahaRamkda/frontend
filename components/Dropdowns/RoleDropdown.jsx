import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'reactstrap';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchRolesDrop, clearRoleDropState } from "@/slices/RoleSlice";

const RoleDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null); 
  const { roleDrop, loading, error } = useSelector((state) => state.roles);
 const refreshDropdown = () =>{
  dispatch(fetchRolesDrop({clientId: localStorage.getItem("clientId") }));
 }
  useEffect(() => {
    dispatch(fetchRolesDrop({clientId: localStorage.getItem("clientId") }));
    return () => {
       dispatch(clearRoleDropState());
       refreshDropdown()
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: 'Select',
        allowClear: true,
      });

      $(selectRef.current).on('change', (e) => {
        let selectedValue = e.target.value;
        if (!selectedValue) {
          selectedValue = "0";
        }
        onChange({ target: { name, value: selectedValue } });
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off('change');
      }
    };
  }, [roleDrop, onChange]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error loading: {error}</p>;

  return (
    <div className="">
     
      <select
        id={name}
        name={name}
        ref={selectRef}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        required
      >
        <option value="0">Select</option>
        {roleDrop && roleDrop.length > 0 ? (
          roleDrop.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </select>
    </div>
  );
};

export default RoleDropdown;
