import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '@/slices/AgentSlice';

const AgentStatusDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false); // Renamed for clarity, can be removed if not used
  const dropdownRef = useRef(null);
  const [StatusClicked, SetStatusClicked] = useState(false);
  const { masterData, loading, error } = useSelector((state) => state.agents);

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
    if (!value || !masterData || masterData.length === 0) return masterData || [];

    const selectedOption = masterData.find((option) => option.id === value);
    const otherOptions = masterData.filter((option) => option.id !== value);

    return selectedOption ? [selectedOption, ...otherOptions] : masterData;
  };

  const orderedOptions = sortedOptions();

  // Toggle dropdown visibility on button click
  const handleButtonClick = () => {
    SetStatusClicked(!StatusClicked);
  };

  // Get the name of the selected option or default to "Select Status"
  const buttonText = masterData
    ? masterData.find((option) => option.id === value)?.name || "Select Status"
    : "Select Status";

  return (
    <div className="relative">
      <button
        className="flex bg-gray-800 text-white-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none p-3 transition duration-200 ease-in-out"
        onClick={handleButtonClick}
      >
        <i className="fa fa-circle-o-notch" aria-hidden="true">
          {" "}
          {buttonText}{" "}
        </i>
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
                className={`flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-600 dark:hover:bg-gray-600 focus:outline-none ${
                  option.id === value ? 'bg-gray-600' : ''
                }`}
              >
                <i className="fa fa-check-circle-o mr-2" aria-hidden="true"></i>
                <span>{option.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AgentStatusDropdown;