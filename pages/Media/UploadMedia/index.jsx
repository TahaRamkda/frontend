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
    <Container fluid className="d-flex">
      <Row className="w-100">
      <Col className="rounded">
   
         
            <label className="font-medium text-gray-700 text-sm">Sender Names</label>
            <Sendernames name="senderId" value={selectedSenderId} onChange={handleSenderChange} />
          <Formik
            initialValues={{ MediaFile: null }}
            onSubmit={handleSubmit}
          >
            
            {({ setFieldValue, isSubmitting }) => (
             
              <Form>
                <FormGroup className="d-flex align-items-center gap-2">
                
                  <Input
                    type="file"
                    className="form-control"
                    accept="image/*,video/*,audio/*,.pdf"
                    required
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("MediaFile", file || null);
                    }}
                  />
                   <Button className="uniform_btn" type="submit" disabled={isSubmitting}>
                    Upload 
                  </Button>
                  
                  </FormGroup>
              </Form>
              
            )}
          </Formik>
         
          </Col>
          </Row>
          </Container>
  );
};

export default UploadMediaPage;
