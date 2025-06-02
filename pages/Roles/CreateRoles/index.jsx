import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { createRole, clearRoleCreateState } from "@/slices/RoleSlice";
import * as Yup from "yup";
import { Row, Modal, ModalBody, ModalHeader } from "reactstrap";
import showSweetAlert from "@/components/Sweetalert";
import { useRouter } from "next/navigation";
import App from "@/components/Layout/App"
// Validation Schema using Yup
const validationSchema = Yup.object({
  role_Name: Yup.string().required("Role Name is required"),
});

const RoleForm = ({ isVisible, onClose, onsuccess }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const HandleCancle = () => {
    router.push(`/Roles/Roleslist`);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const requestBody = {

      roleName: values.role_Name, // add client id here
      clientId: localStorage.getItem("clientId"),
      actionBy: localStorage.getItem("userId"),
    };

    try {
      const response = await dispatch(createRole(requestBody)).unwrap();
      
      if (response.status === 1) {
        clearRoleCreateState();
        onClose()
        onsuccess()
        showSweetAlert({
          title: "Created Successfully",
          text: "",
          icon: "success",
        });

      } else {
        setSubmitting(false); // Stop form submission state
        // Show error alert with response message
        showSweetAlert({
          title: "Failed",
          text: response.message || "",
          icon: "error",
        });
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to create Role", err);
      setSubmitting(false); // Stop form submission state
      // Show error alert with response message
      showSweetAlert({
        title: "Failed",
        text: err.message || "",
        icon: "error",
      });
      //window.location.reload();
    }
  };

  return (
    <App>
      <Modal isOpen={isVisible} toggle={onClose} fade={false}>

        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/5  relative">
            <ModalHeader toggle={onClose}>Create Contact </ModalHeader>
            <ModalBody>
              <Formik
                initialValues={{
                  role_Name: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="role_Name" className="font-medium text-gray-700 text-sm">
                          Role Name
                        </label>
                        <Field
                          name="role_Name"
                          type="text"
                          className={`border rounded py-1 px-2 w-full text-sm ${errors.role_Name && touched.role_Name ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        <ErrorMessage name="role_Name" component="div" className="text-sm text-red-500 mt-1" />
                      </div>
                    </div>
                    <div className="flex justify-end w-full">
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

export default RoleForm;
