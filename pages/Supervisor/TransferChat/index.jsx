import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
} from "reactstrap";
import App from "@/components/App";
import Agentsdrop from "@/components/Dropdowns/ActiveAgentsDropdown";
import { Transferchat } from "@/slices/ConversationSlice";
import Sweetalert from "sweetalert2";

const TransferChat = ({ ChatId, onClose, isVisible ,SenderId ,oldAgentId}) => {
  const dispatch = useDispatch();
  const { loading ,message} = useSelector((state) => state.conversations);
  const [agentId, setAgentId] = useState(0);
  const [comment, setComment] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    
    const clientId = localStorage.getItem("clientId");
  
    if (agentId) {
      const response = await dispatch(Transferchat({
        ChatId,
        AgentId: agentId,
        Comment: comment,
        oldAgentId:oldAgentId,
        clientId
      }));
  
      if (response.payload?.success) {
        Sweetalert.fire({
          icon: "success",
          title: "Success",
          text: "Chat transferred successfully!",
        });
        onClose(); // Close the modal
      } else {
        Sweetalert.fire({
          icon: "error",
          title: "Error",
          text: response.payload?.message || "Failed to transfer chat. Please try again.",
        });
      }
    } 
  };
  

  return (
    <App>
      <Modal isOpen={isVisible} toggle={onClose} fade={false}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
            <ModalHeader toggle={onClose}>Transfer Chat</ModalHeader>
            <ModalBody>
              <form onSubmit={handleTransfer}>
              <div className="p-4 w-full h-full">
                <div className="mb-4">
                <label className="font-medium text-gray-700 text-sm">Active Agents</label>
                  <Agentsdrop
                    SenderId={SenderId}
                    Agentid={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                <label className="font-medium text-gray-700 text-sm">Comment</label>
                  <Input
                    type="textarea"
                    placeholder="Enter a text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    
                  />
                </div>
                <div className="flex justify-end">
                  <Button className="uniform_btn" type="submit"  >
                    Transfer
                  </Button>
                </div>
              </div>
              </form>
            </ModalBody>
          </div>
        </div>
      </Modal>
    </App>
  );
};

export default TransferChat;
