import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import showSweetAlert from "@/components/Sweetalert"; // Import SweetAlert utility
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";
import API from "@/utils/api.axios"; // Assuming you have a utility for API calls
import { changePassword } from "@/slices/AuthSlice";
import { FaEyeSlash, FaEye } from "react-icons/fa";
const ChangePass = ({ isVisible, onClose, onsuccess }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required.";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword =
        "New password must be at least 6 characters long.";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const requestBody = {
      clientId: localStorage.getItem("clientId"),
      userId: localStorage.getItem("userId"),
      oldPassword: formData.oldPassword,
      password: formData.newPassword,
    };

    try {
      const response = await dispatch(changePassword(requestBody));
      if (response.payload.success) {
        showSweetAlert({
          title: "Success",
          text: response.payload.message,
          icon: "success",
        });
        onsuccess?.(); // Trigger success callback if provided
        onClose?.(); // Close the modal
      } else {
        throw new Error(response.payload.message || "Password change failed");
      }
    } catch (err) {
      console.error("Password change failed:", err);
      showSweetAlert({
        title: "Failed",
        text: err.message || "An error occurred",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isVisible} toggle={onClose} fade={false}>
      <div className="fixed inset-0 bg-transparent flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
          <ModalHeader toggle={onClose}>Change Password</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormGroup>
                <Label for="oldPassword">Old Password</Label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Input
                    type={showOld ? "text" : "password"}
                    name="oldPassword"
                    id="oldPassword"
                    placeholder="Enter old password"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    invalid={!!errors.oldPassword}
                  />
                  <span
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    style={{ cursor: "pointer" }}
                  >
                    {showOld ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <FormFeedback>{errors.oldPassword}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="newPassword">New Password</Label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    invalid={!!errors.newPassword}
                  />
                  <span
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={{ cursor: "pointer" }}
                  >
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <FormFeedback>{errors.newPassword}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="confirmPassword" style={{ marginRight: "10px" }}>
                  Confirm Password
                </Label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    invalid={!!errors.confirmPassword}
                    style={{ flex: 1, marginRight: "10px" }}
                  />
                  <span
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ cursor: "pointer" }}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <FormFeedback>{errors.confirmPassword}</FormFeedback>
              </FormGroup>

              <ModalFooter>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Change Password"}
                </Button>
                <Button color="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePass;
