import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label } from "reactstrap";
import showSweetAlert from "@/components/Sweetalert";
 import { sendCampaign, clearCampaignSendState } from "@/slices/CampaignSlice";

const CampaignTest = ({ isVisible, onClose, onsuccess,CampaignId }) => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState("");
 const[activatecampaignId, setactivatecampaignId] = useState(0);



 useEffect(() => {
   if(CampaignId)
   {
    setactivatecampaignId(CampaignId)
   }
 },[CampaignId])
  //  useEffect(() => {
  //     if (clientId) {
  
  //       dispatch(fetchCampaign({ ClientId: clientId}));
  //     }
  //     return () => {
  //       dispatch(clearCampaignListState());
  //     };
  //   }, [dispatch, clientId]);
  // Handle save button click
  const handleSave = async () => {
    if (phoneNumber !== "") {
      const Requestbody = {
        campaignId : activatecampaignId,
        phoneNumbers: [
          phoneNumber
  ]
}
  const response = await dispatch(sendCampaign(Requestbody)).unwrap();
      if (response) {
        showSweetAlert({
          title: "Message Sent Successfully",
          text: `Phone Number: ${phoneNumber}`,
          icon: "success",
        });
        onClose();
      } else {
        showSweetAlert({
          title: "Error",
          text: "Failed to Send Message.",
          icon: "error",
        });
      }
      
     
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
              <Button color="primary" onClick={() => handleSave()} className="uniform_btn">
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
