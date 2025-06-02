import React, { useEffect, useState } from "react";
import { Modal, ModalBody, Input, FormGroup, Label, Button } from "reactstrap";
import { FaTimes } from "react-icons/fa";
import InteractiveTemplateDropdown from "@/components/Dropdowns/InteractiveTemplateDropWithoutParam";
import FlowDropdown from "@/components/Dropdowns/FlowsDropdown";
import { dropdownOptions } from "@/utils/constants";

const SimplePopup = ({ isOpen, toggle, onSubmit, index, existingData, SenderId }) => {
  const [actionType, setActionType] = useState(0);
  const [buttonValue, setButtonValue] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(0);
  const [selectedFlowId, setSelectedFlowId] = useState(0);

  // Populate state when `existingData` changes
  useEffect(() => {
    if (existingData) {
      setActionType(existingData.actionType || 0);
      setButtonValue(existingData.buttonValue || "");
      setSelectedTemplateId(existingData.actionId || 0);
      setSelectedFlowId(existingData.actionId || 0);
    }
  }, [existingData]);

  const handleTemplateChange = (e) => {
    
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
  };
  
  const handleFlowChange = (e) => {
    const flowId = e.target.value;
    setSelectedFlowId(flowId);
  };

  const handleSubmit = () => {
    
    const data = {
      actionType: actionType,
      actionId: actionType === 1 || actionType === "1" ? selectedTemplateId : actionType === 8 || actionType === "8" ? selectedFlowId : 0,
      buttonValue: buttonValue,
    };
    onSubmit(data, index);
    toggle(); // Close the modal
  };

  // Check if SenderId is invalid (null, undefined, or 0)
  const isSenderIdInvalid = !SenderId || SenderId === 0 || SenderId === "";
  console.log(isSenderIdInvalid);

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
            onChange={(e) => setActionType(e.target.value)}
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
            {isSenderIdInvalid ? (
              <div className="text-danger">
                Please select a  Sender Name first
              </div>
            ) : (
              <InteractiveTemplateDropdown
                id="templateDropdown"
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                TransactionType="0"
                SenderId={SenderId}
              />
            )}
          </FormGroup>
        )}
        {(actionType === 8 || actionType === "8") && (
          <FormGroup>
            <Label for="FlowDropdown">Select Flows</Label>
            {isSenderIdInvalid ? (
              <div className="text-danger">
                Please select a valid Sender Name first
              </div>
            ) : (
              <FlowDropdown
                id="FlowDropdown"
                value={selectedFlowId}
                onChange={handleFlowChange}
              />
            )}
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