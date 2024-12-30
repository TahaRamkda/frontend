import { useState } from "react";
import { Formik, Form } from "formik";
import { FormGroup, Input, Container, Row, Col, Button, Modal, ModalBody,ModalHeader} from "reactstrap";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { bulkUpload,clearBulkUploadState } from "@/slices/ContactSlice";
import showSweetAlert from "@/components/Sweetalert";
import Sendernames from "@/components/Dropdowns/SendernameDropdown";
//import samplefile from '@/public/assets/Sample_File.xlsx'
const BulkUpload = ({ onClose, onsuccess,isVisible }) => {
  const dispatch = useDispatch();
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [FieldValue, setFieldValue] = useState(null); // Track uploaded file URL

  const handleSubmit = async (values, { setSubmitting }) => {
    
    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("File", values.UploadFile);
    formData.append("ActionBy", localStorage.getItem("userId"));
    try {
      const response = await dispatch(bulkUpload(formData)).unwrap();
      onClose()
      onsuccess();
      if (response.success ) {
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
    <Modal  isOpen={isVisible} toggle={onClose} fade={false}>
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
            {({  isSubmitting }) => (
              <Form>
                <div className="">
                  <div className="">
                  <Input
                    type="file"
                    className="form-control"
                    accept=".xls,.xlsx,image/*,video/*,audio/*,.pdf"
                    required
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("UploadFile", file || null);
                    }}
                  />
                  </div>
                  <div className=" flex gap-4 w-full">
                  <div className="mt-4 flex justify-start"><a href="/assets/Sample_File.xlsx" download className="">Sample </a></div>
                  <div className="mt-4 flex text-end">
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
