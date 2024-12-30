import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGroup,clearGroupCreateState,fetchGroup,setPageSize, setCurrentPage } from "@/slices/Groupslice"; // Assuming this action exists
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
    if(formData.groupName === ''){
      alert("Group Name Cannot be empty")
    }
    try {
      const response = await dispatch(createGroup(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: "Created Successfully",
          text: "",
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
        title: "Failed",
        text: err.message,
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
          <label className="font-medium text-gray-700 text-sm">Group Name</label>
          <input
          required
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
            className="border rounded py-1 px-2 w-full mt-1 text-sm"
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
