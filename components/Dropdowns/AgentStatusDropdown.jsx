import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import Loader from '../Layout/Loader';
import 'select2/dist/js/select2.min.js';
import { fetchMasterData } from '@/slices/AgentSlice';
import { FormGroup, Label, Input, FormText } from 'reactstrap';


const AgentStatusDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const selectRef = useRef(null);
  const { masterData, loading, error } = useSelector((state) => state.agents);
  const [searchString, setsearchString] = useState("")
  const [SenderId, setSenderId] = useState(0)

   useEffect(() => {
      dispatch(fetchMasterData({ type: 'AgentStatus' }));
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
  }, [masterData, onChange]);

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  return (
    <div>
      
 
      {/* <Input
        type="select"
        innerRef={selectRef}
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        <option value="">Select</option>
        {masterData && masterData.length > 0 ? (
          masterData?.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))
        ) : (
          <option disabled>No records found</option>
        )}      
      </Input> */}
    </div>
  );
};

export default AgentStatusDropdown;
