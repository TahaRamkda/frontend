"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import {
  createSendername,
  clearSendernameCreateState,
} from "@/slices/sendernameSlice"; // Assuming this action exists
import * as Yup from "yup"; // For validation schema
import { Row, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useRouter } from "next/navigation";
import showSweetAlert from "@/components/Sweetalert"; // Import your SweetAlert utility
import ClientDropdown from "@/components/Dropdowns/ClientDropdown";
import App from "@/components/Layout/App";
// Validation Schema using Yup
const validationSchema = Yup.object({
  client_Id: Yup.string().required("Client is required"), // client_Id from dropdown
  sender_Name: Yup.string().required("Sender Name is required"),
  phone_Number: Yup.string().required("Phone Number is required"),
});

const SenderNameForm = ({ onClose, onsuccess, isVisible }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const HandleCancel = () => {
    router.push(`/SenderNames/SenderNamelist`);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const requestBody = {
      clientId: values.client_Id,
      senderName: values.sender_Name,
      phoneNumber: values.phone_Number,
      phoneId: values.phone_Id,
      appId: values.app_Id,
      limit: values.limit,
      quality: values.quality,
      actionBy: localStorage.getItem("userId"),
    };

    try {
      const response = await dispatch(createSendername(requestBody)).unwrap();
      if (response.success) {
        clearSendernameCreateState();
        onClose();
        onsuccess();
        setSubmitting(false);
        showSweetAlert({
          title: "Created Successfully",
          text: "",
          icon: "success",
        });
        router.push("/SenderNames/SenderNamelist");
      } else {
        setSubmitting(false);
        showSweetAlert({
          title: "Creation Failed",
          text: response.message || "",
          icon: "error",
        });
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to create", err);
      setSubmitting(false);
      showSweetAlert({
        title: "Creation Failed",
        text: err.message || "",
        icon: "error",
      });
      window.location.reload();
    }
  };

  return (
    <App>
      <Modal isOpen={isVisible} toggle={onClose} fade={false}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/5  relative">
            <ModalHeader toggle={onClose}>Create Sender Name </ModalHeader>
            <ModalBody>
              <Formik
                initialValues={{
                  client_Id: "",
                  sender_Name: "",
                  phone_Number: "",
                  phone_Id: "",
                  app_Id: "",
                  limit: 0,
                  quality: 0,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values, setFieldValue, isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Client
                      </label>
                      <ClientDropdown
                        name="client_Id"
                        value={values.client_Id}
                        onChange={(e) =>
                          setFieldValue("client_Id", e.target.value)
                        }
                        className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage
                        name="client_Id"
                        component="span"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sender Name
                      </label>
                      <Field
                        name="sender_Name"
                        type="text"
                        className={`block w-full border ${errors.sender_Name && touched.sender_Name
                            ? "border-red-500"
                            : "border-gray-300"
                          } rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <ErrorMessage
                        name="sender_Name"
                        component="span"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <Field
                        name="phone_Number"
                        type="text"
                        className={`block w-full border ${errors.phone_Number && touched.phone_Number
                            ? "border-red-500"
                            : "border-gray-300"
                          } rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <ErrorMessage
                        name="phone_Number"
                        component="span"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Limit
                      </label>
                      <Field
                        name="limit"
                        type="number"
                        className={`block w-full border ${errors.limit && touched.limit
                            ? "border-red-500"
                            : "border-gray-300"
                          } rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <ErrorMessage
                        name="limit"
                        component="span"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quality
                      </label>
                      <Field
                        name="quality"
                        type="number"
                        className={`block w-full border ${errors.quality && touched.quality
                            ? "border-red-500"
                            : "border-gray-300"
                          } rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <ErrorMessage
                        name="quality"
                        component="span"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div className="flex justify-end w-full">
                      <button
                        type="submit"
                        className="uniform_btn"
                        disabled={isSubmitting}
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

export default SenderNameForm;
