import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Loader from '../Layout/Loader';
import { fetchSurveyDropdown } from '@/slices/ReportSlice';
import { FormGroup, Label, Input, FormText } from 'reactstrap';

const AgentsDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const {SurveyDropdown,loading,error} = useSelector((state) => state.reports);
  const [selectedAgentId, setSelectedAgentId] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [senderId, setSenderId] = useState(0);

  // Effect to fetch agents when search string or senderId changes
   useEffect(() => {
      dispatch(fetchSurveyDropdown({}));
  
    }, [dispatch]);

  // Effect to notify parent component when selected Survey changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedAgentId);
    }
  }, [selectedAgentId, onChange]);

  // Mapping the fetched Survey data into the format that react-select expects
  const Options = SurveyDropdown?.map(Survey => ({
    value: Survey.id,
    label: Survey.name
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
        id="surveySelect"
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
        menuPortalTarget={document.body} // Add this line
      />
    </div>
  );
};

export default AgentsDropdown;
