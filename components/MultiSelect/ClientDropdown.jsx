import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "reactstrap";
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchClientsDrop, clearClientDropState } from "@/slices/ClientSlice";

export const ClientsDropdown = ({ onChange }) => {
  const dispatch = useDispatch();
  const { clientsDrop, loading, error } = useSelector((state) => state.clients);
  const [selectedClientId, setSelectedClientId] = useState([]);
  const [searchString, setsearchString] = useState("")
  const selectRef = useRef(null);

  // Fetch clients when the component mounts
  useEffect(() => {
    dispatch(fetchClientsDrop({ clientId: localStorage.getItem("clientId"), searchStr: searchString }));

  }, [dispatch]);

  // Notify parent of selected client changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedClientId);
    }
  }, [selectedClientId, onChange]);

  // Handle select/deselect clients (via select2)
  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: "Select",
        allowClear: true,
        multiple: true,
      });

      $(selectRef.current).on("change", (e) => {
        const selectedValues = $(selectRef.current).val() || [];
        setSelectedClientId(selectedValues);
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off("change");
      }
    };
  }, [clientsDrop]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  // Filter out the selected clients from the available options
  const availableClients = clientsDrop.filter(
    (clientsDrop) => !selectedClientId.includes(clientsDrop.clientId)
  );

  return (
    <>
      <div className="mb-4">
        <Input
          ref={selectRef}
          id="clientSelect"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(Array.from(e.target.selectedOptions, option => option.value))}
          multiple
          required
        >
          <option value="">Select</option>
          {availableClients && availableClients.length > 0 ? (
            availableClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))
          ) : (
            <option disabled>No records found</option>
          )}
        </Input>
      </div>
    </>
  );
};

export default ClientsDropdown;
