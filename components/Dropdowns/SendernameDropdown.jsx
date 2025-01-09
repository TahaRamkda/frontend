import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchSendernamesDrop, clearSendernameDropState } from "@/slices/sendernameSlice";
import { FormGroup, Label, FormFeedback, Input } from 'reactstrap';

const SendernameDropdown = ({ name, value, onChange, error, disabled }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { sendernameDrop, loading, error: fetchError } = useSelector((state) => state.sendernames);

  useEffect(() => {
    dispatch(fetchSendernamesDrop({ clientId: localStorage.getItem("clientId") }));

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
  }, [sendernameDrop, onChange]);
  if (loading) return <p>Loading...</p>;
  if (fetchError) return <p className="text-danger">Error loading: {fetchError}</p>;

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
        {sendernameDrop && sendernameDrop.length > 0 ? (
          sendernameDrop.map((sendername) => (
            <option key={sendername.id} value={sendername.id}>
              {sendername.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>
      {error && value === "0" && (
        <FormFeedback>Required!</FormFeedback>
      )}
    </div>
  );
};

export default SendernameDropdown;
