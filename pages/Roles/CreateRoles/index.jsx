import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { createRole, clearRoleCreateState } from "@/slices/RoleSlice"; 
import * as Yup from "yup";
import showSweetAlert from "@/components/Sweetalert"; 
import { useRouter } from "next/navigation";
import App from "@/components/App"
// Validation Schema using Yup
const validationSchema = Yup.object({
  role_Name: Yup.string().required("Role Name is required"),
});

const CreateRole = () => {
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
      if (response.success) {
        clearRoleCreateState();
        setSubmitting(false);
        showSweetAlert({
          title: "Role Created",
          text: response.message || "The Role has been successfully created.",
          icon: "success",
        });
        router.push("/Roles/Roleslist");
      } else {
        setSubmitting(false); // Stop form submission state
        // Show error alert with response message
        showSweetAlert({
          title: "Creation Failed",
          text: response.message || "Failed to create Role. Please try again.",
          icon: "error",
        });
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to create Role", err);
      setSubmitting(false); // Stop form submission state
      // Show error alert with response message
      showSweetAlert({
        title: "Creation Failed",
        text: err.message || "Failed to create Role. Please try again.",
        icon: "error",
      });
      //window.location.reload();
    }
  };

  return (
    <App>
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
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
                <label htmlFor="role_Name" className="block text-sm font-semibold text-gray-700">
                  Role Name
                </label>
                <Field
                  name="role_Name"
                  type="text"
                  className={`mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.role_Name && touched.role_Name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <ErrorMessage name="role_Name" component="div" className="text-sm text-red-500 mt-1" />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Create
              </button>
              <button
                type="button"
                onClick={HandleCancle}
                disabled={isSubmitting}
                className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Cancle
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    </App>
  );
};

export default CreateRole;
