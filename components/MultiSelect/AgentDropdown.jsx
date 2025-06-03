import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Loader from '../Layout/Loader';
import { fetchAgentsDrop } from '@/slices/DropdownSlice';
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const AgentsDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const { agentDropList, loading, error } = useSelector((state) => state.dropdown);
  const [selectedAgentId, setSelectedAgentId] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [senderId, setSenderId] = useState(0);

  // Effect to fetch agents when search string or senderId changes
  useEffect(() => {
    dispatch(fetchAgentsDrop({ clientId: localStorage.getItem("clientId"), searchStr: searchString, senderId: senderId }));
  }, [dispatch, searchString, senderId]);

  // Effect to notify parent component when selected agent changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedAgentId);
    }
  }, [selectedAgentId, onChange]);

  // Mapping the fetched agent data into the format that react-select expects
  const Options = agentDropList?.map(agent => ({
    value: agent.id,
    label: agent.name
  })) || [];

  // Handle when selection changes
  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedAgentId(selectedIds);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-danger">Error loading: {error}</p>;

  return (
    <div>
      <Select
        id="agentTagsSelect"
        name={name}
        value={Options.filter(option => selectedAgentId.includes(option.value))}
        onChange={handleSelectChange}
        options={Options}
        isMulti
        noOptionsMessage={() => "No records found"}
        className="border border-gray-300 rounded-lg"
        isSearchable
        placeholder="Select"
        required
      />
    </div>
  );
};

export default AgentsDropdown;
