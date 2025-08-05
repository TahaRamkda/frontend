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
import { agentChangePassword } from "@/slices/AgentSlice";

const AgentChangePass = ({ isVisible, onClose, agentId,clientId }) => {
  const [formData, setFormData] = useState({
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
   
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    debugger
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const requestBody = {
      clientId: clientId,
      userId:agentId,
      newPassword: formData.newPassword,
      actionBy:0
    };

    try {
      const response = await dispatch(agentChangePassword(requestBody));
      if (response.payload.status === 1) {
        showSweetAlert({
          title: "Success",
          text: response.payload.message || "Changed Successfuly",
          icon: "success",
        });
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
      <ModalHeader toggle={onClose}>Change Password</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          
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
          <ModalFooter>
            <button className="uniform_btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </ModalFooter>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AgentChangePass;
