import { useState} from "react";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import { FormGroup, Input, Container, Row, Col, Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "@/components/Layout/Loader";
import { bulkUpload, clearBulkUploadState } from "@/slices/ContactSlice";
import showSweetAlert from "@/components/Sweetalert";
import Sendernames from "@/components/Dropdowns/SendernameDropdown";
//import samplefile from '@/public/assets/Sample_File.xlsx'
const BulkUpload = ({ onClose, onsuccess, isVisible }) => {
  const dispatch = useDispatch();
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [FieldValue, setFieldValue] = useState(null); // Track uploaded file URL
  const {  loading, error} = useSelector((state) => state.contacts);
  const handleSubmit = async (values, { setSubmitting }) => {
    
    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("File", FieldValue);
    formData.append("ActionBy", localStorage.getItem("userId"));
    try {
      debugger
      const response = await dispatch(bulkUpload({contactData:formData})).unwrap();
      debugger
      onClose()
      onsuccess();
      if (response.data.success) {
        dispatch(clearBulkUploadState());
        setSubmitting(false);

        showSweetAlert({
          title: "Uploaded Successfully",
          text: "",
          icon: "success",
        });

        // window.location.reload();
      } else {
        showSweetAlert({
          title: "Failed",
          text: response.data.message || "",
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
    <Modal isOpen={isVisible} toggle={onClose} fade={false}> 
      {loading && <Loader />}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center ">
        <div className="bg-white p-6 rounded shadow-lg w-2/5  relative">

          <ModalHeader toggle={onClose}>Bulk Upload</ModalHeader>
          <ModalBody>



            <div >
              <div className="col-span-4">
                <Formik
                  initialValues={{ UploadFile: null }}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="">
                        <div className="">
                          <Input
                            type="file"
                            className="form-control"
                            accept=".xls,.xlsx"
                            required
                            onChange={(event) => {
                              const file = event.currentTarget.files[0];
                              setFieldValue(file);
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center w-full mt-4">
                          {/* Link aligned to the start */}
                          <div>
                            <a href="/assets/Sample_File.xlsx" download className="text-blue-500 hover:underline">
                              Download Sample File
                            </a>
                          </div>
                          {/* Button aligned to the end */}
                          <div>
                            <Button className="uniform_btn" type="submit" disabled={isSubmitting}>
                              Upload
                            </Button>
                          </div>
                        </div>

                      </div>
                    </Form>
                  )}
                </Formik>
                {/* Download File Button */}



              </div>

            </div>
          </ModalBody>
        </div>
      </div>
    </Modal>


  );
};

export default BulkUpload;
