import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from "reactstrap";
import showSweetAlert from "@/components/Sweetalert";

const LastContactedList = ({ isVisible, onClose, onsuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  // Handle save button click
  const handleSave = () => {
    if (!phoneNumber) {
      showSweetAlert({
        title: "Error",
        text: "Please enter a valid phone number.",
        icon: "error",
      });
      return;
    }

    try {
      onsuccess(); // Trigger success callback
      onClose(); // Close the modal
      showSweetAlert({
        title: "Phone Number Saved Successfully",
        text: `Phone Number: ${phoneNumber}`,
        icon: "success",
      });
    } catch (err) {
      showSweetAlert({
        title: "Failed",
        text: err.message || "An error occurred while saving the phone number.",
        icon: "error",
      });
    }
  };

  return (
    <div isOpen={isVisible} toggle={onClose} fade={false}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
          <ModalHeader toggle={onClose}>Enter Phone Number</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mb-4"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSave} className="uniform_btn">
              send
            </Button>
          </ModalFooter>
        </div>
      </div>
    </div>
  );
};

export default LastContactedList;
