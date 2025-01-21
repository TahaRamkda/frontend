import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createAgentsShift, clearAgentShiftCreateState } from "@/slices/AgentsShift";
import showSweetAlert from "@/components/Sweetalert"; // Import your SweetAlert utility
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table, Input } from "reactstrap";
import { useRouter } from "next/navigation";
import App from '@/components/Layout/App';

const AgentsShiftForm = ({ onClose, isVisible, onsuccess }) => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    agentFName: "",
    agentLName: "",
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

 
  const handleSubmit = async (e) => {

    e.preventDefault();
    setIsSubmitting(true);

    const requestBody = {
      ...formData,
      actionBy: localStorage.getItem("userId"),
      clientId: localStorage.getItem("clientId"),

    };

    try {
      const response = await dispatch(createAgentsShift(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: "Created Successfully",
          text: "",
          icon: "success",
        });
        clearAgentShiftCreateState()
        onsuccess()
        onClose()
      } else {
        throw new Error(response.message || "Creation failed");
      }
    } catch (err) {
      console.error("Failed to create agent:", err);
      showSweetAlert({
        title: "Failed",
        text: err.message || "",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <App>
      <Modal isOpen={isVisible} toggle={onClose} fade={false}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center ">
          <div className="bg-white p-6 rounded shadow-lg w-2/5  relative">

            <ModalHeader toggle={onClose}>Create Agent Shift</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                  <label className="font-medium text-gray-700 text-sm">First Name</label>
                  <input
                    required
                    type="text"
                    name="agentFName"
                    value={formData.agentFName}
                    onChange={handleChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 text-sm">Last Name</label>
                  <input
                    required
                    type="text"
                    name="agentLName"
                    value={formData.agentLName}
                    onChange={handleChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700 text-sm">User Name</label>
                  <input
                    required
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 text-sm">Password</label>
                  <input
                    required
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
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

export default AgentsShiftForm;
