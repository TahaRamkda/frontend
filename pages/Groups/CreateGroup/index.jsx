import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGroup,clearGroupCreateState,fetchGroup,setPageSize, setCurrentPage } from "@/slices/GroupSlice"; // Assuming this action exists
import showSweetAlert from "@/components/Sweetalert"; // Import your SweetAlert utility
import { useRouter } from "next/navigation";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import App from '@/components/App';

const GroupForm = ({onClose, isVisible, onsuccess}) => {
  const [formData, setFormData] = useState({
    groupName: "",
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
      const response = await dispatch(createGroup(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: "Group Created",
          text: response.message || "The Group has been successfully created.",
          icon: "success",
        });
        clearGroupCreateState();
        onsuccess();
        onClose();
        
      } else {
        throw new Error(response.message || "Creation failed");
      }
    } catch (err) {
      console.error("Failed to create Group:", err);
      showSweetAlert({
        title: "Creation Failed",
        text: err.message || "Failed to create Group. Please try again.",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <App>
      <Modal isOpen={isVisible} toggle={onClose} fade={false}>
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
        <ModalHeader toggle={onClose}>Create Group</ModalHeader>
        <ModalBody>
      <form onSubmit={handleSubmit} >
        <div>
          <label className="block mb-1 mt-1">Group Name</label>
          <input
          required
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
       
        <div className="flex mt-6 justify-end">
  <button
    type="submit"
    disabled={isSubmitting}
    className=" px-4 py-2 uniform_btn"
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

export default GroupForm;
