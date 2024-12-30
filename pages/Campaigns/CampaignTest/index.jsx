import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label } from "reactstrap";
import showSweetAlert from "@/components/Sweetalert";
// import { fetchCampaign, clear } from "@/slices/CampaignSlice";

const CampaignTest = ({ isVisible, onClose, onsuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
 

  //  useEffect(() => {
  //     if (clientId) {
  
  //       dispatch(fetchCampaign({ ClientId: clientId}));
  //     }
  //     return () => {
  //       dispatch(clearCampaignListState());
  //     };
  //   }, [dispatch, clientId]);
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
    <Modal isOpen={isVisible} toggle={onClose} fade={false}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
          <ModalHeader toggle={onClose}>Test Campaign</ModalHeader>
          <ModalBody>
            <Label>Phone Number</Label>
            <Input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mb-4"
            />
            <div className="w-full mt-4 text-end">
              <Button color="primary" onClick={handleSave} className="uniform_btn">
                   Send
                  </Button>
              </div>
          </ModalBody>
          
       
        </div>
      </div>
    </Modal>
  );
};

export default CampaignTest;
