import React, { useState } from "react";
import { Modal, ModalBody } from "reactstrap";

const ImagePreview = ({ imageSrc }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
     
      <Modal isOpen={isOpen} toggle={toggleModal} centered>
        <ModalBody className="p-0">
          <img
            src={imageSrc}
            alt="Full Preview"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "8px",
            }}
          />
        </ModalBody>
      </Modal>
   
  );
};

export default ImagePreview;
