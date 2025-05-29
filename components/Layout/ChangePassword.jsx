import { useState } from "react";
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
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { changePassword } from "@/slices/AuthSlice";

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
      newErrors.newPassword = "New password must be at least 6 characters long.";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
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
      if (response.payload.status === 1) {
        showSweetAlert({
          title: "Success",
          text: response.payload.message || "Changed Successfuly",
          icon: "success",
        });
        onsuccess?.();
        onClose?.();
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

  const eyeIconStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    zIndex: 1,
  };

  const inputContainerStyle = {
    position: "relative",
  };

  return (
    <Modal isOpen={isVisible} fade={false} centered>
      <ModalHeader>Change Password</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="oldPassword">Old Password</Label>
            <div style={inputContainerStyle}>
              <Input
                type={showOld ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="*******"
                value={formData.oldPassword}
                onChange={handleChange}
                invalid={!!errors.oldPassword}
              />
              <FaEyeSlash
                style={showOld ? { ...eyeIconStyle, display: "none" } : eyeIconStyle}
                onClick={() => setShowOld(!showOld)}
              />
              <FaEye
                style={!showOld ? { ...eyeIconStyle, display: "none" } : eyeIconStyle}
                onClick={() => setShowOld(!showOld)}
              />
              <FormFeedback>{errors.oldPassword}</FormFeedback>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="newPassword">New Password</Label>
            <div style={inputContainerStyle}>
              <Input
                type={showNew ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                placeholder="*******"
                value={formData.newPassword}
                onChange={handleChange}
                invalid={!!errors.newPassword}
              />
              <FaEyeSlash
                style={showNew ? { ...eyeIconStyle, display: "none" } : eyeIconStyle}
                onClick={() => setShowNew(!showNew)}
              />
              <FaEye
                style={!showNew ? { ...eyeIconStyle, display: "none" } : eyeIconStyle}
                onClick={() => setShowNew(!showNew)}
              />
              <FormFeedback>{errors.newPassword}</FormFeedback>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="confirmPassword">Confirm Password</Label>
            <div style={inputContainerStyle}>
              <Input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="*******"
                value={formData.confirmPassword}
                onChange={handleChange}
                invalid={!!errors.confirmPassword}
              />
              <FaEyeSlash
                style={showConfirm ? { ...eyeIconStyle, display: "none" } : eyeIconStyle}
                onClick={() => setShowConfirm(!showConfirm)}
              />
              <FaEye
                style={!showConfirm ? { ...eyeIconStyle, display: "none" } : eyeIconStyle}
                onClick={() => setShowConfirm(!showConfirm)}
              />
              <FormFeedback>{errors.confirmPassword}</FormFeedback>
            </div>
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
    </Modal>
  );
};

export default ChangePass;
