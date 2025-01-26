import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2/dist/js/select2.min.js";
import { fetchInteractiveTemplateDropWithoutParam,clearInteractiveTemplateDropStateState } from "@/slices/InteractiveTemplateSlice";
import { FormGroup, Label, Input, FormText } from "reactstrap";

const InteractiveTemplateDropdown = ({ name, value, onChange, TransactionType, SenderId }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { interactiveTemplateDropList, loading, error } = useSelector(
    (state) => state.interactiveTemplates
  );
  const [transactionType, settransactionType] = useState(0);

  useEffect(() => {
    if (TransactionType) {
      settransactionType(TransactionType);
    }
  }, [TransactionType]);

  useEffect(() => {
    dispatch(
        fetchInteractiveTemplateDropWithoutParam({
            clientId: localStorage.getItem("clientId"),
            senderId: SenderId
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
  }, [interactiveTemplateDropList, onChange]);

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
        {interactiveTemplateDropList && interactiveTemplateDropList.length > 0 ? (
          interactiveTemplateDropList.map((template) => (
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

export default InteractiveTemplateDropdown;
