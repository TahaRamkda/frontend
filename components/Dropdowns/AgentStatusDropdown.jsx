import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMasterData } from "@/slices/AgentSlice";
import { HiCog } from "react-icons/hi";
import Loader from "../Layout/Loader";

const AgentStatusDropdown = ({ name, value, onChange }) => {
  const dispatch = useDispatch();
  const [StatusClicked, SetStatusClicked] = useState(false);
  const dropdownRef = useRef(null);
  const { masterDataList, loading, error } = useSelector(
    (state) => state.agents
  );

  // Function to determine the icon based on status ID
  const getStatusIcon = (id) => {
    switch (id) {
      case 0:
        return "fa fa-circle text-gray-500"; // Red circle with gap for Offline
      case 1:
        return "fa fa-circle text-green-500"; // Green chat icon for ReadyToChat
      default:
        return "fa fa-circle text-red-500"; // Default red circle for all other statuses
    }
  };

  // Fetch master data on mount
  useEffect(() => {
    dispatch(fetchMasterData({ type: "AgentStatus" }));
  }, [dispatch]);

  if (error) return <p className="text-red-500">Error loading: {error}</p>;

  const handleStatusChange = (selectedId) => {
    onChange({ target: { name, value: selectedId } });
    SetStatusClicked(false); // Close dropdown after selection
  };

  // Reorder the options: selected option first, then the rest
  const sortedOptions = () => {
    if (!value || !masterDataList || masterDataList.length === 0)
      return masterDataList || [];

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
      <div>
        <button
          onClick={handleButtonClick}
          className="flex items-center space-x-3  rounded-xl hover:bg-white transition-colors duration-200 w-full"
          aria-haspopup="listbox"
          aria-expanded={StatusClicked}
          aria-label="Agent Status Dropdown"
        >
          <div className="flex items-center justify-center w-12 h-10 rounded-lg bg-gray-50">
            <HiCog className={`${buttonIcon} h-5 w-5`} />
          </div>
          <div className="hidden group-hover:flex items-center justify-between flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Agent Status</span>
              <span className="text-xs font-medium text-gray-700 mt-0.5">
                {buttonText}
              </span>
            </div>
          </div>
        </button>

        {StatusClicked && (
          <div className="mt-1 ml-12 group-hover:ml-2 overflow-hidden transition-all duration-200">
            <div className="bg-white rounded-lg">
              {orderedOptions.map((option) => {
                return (
                  <div
                    onClick={() => handleStatusChange(option.id)}
                    className={`flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer ${
                      option.id === 0 ? "border-t border-gray-100" : ""
                    }`}
                  >
                    <i
                      className={getStatusIcon(option.id)}
                      aria-hidden="true"
                    ></i>
                    <span className="text-xs text-gray-700">{option.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentStatusDropdown;
