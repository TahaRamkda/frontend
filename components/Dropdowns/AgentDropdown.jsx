import React, {useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import { fetchAgentsDrop, cleaAgenDroptState } from '@/slices/AgentSlice'; 
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const AgentDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null); 
  const { agentDrop, loading, error } = useSelector((state) => state.agents);
 const [searchString, setsearchString] = useState("")
 const [SenderId,setSenderId] = useState(0)
 const refreshDropdown = () =>{
  dispatch(fetchAgentsDrop({ clientId: localStorage.getItem("clientId"), searchStr:searchString, senderId:SenderId }));
 }
  useEffect(() => {
    dispatch(fetchAgentsDrop({ clientId: localStorage.getItem("clientId"), searchStr:searchString, senderId:SenderId }));
    return () => {
      dispatch(cleaAgenDroptState());
    };
  }, [dispatch,searchString,SenderId]);

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
  }, [agentDrop, onChange]);

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
        {agentDrop && agentDrop.length > 0 ? (
          agentDrop.map((agent) => (
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

export default AgentDropdown;
