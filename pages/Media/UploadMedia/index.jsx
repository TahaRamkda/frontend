import { useState, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup"; // For form validation
import { useDispatch } from "react-redux";
import { uploadMedia, clearMediaUploadState } from "@/slices/MediaSlice";
import showSweetAlert from "@/components/Sweetalert";
import Sendernames from "@/components/Dropdowns/SendernameDropdown";
import { set } from "immutable";

const UploadMediaPage = ({ onUploadSuccess, onsenderChange, ispopUp }) => {
  const dispatch = useDispatch();
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const fileInputRef = useRef(null);
  // Form validation schema
  const validationSchema = Yup.object().shape({
    senderId: Yup.string().required("Sender name is required"),
    MediaFile: Yup.mixed().required("Media file is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("SenderNameId", values.senderId); // Use Formik's value
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
        fileInputRef.current.value = null; // Clear file input
        resetForm();
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
    setSelectedSenderId(e.target?.value);
    if (onsenderChange) {
      onsenderChange(e.target?.value);
    }
  };

  return (
    <Formik
      initialValues={{ senderId: "", MediaFile: null }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, isSubmitting, resetForm }) => (
        <Form>
          {!ispopUp && (
            <label className="font-medium text-gray-700 text-sm">
              Sender Names
            </label>
          )}
          <div className="grid grid-cols-4 gap-4 mb-5 ">
            {!ispopUp && (
              <div className="col-span-1 ">
                {/* Sendernames Dropdown */}
                <Sendernames
                  name="senderId"
                  value={values.senderId}
                  onChange={(e) => {
                    setFieldValue("senderId", e.target?.value);
                    handleSenderChange(e.target.value); // Make sure to pass the value, not the event
                  }}
                  required
                />
                <ErrorMessage
                  name="senderId"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

            {/* File Upload */}
            <div className="col-span-2  ">
              <input
                type="file"
                className="form-control border rounded py-1 px-2"
                style={{ lineHeight: "2" }}
                accept="image/*,video/*,audio/*,.pdf"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setFieldValue("MediaFile", file || null);
                }}
                ref={fileInputRef} // Attach the ref here
                required
              />
              <ErrorMessage
                name="MediaFile"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            {ispopUp && <div className=""></div>}
            {/* Submit Button */}
            <div className="flex justify-end mt-1 ">
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
  );
};

export default UploadMediaPage;
