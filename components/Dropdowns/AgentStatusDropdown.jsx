import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '@/slices/AgentSlice';
import Loader from '../Layout/Loader';

const AgentStatusDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const [StatusClicked, SetStatusClicked] = useState(false);
  const dropdownRef = useRef(null);
  const { masterDataList, loading, error } = useSelector((state) => state.agents);

  // Function to determine the icon based on status ID
  const getStatusIcon = (id) => {
    switch (id) {
      case 0:
        return 'fa fa-circle'; // Red circle with gap for Offline
      case 1:
        return 'fa fa-circle text-green-500';    // Green chat icon for ReadyToChat
      default:
        return 'fa fa-circle text-red-500';       // Default red circle for all other statuses
    }
  };

  // Fetch master data on mount
  useEffect(() => {
    dispatch(fetchMasterData({ type: 'AgentStatus' }));
  }, [dispatch]);

  if (error) return <p className="text-red-500">Error loading: {error}</p>;

  const handleStatusChange = (selectedId) => {
    onChange({ target: { name, value: selectedId } });
    SetStatusClicked(false); // Close dropdown after selection
  };

  // Reorder the options: selected option first, then the rest
  const sortedOptions = () => {
    if (!value || !masterDataList || masterDataList.length === 0) return masterDataList || [];

    const selectedOption = masterDataList.find((option) => option.id === value);
    const otherOptions = masterDataList.filter((option) => option.id !== value);

    return selectedOption ? [selectedOption, ...otherOptions] : masterDataList;
  };

  const orderedOptions = sortedOptions();

  // Toggle dropdown visibility on button click
  const handleButtonClick = () => {
    SetStatusClicked(!StatusClicked);
  };

  // Get the name and icon of the selected option
  const selectedOption = masterDataList?.find((option) => option.id === value);
  const buttonText = selectedOption?.name || "Select Status";
  const buttonIcon = getStatusIcon(value); // Use the function to get the icon

  return (
    <div className="relative">
      <button
        className="flex p-[12px] bg-gray-800 text-white-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none  transition duration-200 ease-in-out"
        onClick={handleButtonClick}
      >
        <i className={`${buttonIcon} mt-1`} aria-hidden="true"></i>
        
        <span className="ml-2">{buttonText}</span>
      </button>
      {StatusClicked && (
        <div
          className="absolute mt-2 -right-10 w-48 bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
          ref={dropdownRef}
        >
          {loading ? (
            <p className="px-4 py-2 text-sm text-white">Loading...</p>
          ) : (
            orderedOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleStatusChange(option.id)}
                className={`flex items-center w-full px-3 py-2 text-sm text-white hover:bg-gray-600 dark:hover:bg-gray-600 focus:outline-none ${
                  option.id === value ? 'bg-gray-600' : ''
                }`}
              >
                <i className={getStatusIcon(option.id)} aria-hidden="true"></i>
                <span className="ml-2">{option.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AgentStatusDropdown;