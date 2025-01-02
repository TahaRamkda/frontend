import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchTemplatesDrop, clearTemplateDropState } from "@/slices/TemplateSlice";

export const TemplatesDropdown = ({ onChange }) => {
  const dispatch = useDispatch();
  const { templateDrop, loading, error } = useSelector((state) => state.templates);
  const [selectedTemplateId, setSelectedTemplateId] = useState([]);
  const [searchString, setsearchString] = useState("")
  const [transactionType, settransactionType] = useState(0)
  const selectRef = useRef(null);

  // Fetch templates when the component mounts
  useEffect(() => {
    dispatch(fetchTemplatesDrop({ clientId: localStorage.getItem("clientId"), TransactonType: transactionType }));

  }, [dispatch]);

  // Notify parent of selected template changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedTemplateId);
    }
  }, [selectedTemplateId, onChange]);

  // Handle select/deselect templates (via select2)
  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: "Select",
        allowClear: true,
        multiple: true,
      });

      $(selectRef.current).on("change", (e) => {
        const selectedValues = $(selectRef.current).val() || [];
        setSelectedTemplateId(selectedValues);
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off("change");
      }
    };
  }, [templateDrop]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  // Filter out the selected templates from the available options
  const availableTemplates = templateDrop.filter(
    (templateDrop) => !selectedTemplateId.includes(templateDrop.templateId)
  );

  return (
    <>
      <div>
        <select
          ref={selectRef}
          id="templateSelect"
          innerRef={selectRef}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(Array.from(e.target.selectedOptions, option => option.value))}
          multiple
          required
        >
          <option value="">Select</option>
          {availableTemplates && availableTemplates.length > 0 ? (
            availableTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))
          ) : (
            <option disabled>No records found</option>
          )}
        </select>
      </div>
    </>
  );
};

export default TemplatesDropdown;
