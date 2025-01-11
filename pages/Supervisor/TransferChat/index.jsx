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
import Agentsdrop from "@/components/Dropdowns/AgentDropdown";
import { Transferchat } from "@/slices/ConversationSlice";
import Sweetalert from "sweetalert2";

const TransferChat = ({ ChatId, onClose, isVisible ,SenderId}) => {
  const dispatch = useDispatch();
  const { loading ,message} = useSelector((state) => state.conversations);
  const [agentId, setAgentId] = useState(0);
  const [comment, setComment] = useState("");

  const handleTransfer = async () => {
    const clientId = localStorage.getItem("clientId");

    if (agentId && comment.trim()) {
      try {
        await dispatch(
          Transferchat({
            ChatId,
            AgentId: agentId,
            Comment: comment,
            clientId,
          })
        )

        Sweetalert.fire({
          icon: "success",
          title: "Success",
          text: message || "Chat transferred successfully!",
        });

        onClose();
      } catch (error) {
        Sweetalert.fire({
          icon: "error",
          title: "Error",
          text: message || "Failed to transfer chat. Please try again.",
        });
      }
    } else {
      Sweetalert.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please select an agent and write a comment.",
      });
    }
  };

  return (
    <App>
      <Modal isOpen={isVisible} toggle={onClose} fade={false}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/5 relative h-2/3">
            <ModalHeader toggle={onClose}>Transfer Chat</ModalHeader>
            <ModalBody>
              <div className="p-4 w-full h-full">
                <div className="mb-4">
                  <Agentsdrop
                    Agentid={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <Input
                    type="textarea"
                    placeholder="Write your comment here"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <Button color="primary" onClick={handleTransfer} >
                    Transfer
                  </Button>
                </div>
              </div>
            </ModalBody>
          </div>
        </div>
      </Modal>
    </App>
  );
};

export default TransferChat;
