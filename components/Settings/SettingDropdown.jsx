import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '@/slices/AgentSlice';
import Loader from '../Layout/Loader';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    FormGroup,
    Label,
    FormFeedback,
  } from "reactstrap";

const Setting = ({ name, value, onChange, onClose }) => {
  const dispatch = useDispatch();
  const [StatusClicked, SetStatusClicked] = useState(false);
  const dropdownRef = useRef(null);
  const { masterData, loading, error } = useSelector((state) => state.agents);

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

  // Get the name and icon of the selected option
  const selectedOption = masterData?.find((option) => option.id === value);
  const buttonText = selectedOption?.name || "Select Status";
  const buttonIcon = getStatusIcon(value); // Use the function to get the icon

  return (
    <Modal isOpen={true} fade={false} centered>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center ">
        <div className="bg-white p-6 rounded shadow-lg w-1/3  relative">
    <ModalHeader toggle={onClose}>Settings</ModalHeader>
    <ModalBody>
      <form >
        <FormGroup>
          <Label for="oldPassword">Old Password</Label>
          <div >
            <Input
             
              name="oldPassword"
              id="oldPassword"
              placeholder="*******"
              
            />
          
          </div>
        </FormGroup>
        <FormGroup>
          <Label for="newPassword">New Password</Label>
          <div >
            <Input
              
              name="newPassword"
              id="newPassword"
              placeholder="*******"
              
            />

          </div>
        </FormGroup>
        <FormGroup>
          <Label for="confirmPassword">Confirm Password</Label>
          <div >
           
          </div>
        </FormGroup>
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </ModalBody>
    </div>
    </div>
  </Modal>
  );
};

export default Setting;