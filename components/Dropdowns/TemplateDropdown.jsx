import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2/dist/js/select2.min.js";
import {
  fetchTemplatesDrop,
  clearTemplateDropState,
} from "@/slices/TemplateSlice";
import { FormGroup, Label, Input, FormText } from "reactstrap";

const TemplateDropdown = ({ name, value, onChange, TransactionType }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { templateDrop, loading, error } = useSelector(
    (state) => state.templates
  );
  const [transactionType, settransactionType] = useState(0);

  useEffect(() => {
    if (TransactionType) {
      settransactionType(TransactionType);
    }
  }, [TransactionType]);

  useEffect(() => {
    dispatch(
      fetchTemplatesDrop({
        clientId: localStorage.getItem("clientId"),
        TransactionType: transactionType,
      })
    );
    return () => {
      dispatch(clearTemplateDropState());
      refreshDropdown()
    };
  }, [dispatch, transactionType]);

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
  }, [templateDrop, onChange]);

  if (loading) return <p>Loading...</p>;
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
        {templateDrop && templateDrop.length > 0 ? (
          templateDrop.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>
    </div>
  );
};

export default TemplateDropdown;
