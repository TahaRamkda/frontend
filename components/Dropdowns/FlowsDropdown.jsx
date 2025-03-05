import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2/dist/js/select2.min.js";
import Loader from "../Layout/Loader";
import { fetchFlowDropdown, clearFlowDropdownState } from "@/slices/FlowsSlice";
import { FormGroup, Label, Input, FormText } from "reactstrap";

const FlowDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { flowDropdownData, loading, error } = useSelector(
    (state) => state.flows
  );
  
  useEffect(() => {
    dispatch(
        fetchFlowDropdown({
        clientId: localStorage.getItem("clientId"),
      })
    );

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
  }, [flowDropdownData, onChange]);

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  return (
    <div>
      <Input
        type="select"
        innerRef={selectRef}
        name={name}
        value={value}
        onChange={onChange}
        
        required
      >
        <option value="0">Select</option>
        {flowDropdownData && flowDropdownData.length > 0 ? (
          flowDropdownData.map((flow) => (
            <option key={flow.id} value={flow.id}>
              {flow.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>
    </div>
  );
};

export default FlowDropdown;
