import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addSettings,
  clearAppSettingCreateState,
} from "@/slices/AppSettingSlice";
import showSweetAlert from "@/components/Sweetalert";
import { useRouter } from "next/navigation";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import App from "@/components/Layout/App";
import Loader from "@/components/Layout/Loader";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
const SettingForm = ({ onClose, isVisible, onsuccess }) => {
  const [formData, setFormData] = useState({
    keyName: "",
    val: "",
    senderId: 0,
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
    };
    if (formData.keyName === "") {
      alert("Group Name Cannot be empty");
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await dispatch(addSettings(requestBody)).unwrap();
      if (response.status === 1) {
        showSweetAlert({
          title: "Created Successfully",
          text: "",
          icon: "success",
        });
        clearAppSettingCreateState();
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
            {/* Move loader inside the modal content div with higher z-index */}
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center z-50 ">
                <Loader />
              </div>
            )}
            <ModalHeader toggle={onClose}>Create Group</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <div>
                   <div>
                  <label className="font-medium text-gray-700 text-sm">Sender Name</label>
                  <SendernameDropdown name="senderId" value={formData.senderId} onChange={handleChange} />
                </div>
                </div>
                <div>
                  <label className="font-medium text-gray-700 text-sm">
                    Key Name
                  </label>
                  <input
                    required
                    type="text"
                    name="keyName"
                    value={formData.keyName}
                    onChange={handleChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700 text-sm">
                  Value
                  </label>
                  <input
                    required
                    type="text"
                    name="val"
                    value={formData.val}
                    onChange={handleChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex mt-6 justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 uniform_btn"
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

export default SettingForm;
