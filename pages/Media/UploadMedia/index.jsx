import { useState } from "react";
import { Formik, Form } from "formik";
import { FormGroup, Input, Container, Row, Col, Button, Modal } from "reactstrap";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { uploadMedia, clearMediaUploadState } from "@/slices/MediaSlice";
import showSweetAlert from "@/components/Sweetalert";
import Sendernames from "@/components/Dropdowns/SendernameDropdown";
const UploadMediaPage = ({ setIsModalOpen, onUploadSuccess }) => {
  const dispatch = useDispatch();
  const [selectedSenderId, setSelectedSenderId] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("SenderNameId", selectedSenderId);
    formData.append("File", values.MediaFile);
    formData.append("ActionBy", localStorage.getItem("userId"));

    try {
      const response = await dispatch(uploadMedia(formData)).unwrap();
      if (response.success) {
        dispatch(clearMediaUploadState());
        setSubmitting(false);
        showSweetAlert({
          title: "Uploaded Successfully",
          text: "",
          icon: "success",
        });
        onUploadSuccess();
        // window.location.reload();
      } else {
        showSweetAlert({
          title: "Failed",
          text: response.result.message || "",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Failed to Upload", err);
      showSweetAlert({
        title: "Failed",
        text: err.message || "",
        icon: "error",
      });
    }
  };

  const handleSenderChange = (e) => {
    setSelectedSenderId(e.target.value);
  };

  return (
    
<div className="grid grid-cols-3 gap-3 mb-3">
  <div className="col-span-1">
  <label className="font-medium text-gray-700 text-sm">Sender Names</label>
  <Sendernames name="senderId" value={selectedSenderId} onChange={handleSenderChange} />
  </div>
  <div className="col-span-2">
  <Formik
    initialValues={{ MediaFile: null }}
    onSubmit={handleSubmit}
  >
    {({ setFieldValue, isSubmitting }) => (
      <Form>
       <div className="grid grid-cols-4 mt-9">
        <div className="col-span-3">
          <input
            type="file"
            className="form-control border rounded py-1 px-2"
            accept="image/*,video/*,audio/*,.pdf"
            required
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              setFieldValue("MediaFile", file || null);
            }}
          />
          </div>
         
          
          <div className="flex justify-end mr-1">
          <button
            type="submit"
            className="uniform_btn px-4 py-2"
            disabled={isSubmitting}
          >
            Upload
          </button>
          </div>
          </div>
    
      </Form>
    )}
  </Formik>
  </div>
</div>

      
  );
};

export default UploadMediaPage;
