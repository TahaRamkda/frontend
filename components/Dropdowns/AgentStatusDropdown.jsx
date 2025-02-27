import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '@/slices/AgentSlice';

const AgentStatusDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { masterData, loading, error } = useSelector((state) => state.agents);

  // Fetch master data on mount
  useEffect(() => {
    dispatch(fetchMasterData({ type: 'AgentStatus' }));
  }, [dispatch]);

  // Handle click outside to close dropdown
 

  
  if (error) return <p className="text-red-500">Error loading: {error}</p>;

  const handleStatusChange = (selectedId) => {
    onChange({ target: { name, value: selectedId } });
    
  };

  return (
    <div className="relative" ref={dropdownRef}>
     

      {/* Dropdown menu */}
      
        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          {masterData.map((option) => (
            <button
              key={option.id}
              onClick={() => handleStatusChange(option.id)}
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600 dark:hover:bg-gray-600 focus:outline-none"
            >
              <span>{option.name}</span>
            </button>
          ))}
        </div>
    
    </div>
  );
};

export default AgentStatusDropdown;