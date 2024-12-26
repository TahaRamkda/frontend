import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { createContact, clearContactCreateState } from "@/slices/ContactSlice";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Row, Modal, ModalBody, ModalHeader } from "reactstrap";
import showSweetAlert from "@/components/Sweetalert";
import GroupDropdown from '@/components/Dropdowns/GroupsDropdown'; 
import App from '@/components/App';
const validationSchema = Yup.object({
  groupId: Yup.string().required("Group is required"), // groupId from dropdown
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
 
});

const ContactForm = ({isVisible,onClose}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  

  const HandleCancel = () => {
    router.push(`/Contacts/ContactList`);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
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
      if (response.success) {
        clearContactCreateState();
        setSubmitting(false);
        showSweetAlert({
          title: "Contact Created",
          text: response.message || "The Contact has been successfully created.",
          icon: "success",
        });
        router.push('/Contacts/ContactList');
      } else {
        setSubmitting(false);
        showSweetAlert({
          title: "Creation Failed",
          text: response.message || "Failed to create Contact. Please try again.",
          icon: "error",
        });
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to create Contact", err);
      setSubmitting(false);
      showSweetAlert({
        title: "Creation Failed",
        text: err.message || "Failed to create Contact. Please try again.",
        icon: "error",
      });
      window.location.reload();
    }
  };

  return (
    <App>
      <Modal isOpen={isVisible} toggle={onClose}>
      
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-2/5  relative">
              <ModalHeader toggle={onClose}>Create Contact </ModalHeader>
              <ModalBody>
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
            <div>
              
            <label className="block mb-1 mt-1">Group</label>
              <GroupDropdown
                name="groupId"
                value={values.groupId}
                onChange={(e) => setFieldValue("groupId", e.target.value)}
                className="border rounded py-1 px-2 w-full text-sm"
              />
              <ErrorMessage name="groupId" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
              <label htmlFor="firstName" className="block mb-1 mt-1">First Name</label>
              <input
                name="firstName"
                type="text"
                className={`border rounded py-1 px-2 w-full text-sm ${errors.firstName && touched.firstName ? "border-red-500" : ""}`}
              />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-1 mt-1">Last Name</label>
              <input
                name="lastName"
                type="text"
                className={`border rounded py-1 px-2 w-full text-sm ${errors.lastName && touched.lastName ? "border-red-500" : ""}`}
              />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block mb-1 mt-1">Phone Number</label>
              <input
                name="phoneNumber"
                type="text"
                className={`border rounded py-1 px-2 w-full text-sm ${errors.phoneNumber && touched.phoneNumber ? "border-red-500" : ""}`}
              />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs" />
            </div>
            <div>
              <label htmlFor="emailAddress" className="block mb-1 mt-1">Email Address</label>
              <input
                name="emailAddress"
                type="email"
                className={`border rounded py-1 px-2 w-full text-sm ${errors.emailAddress && touched.emailAddress ? "border-red-500" : ""}`}
              />
            </div>
            <div>
              <label htmlFor="areaName" className="block mb-1 mt-1">Area Name</label>
              <input
                name="areaName"
                type="text"
                className={`border rounded py-1 px-2 w-full text-sm ${errors.areaName && touched.areaName ? "border-red-500" : ""}`}
              />
              
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
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
