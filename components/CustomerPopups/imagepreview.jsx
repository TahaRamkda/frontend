import React, { useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { Image } from "react-bootstrap";

const ImagePreview = ({ imageSrc }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
     
      <Modal isOpen={isOpen} toggle={toggleModal} centered>
        <ModalBody className="p-0">
          <Image
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
