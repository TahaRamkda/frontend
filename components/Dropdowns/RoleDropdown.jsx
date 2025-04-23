import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'reactstrap';
import $ from 'jquery';
import Loader from '../Layout/Loader';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchRolesDrop, clearRoleDropState } from "@/slices/RoleSlice";

const RoleDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { roleDrop, loading, error } = useSelector((state) => state.roles);

  useEffect(() => {
    dispatch(fetchRolesDrop({ clientId: localStorage.getItem("clientId") }));

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

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">Error loading: {error}</p>;

  return (
    <div className="">

      <Input
        type="select"
        id={name}
        innerRef={selectRef}
        name={name}
        value={value}
        onChange={onChange}
        className='focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        required
      >
         <option value="0">Select</option>
        {roleDrop && roleDrop?.length > 0 ? (
          roleDrop?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>  
     
    </div>
  );
};

export default RoleDropdown;
