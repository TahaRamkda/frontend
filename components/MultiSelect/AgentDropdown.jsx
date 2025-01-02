import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchAgentsDrop, cleaAgenDroptState } from '@/slices/AgentSlice';
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const AgentsDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { agentDrop, loading, error } = useSelector((state) => state.agents);
  const [SelectedAgentId, setSelectedAgentId] = useState([]);
  const [searchString, setsearchString] = useState("")
  const [SenderId, setSenderId] = useState(0)

  useEffect(() => {
    dispatch(fetchAgentsDrop({ clientId: localStorage.getItem("clientId"), searchStr: searchString, senderId: SenderId }));

  }, [dispatch]);

  // Notify parent of selected client changes
  useEffect(() => {
    if (onChange) {
      onChange(SelectedAgentId);
    }
  }, [SelectedAgentId, onChange]);

  useEffect(() => {
    if (selectRef.current) {
      $(selectRef.current).select2({
        placeholder: "Select",
        allowClear: true,
        multiple: true,
      });

      $(selectRef.current).on("change", (e) => {
        const selectedValues = $(selectRef.current).val() || [];
        setSelectedAgentId(selectedValues);
      });
    }

    return () => {
      if (selectRef.current) {
        $(selectRef.current).off('change');
      }
    };
  }, [agentDrop]);



  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error loading: {error}</p>;
  const availableAgents = agentDrop.filter(
    (agentDrop) => !SelectedAgentId.includes(agentDrop.clientId)
  );
  return (
    <div>
      <Input
        ref={selectRef}
        id="agentSelect"
        innerRef={selectRef}
        name={name}
        value={SelectedAgentId}
        onChange={(e) => setSelectedAgentId(Array.from(e.target.selectedOptions, option => option.value))}
        multiple
        required
      >
        <option value="">Select</option>
        {availableAgents && availableAgents.length > 0 ? (
          availableAgents.map((agents) => (
            <option key={agents.id} value={agents.id}>
              {agents.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}
      </Input>
    </div>
  );
};

export default AgentsDropdown;
