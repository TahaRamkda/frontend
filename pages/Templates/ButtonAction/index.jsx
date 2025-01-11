import React, { useEffect, useState } from "react";
import { Modal, ModalBody, Input, FormGroup, Label, Button } from "reactstrap";
import { FaTimes } from "react-icons/fa";
import TemplateDropdown from "@/components/Dropdowns/InteractiveTemplateDropdown";

const SimplePopup = ({ isOpen, toggle, onSubmit, index, existingData }) => {
  const [actionType, setActionType] = useState(0);
  const [buttonValue, setButtonValue] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(0);

  const dropdownOptions = [
    { label: "NONE", value: 0 },
    { label: "TEMPLATE", value: 1 },
    { label: "UNSUBSCRIBE", value: 3 },
    { label: "BLOCK", value: 4 },
    { label: "CHAT", value: 5 },
    { label: "ORDER", value: 6 },
    { label: "CLOSE CHAT", value: 7 },
  ];

  // Populate state when `existingData` changes
  useEffect(() => {
    
    if (existingData) {
      setActionType(existingData.actionType || 0);
      setButtonValue(existingData.buttonValue || "");
      setSelectedTemplateId(existingData.actionId || 0);
    }
  }, [existingData]);

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
  };

  const handleSubmit = () => {
    const data = {
      actionType: actionType,
      actionId: actionType === 1 || actionType === "1" ? selectedTemplateId : "0",
      buttonValue: buttonValue,
    };
    // Pass the index and the data to the parent component for updating the state
    onSubmit(data, index);
  
    toggle(); // Close the modal
  };
  

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <div className="d-flex justify-content-end p-2">
        <FaTimes
          style={{ cursor: "pointer", fontSize: "1.5rem" }}
          onClick={toggle}
        />
      </div>
      <ModalBody style={{ backgroundColor: "white", height: "auto" }}>
        <FormGroup>
          <Label for="actionType">Select Action Type</Label>
          <Input
            type="select"
            id="actionType"
            value={actionType}
            onChange={
              
              
              (e) => setActionType(e.target.value)}
          >
            {dropdownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Input>
        </FormGroup>

        {(actionType === 1 || actionType === "1") && (
          <FormGroup>
            <Label for="templateDropdown">Select Template</Label>
            <TemplateDropdown
              id="templateDropdown"
              value={selectedTemplateId}
              onChange={handleTemplateChange}
              TransactionType="0"
            />
          </FormGroup>
        )}

        <FormGroup>
          <Label for="buttonValue">Button Value (for integration)</Label>
          <Input
            type="text"
            id="buttonValue"
            value={buttonValue}
            onChange={(e) => setButtonValue(e.target.value)}
            placeholder="Enter button value"
          />
        </FormGroup>
      </ModalBody>
      <div className="text-end p-3">
        <Button className="uniform_btn" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default SimplePopup;
