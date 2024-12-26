import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchTemplates, clearTemplateState } from "@/slices/TemplateSlice";
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const TemplateDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null); 
  const { templates, loading, error } = useSelector((state) => state.templates);

  useEffect(() => {
    dispatch(fetchTemplates({ clientId: localStorage.getItem("clientId") }));
    return () => {
      if (selectRef.current) {
        $(selectRef.current).select2('destroy');  // Cleanup select2 on unmount
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

      // Sync the select2 value with React's value
      $select.val(value).trigger('change');

      // Update the value when it changes
      $select.on('change', (e) => {
        const selectedValue = e.target.value || "0";  // Fallback to "0" if no selection
        onChange({ target: { name, value: selectedValue } });
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off('change');
      }
    };
  }, [value, templates, onChange, name]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  return (
    <FormGroup>
      <Input
        type="select"
        innerRef={selectRef}
        name={name}
        value={value}
        onChange={onChange}      
        required
      >
        <option value="0">Select</option>
        {templates && templates.length > 0 ? (
          templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.templateName}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>
    </FormGroup>
  );
};

export default TemplateDropdown;
