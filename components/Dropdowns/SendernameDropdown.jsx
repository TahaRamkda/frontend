import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchSendernames, clearSendernameState } from "@/slices/SenderNameSlice";
import { FormGroup, Label, FormFeedback } from 'reactstrap';

const SendernameDropdown = ({ name, value, onChange, error }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { sendernames, loading, error: fetchError } = useSelector((state) => state.sendernames);

  useEffect(() => {
    dispatch(fetchSendernames({ client_Id: localStorage.getItem("clientId") }));
    return () => {
      // Clean up the select2 instance when the component unmounts
      if (selectRef.current) {
        $(selectRef.current).select2('destroy');
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectRef.current) {
      const $select = $(selectRef.current);

      // Initialize select2 only if not already initialized
      if ($select.hasClass('select2-hidden-accessible') === false) {
        $select.select2({
          placeholder: 'Select',
          allowClear: true,
        });
      }

      // Update the select2 value when React's state changes
      $select.val(value).trigger('change');
      
      // Sync the onChange handler
      $select.on('change', (e) => {
        const selectedValue = e.target.value || "0"; // Fallback to "0" if no selection
        onChange({ target: { name, value: selectedValue } });
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off('change');
      }
    };
  }, [value, sendernames, onChange, name]);

  if (loading) return <p>Loading...</p>;
  if (fetchError) return <p className="text-danger">Error loading: {fetchError}</p>;

  return (
    <div>
       
      <select
        ref={selectRef}
        name={name}
        className="border rounded py-1 px-2 w-full text-sm"
        required
      >
        <option value="0">Select</option>
        {sendernames && sendernames.length > 0 ? (
          sendernames.map((sendername) => (
            <option key={sendername.senderId} value={sendername.senderId}>
              {sendername.senderName}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </select>
      {error && value === "0" && (
        <FormFeedback>Required!</FormFeedback>
      )}
    </div>
  );
};

export default SendernameDropdown;
