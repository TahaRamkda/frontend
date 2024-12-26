import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchClients, clearClientState } from "@/slices/ClientSlice";
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const ClientDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null); 
  const { clients, loading, error } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients({pageSize, pageNo: currentPage}));
    return () => {
      dispatch(clearClientState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: 'Select',
        allowClear: true,
      });

      $(selectRef.current).on('change', (e) => {
        let selectedValue = e.target.value;
        if (!selectedValue) {
          selectedValue = "0";
        }
        onChange({ target: { name, value: selectedValue } });
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off('change');
      }
    };
  }, [clients, onChange]);

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
        <option value="">Select</option>
        {clients && clients.length > 0 ? (
          clients.map((client) => (
            <option key={client.clientId} value={client.clientId}>
              {client.clientName}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>
    </FormGroup>
  );
};

export default ClientDropdown;
