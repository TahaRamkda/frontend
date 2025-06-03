import { useState, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { uploadMedia, clearMediaUploadState } from "@/slices/MediaSlice";
import showSweetAlert from "@/components/Sweetalert";
import Sendernames from "@/components/Dropdowns/SendernameDropdown";
import { toast } from "react-toastify";
import { usePermissions } from "@/context/PermissionsContext";
import SearchBar from "@/components/SearchBar/SearchComponent";
const UploadMediaPage = ({
  onUploadSuccess,
  onsenderChange,
  ispopUp,
  senderId,
  handleSearch,
  filterText,
}) => {
  const dispatch = useDispatch();
  const [selectedSenderId, setSelectedSenderId] = useState(senderId || null);
  const fileInputRef = useRef(null);
  const { hasPermission } = usePermissions();

  // Form validation schema
  const validationSchema = Yup.object().shape({
    senderId: ispopUp
      ? Yup.string().nullable() // Optional when ispopUp is true
      : Yup.string().required("Sender name is required"), // Required when ispopUp is false
    MediaFile: Yup.mixed().required("Media file is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    
    if (ispopUp && (!senderId || senderId === "0")) {
      toast.error("Please Select A Sendername Before Proceeding");
      return;
    }

    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("SenderNameId", ispopUp ? senderId : values.senderId); // Use prop senderId when ispopUp is true
    formData.append("File", values.MediaFile);
    formData.append("ActionBy", localStorage.getItem("userId"));

    try {
      const response = await dispatch(uploadMedia(formData)).unwrap();
      
      if (response.status === 1) {
        dispatch(clearMediaUploadState());
        setSubmitting(false);
        showSweetAlert({
          title: "Uploaded Successfully",
          text: "",
          icon: "success",
        });
        fileInputRef.current.value = null; // Clear file input
        resetForm();
        onUploadSuccess()
      } else {
        showSweetAlert({
          title: "Failed",
          text: response.message || "",
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

  const handleSenderChange = (value) => {
    setSelectedSenderId(value);
    if (onsenderChange) {
      onsenderChange(value);
    }
  };

  return (
    <Formik
      initialValues={{
        senderId: ispopUp ? senderId || "" : "",
        MediaFile: null,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, isSubmitting, resetForm }) => (
        <Form>
         
          <div className="grid grid-cols-5 gap-4 mb-5">

          <div className={ispopUp ? `col-span-2` : `col-span-1`} >
              <SearchBar
                label="Search"
                value={filterText}
                onChange={handleSearch}
              />
            </div>
            {!ispopUp && (
              <div className="col-span-1">
                <label className="font-medium text-gray-700 text-sm mb-1">
              Sender Names
            </label>
                <Sendernames
                  name="senderId"
                  value={values.senderId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFieldValue("senderId", value);
                    handleSenderChange(value);
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
            <div className="col-span-2">
              <input
                type="file"
                className="form-control border rounded py-1 px-2 mt-[40px]"
                style={{ lineHeight: "2" }}
                accept="image/*,video/*,audio/*,.pdf"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setFieldValue("MediaFile", file || null);
                }}
                ref={fileInputRef}
                required
              />
              <ErrorMessage
                name="MediaFile"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
           
            {/* Submit Button */}
            <div className="flex justify-end mt-1">
            {hasPermission("Media", "create") && (
              <button
                type="submit"
                className="uniform_btn px-4 py-2 mt-[40px]"
                disabled={isSubmitting}
              >
                Upload
              </button>
            )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UploadMediaPage;
