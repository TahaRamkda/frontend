import { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser, clearUserCreateState } from "@/slices/UserSlice"; // Assuming this action exists
import showSweetAlert from "@/components/Sweetalert"; // Import your SweetAlert utility
import { useRouter } from "next/navigation";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import RolesDropdown from "@/components/MultiSelect/RoleDropdown";
import App from '@/components/Layout/App';

const UserForm = ({ onClose, isVisible, onsuccess }) => {
  const [SelectedRoleId, setSelectedRoleId] = useState("")
  const [formData, setFormData] = useState({
    userName: "",
    isActive: true,
    fullName: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);


  const dispatch = useDispatch();
  const router = useRouter();

  const handleRoleChange = (value) => {
    if (Array.isArray(value)) {
      setSelectedRoleId(value.join(",")); // Join the array into a comma-separated string
    } else {
      setSelectedRoleId(value);
    }
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value, // Use checked for checkboxes
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requestBody = {
      ...formData,
      actionBy: localStorage.getItem("userId"),
      clientId: localStorage.getItem("clientId"),
      userRoles: SelectedRoleId,
    };

    try {

      const response = await dispatch(createUser(requestBody)).unwrap();
      if (response.status === 1) {
        showSweetAlert({
          title: "Created Successfully",
          text: "",
          icon: "success",
        });
        clearUserCreateState();
        onsuccess();
        onClose();

      } else {
        throw new Error(response.message || "Creation failed");
      }
    } catch (err) {
      console.error("Failed to create:", err);
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

                  <label className="font-medium text-gray-700 text-sm">User Role</label>
                  <RolesDropdown
                    required
                    name="userRoles"
                    value={formData.userRoles}
                    onChange={handleRoleChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
                  />
                  <label className="font-medium text-gray-700 text-sm">Full Name</label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
                  />
                  <label className="font-medium text-gray-700 text-sm">User Name</label>
                  <input
                    required
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
                  />
                  <label className="font-medium text-gray-700 text-sm">Password</label>
                  <input
                    required
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
                  />
                  <label className="font-medium text-gray-700 text-sm">Is Active?</label>
                  <input
                    required
                    type="checkbox"
                    name="isActive"
                    value={formData.isActive}
                    onChange={handleChange}
                    className="border rounded py-1 px-2 ml-2 text-sm"
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

export default UserForm;
