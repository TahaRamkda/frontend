import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState, useEffect } from "react"; // Added useEffect for group loading
import { useDispatch } from "react-redux";
import { createContact, clearContactCreateState } from "@/slices/ContactSlice";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Loader from "@/components/Layout/Loader";
import { Row, Modal, ModalBody, ModalHeader } from "reactstrap";
import showSweetAlert from "@/components/Sweetalert";
import GroupDropdown from "@/components/Dropdowns/GroupDropdown";
import App from "@/components/Layout/App";

const validationSchema = Yup.object({
  groupId: Yup.string().required("Group is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
});

const ContactForm = ({ isVisible, onClose, onsuccess }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [createLoading, setCreateLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false); // New state for group loading

  // Simulate fetching groups (replace with actual logic if GroupDropdown fetches data)
  useEffect(() => {
    if (isVisible) {
      setGroupLoading(true);
      // Simulate an async call (replace with actual group fetching if needed)
      setTimeout(() => setGroupLoading(false), 1000); // Example delay
    }
  }, [isVisible]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setCreateLoading(true);
    const requestBody = {
      ClientId: localStorage.getItem("clientId"),
      contact_Id: 0,
      groupId: values.groupId,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      emailAddress: values.emailAddress,
      areaName: values.areaName,
      actionBy: localStorage.getItem("userId"),
    };

    try {
      const response = await dispatch(createContact(requestBody)).unwrap();
      debugger
      if (response.status === 1) {
        dispatch(clearContactCreateState()); // Fixed typo
        onsuccess();
        onClose();
        setSubmitting(false);
        setCreateLoading(false); // Reset loading state
        showSweetAlert({
          title: "Created Successfully",
          text: "",
          icon: "success",
        });
      } else {
        setSubmitting(false);
        setCreateLoading(false);
        showSweetAlert({
          title: "Failed",
          text: response.message || "",
          icon: "error",
        });
        
      }
    } catch (err) {
      console.error("Failed to create Contact", err);
      setSubmitting(false);
      setCreateLoading(false);
      showSweetAlert({
        title: "Failed",
        text: err.message || "",
        icon: "error",
      });
    }
  };

  return (
    <App>
      <Modal isOpen={isVisible} toggle={onClose} fade={false}>
        {/* Full-screen loader during creation */}
        {createLoading && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <Loader />
          </div>
        )}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
            <ModalHeader toggle={onClose}>Create Contact</ModalHeader>
            <ModalBody className="max-h-[60vh] overflow-auto">
              <Formik
                initialValues={{
                  groupId: "",
                  firstName: "",
                  lastName: "",
                  phoneNumber: "",
                  emailAddress: "",
                  areaName: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values, setFieldValue, isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="relative">
                      <label className="font-medium text-gray-700 text-sm">Group</label>
                      {groupLoading ? (
                        <div className="border rounded py-1 px-2 w-full text-sm flex items-center justify-center">
                          <Loader /> {/* Loader inside dropdown */}
                        </div>
                      ) : (
                        <GroupDropdown
                          name="groupId"
                          value={values.groupId}
                          onChange={(e) => setFieldValue("groupId", e.target.value)}
                          className={`border rounded py-1 px-2 w-full text-sm ${
                            errors.groupId && touched.groupId ? "border-red-500" : ""
                          }`}
                        />
                      )}
                      <ErrorMessage
                        name="groupId"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="firstName" className="font-medium text-gray-700 text-sm">
                        First Name
                      </label>
                      <Field
                        name="firstName"
                        type="text"
                        className={`border rounded py-1 px-2 w-full text-sm ${
                          errors.firstName && touched.firstName ? "border-red-500" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="font-medium text-gray-700 text-sm">
                        Last Name
                      </label>
                      <Field
                        name="lastName"
                        type="text"
                        className={`border rounded py-1 px-2 w-full text-sm ${
                          errors.lastName && touched.lastName ? "border-red-500" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="font-medium text-gray-700 text-sm">
                        Phone Number
                      </label>
                      <Field
                        name="phoneNumber"
                        type="text"
                        className={`border rounded py-1 px-2 w-full text-sm ${
                          errors.phoneNumber && touched.phoneNumber ? "border-red-500" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="emailAddress" className="font-medium text-gray-700 text-sm">
                        Email Address
                      </label>
                      <Field
                        name="emailAddress"
                        type="email"
                        className={`border rounded py-1 px-2 w-full text-sm ${
                          errors.emailAddress && touched.emailAddress ? "border-red-500" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="emailAddress"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="areaName" className="font-medium text-gray-700 text-sm">
                        Area Name
                      </label>
                      <Field
                        name="areaName"
                        type="text"
                        className={`border rounded py-1 px-2 w-full text-sm ${
                          errors.areaName && touched.areaName ? "border-red-500" : ""
                        }`}
                      />
                      <ErrorMessage
                        name="areaName"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || createLoading || groupLoading} // Disable during loading
                        className="uniform_btn"
                      >
                        Create
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </ModalBody>
          </div>
        </div>
      </Modal>
    </App>
  );
};

export default ContactForm;