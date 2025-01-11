import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchActiveAgentsDrop, cleaActiveAgenDroptState } from '@/slices/AgentSlice';
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const ActiveAgentDropdown = ({ name, value, onChange,SenderId }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { activeAgentDrop, loading, error } = useSelector((state) => state.agents);

  useEffect(() => {
    dispatch(fetchActiveAgentsDrop({ clientId: localStorage.getItem("clientId"), senderId:SenderId  }));

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
  }, [activeAgentDrop, onChange]);

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
        <option value="">Select</option>
        {activeAgentDrop && activeAgentDrop.length > 0 ? (
          activeAgentDrop.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>
    </div>
  );
};

export default ActiveAgentDropdown;
