import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import { Input } from 'reactstrap';
import Loader from '../Layout/Loader';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchGroupsDrop, clearGroupDropState } from "@/slices/Groupslice";

const GroupDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { groupDrop, loading, error } = useSelector((state) => state.groups);
  const [SearchStr, setSearchStr] = useState("")

  useEffect(() => {
    dispatch(fetchGroupsDrop({ clientId: localStorage.getItem("clientId"), SearchStr: SearchStr }));

  }, [dispatch]);

  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: "Select",
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
  }, [groupDrop, onChange]);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">Error loading: {error}</p>;

  return (
    <div >

      <Input
        type="select"
        innerRef={selectRef}
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        <option value="0">Select</option>
        { (groupDrop && groupDrop.length > 0) ? (
          groupDrop.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>

    </div>
  );
};

export default GroupDropdown;
