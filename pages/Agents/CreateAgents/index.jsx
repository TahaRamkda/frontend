import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createAgent } from "@/slices/AgentSlice"; // Assuming this action exists
import showSweetAlert from "@/components/Sweetalert"; // Import your SweetAlert utility
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table, Input } from "reactstrap";
import { useRouter } from "next/navigation";
import App from '@/components/App';
import Sendernames from "@/components/Dropdowns/SendernameDropdown";

const AgentsForm = ({onClose, isVisible}) => {
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    agentFName: "",
    agentLName: "",
    senderIds: selectedSenderId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSenderChange = (e) => {
    setSelectedSenderId(e.target.value);
  };

  const handleSubmit = async (e) => {
   
    e.preventDefault();
    setIsSubmitting(true);

    const requestBody = {
      ...formData,
      actionBy: localStorage.getItem("userId"),
      clientId: localStorage.getItem("clientId"),
    };

    try {
      const response = await dispatch(createAgent(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: "Agent Created",
          text: response.message || "The agent has been successfully created.",
          icon: "success",
        });
        router.push("/Agents/AgentsList");
      } else {
        throw new Error(response.message || "Creation failed");
      }
    } catch (err) {
      console.error("Failed to create agent:", err);
      showSweetAlert({
        title: "Creation Failed",
        text: err.message || "Failed to create agent. Please try again.",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <App>
   <Modal isOpen={isVisible} toggle={onClose}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center ">
        <div className="bg-white p-6 rounded shadow-lg w-2/5  relative">
        
        <ModalHeader toggle={onClose}>Create Agent</ModalHeader>
     <ModalBody>
      <form onSubmit={handleSubmit} className="space-y-6">
       
        <div>
        <label className="block mb-1 mt-1">Sender Name</label>
          <Sendernames name="senderId" value={selectedSenderId} onChange={handleSenderChange} />
        </div>
        <div>
          <label className="block mb-1 mt-1">User Name</label>
          <input
          required
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="border rounded py-1 px-2 w-full text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 mt-1">Password</label>
          <input
          required
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border rounded py-1 px-2 w-full text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 mt-1">First Name</label>
          <input
          required
            type="text"
            name="agentFName"
            value={formData.agentFName}
            onChange={handleChange}
            className="border rounded py-1 px-2 w-full text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 mt-1">Last Name</label>
          <input
          required
            type="text"
            name="agentLName"
            value={formData.agentLName}
            onChange={handleChange}
            className="border rounded py-1 px-2 w-full text-sm"
          />
        </div>
        <div className="flex space-x-4 justify-end">
         
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="uniform_btn"
          >
            Create
          </button>
        </div>
      </form>
      </ModalBody>
      </div>
      </div>
      </Modal>
    </App>
  );
};

export default AgentsForm;
