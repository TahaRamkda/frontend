import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2/dist/js/select2.min.js";
import Loader from "../Layout/Loader";
import {
    fetchInteractiveTemplateDrop,
  clearInteractiveTemplateListState,
} from "@/slices/TemplateSlice";
import { FormGroup, Label, Input, FormText } from "reactstrap";

const TemplateDropdown = ({ name, value, onChange, TransactionType }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { interactiveTemplateList, loading, error } = useSelector(
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
        fetchInteractiveTemplateDrop({
        clientId: localStorage.getItem("clientId"),
      })
    );

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
  }, [interactiveTemplateList, onChange]);

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
        {interactiveTemplateList && interactiveTemplateList.length > 0 ? (
          interactiveTemplateList.map((template) => (
            <option key={template.interactiveTemplateId} value={template.interactiveTemplateId}>
              {template.templateName}
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
