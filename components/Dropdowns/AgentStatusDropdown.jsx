import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '@/slices/AgentSlice';

const AgentStatusDropdown = ({ name, value, onChange}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { masterData, loading, error } = useSelector((state) => state.agents);

  // Fetch master data on mount
  useEffect(() => {
    dispatch(fetchMasterData({ type: 'AgentStatus' }));
  }, [dispatch]);

  if (error) return <p className="text-red-500">Error loading: {error}</p>;

  const handleStatusChange = (selectedId) => {
    onChange({ target: { name, value: selectedId } });
  };

  // Reorder the options: selected option first, then the rest
  const sortedOptions = () => {
    if (!value || !masterData.length) return masterData;
    
    const selectedOption = masterData.find((option) => option.id === value);
    const otherOptions = masterData.filter((option) => option.id !== value);
    
    return selectedOption ? [selectedOption, ...otherOptions] : masterData;
  };

  const orderedOptions = sortedOptions();

  return (
    <div
      className="absolute mt-9 -right-10 w-48 bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
      ref={dropdownRef}
    >
      {orderedOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => handleStatusChange(option.id)}
          className={`flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600 dark:hover:bg-gray-600 focus:outline-none ${
            option.id === value ? 'bg-gray-600' : ''
          }`}
        >
          <i className="fa fa-check-circle-o mr-2" aria-hidden="true"></i>
          <span>{option.name}</span>
        </button>
      ))}
    </div>
  );
};

export default AgentStatusDropdown;