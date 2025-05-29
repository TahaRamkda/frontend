import { useState, useEffect, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadMedia,
  clearMediaUploadState,
  fetchMedia,
  deleteMedia,
  clearMediaState,
} from "@/slices/MediaSlice";
import showSweetAlert from "@/components/Sweetalert";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import Loader from "@/components/Layout/Loader";
import { BASE_URL } from "@/utils/apiConstants";
import UploadMedia from "../UploadMedia";
import { Image } from "react-bootstrap";
import { toast } from "react-toastify";
const MediaPopUp = ({
  isPopup,
  onSelectMedia,
  contentTypeStr,
  senderId,
  ToggleModal,
}) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [Medialist, setmediaList] = useState([]);
  const fileInputRef = useRef(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [filterText, setFilterText] = useState("");
  const { medias, loading, error } = useSelector((state) => state.media);
  const [ispopUp, setispopUp] = useState(true);
  useEffect(() => {
    setmediaList([null]);
    if(senderId == 0 || senderId == null){
      toast.error("Please Select A Sendername Before Proceeding");
      return;
    }
    dispatch(
      fetchMedia({
        ClientId: localStorage.getItem("clientId"),
        senderId: senderId,
        FileName: filterText,
        contentTypeStr: contentTypeStr,
      })
    );
    return () => clearMediaUploadState();
  }, [dispatch, senderId, contentTypeStr]);
 const handleSearchString  = (e) => {
    const searchValue = e;
    setFilterText(searchValue);


    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      dispatch(fetchMedia({ ClientId: localStorage.getItem("clientId"), contentTypeStr: contentTypeStr,FileName:searchValue,senderId:senderId }));
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
  useEffect(() => {
    
    if (medias.length > 0) {
      setmediaList(medias);
    }
  }, [medias]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (ToggleModal) {
      ToggleModal();
    }
    dispatch(clearMediaState());
  };
  const handleSelectImage = (mediaId, mediaPath, mimeType) => {
    dispatch(clearMediaState());
    setSelectedMediaId(mediaId);
    onSelectMedia(mediaId, mediaPath, mimeType);
    toggleModal();
  };
  const handleDeleteClick = (mediaId) => {
    showSweetAlert({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteMedia({ mediaId })).then(() => {
          showSweetAlert("Deleted!", "The media has been deleted.", "success");
          refreshList();
        });
      }
    });
  };

  const refreshList = () => {
    dispatch(
      fetchMedia({
        ClientId: localStorage.getItem("clientId"),
        senderId: senderId,
        FileName:filterText,
      })
    );
  };

  const renderMediaPreview = (mediaPath, mimeType) => {
    const previewStyle =
      "w-full popup_img_container overflow-hidden flex justify-center items-center rounded-lg bg-gray-100";

    if (mimeType.startsWith("image/")) {
      return (
        <div>
        <Image
          src={`${BASE_URL}${mediaPath}`}
          alt="Image"
          className="w-full h-[100px] object-cover rounded-lg"
        />
       
        </div>
        
      );
    } else if (mimeType.startsWith("video/")) {
      return (
        <video controls className="w-full popup_img_container overflow-hidden flex justify-center items-center rounded-lg bg-gray-100">
          <source src={`${BASE_URL}${mediaPath}`} type={mimeType} />
        </video>
      );
    } else {
      return <p>Preview not available for this file type.</p>;
    }
  };

  return (
    <>
      <Modal isOpen={isModalOpen} toggle={() => toggleModal()} fade={false}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-50 relative">
            <ModalHeader toggle={() => toggleModal()}>
              Media Gallery
            </ModalHeader>
            <ModalBody>
              <div
                className={`w-full ${
                  isPopup ? "max-h-[40vh] overflow-y-auto" : ""
                }`}
              >
                <div>
                  {loading && (
                    <div className="text-center text-blue-500">
                      <Loader />
                    </div>
                  )}
                  {error && (
                    <div className="text-center text-red-500">{error}</div>
                  )}
                  <UploadMedia
                    onUploadSuccess={refreshList}
                    senderId={senderId}
                    ispopUp={isPopup}
                    handleSearch={handleSearchString}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4">
                    {Medialist?.map((media) => (
                      <div
                        key={media?.mediaId}
                        className="flex flex-col items-center space-y-2"
                      >
                        <div className="w-full text-center overflow-hidden">
                          {renderMediaPreview(
                            media?.mediaPath,
                            media?.contentType || "application/pdf"
                          )}
                          <span  className="text-xs font-bold font-sans  truncate  block">{media?.fileName}</span>
                        </div>
                        {isPopup ? (
                          <button
                            type="button"
                            className={` Btn-Regular  ${
                              selectedMediaId === media?.id
                                ? "bg-green-500"
                                : ""
                            }`}
                            onClick={() =>
                              handleSelectImage(
                                media?.id,
                                media?.mediaPath,
                                media?.contentType
                              )
                            }
                          >
                            {selectedMediaId === media?.mediaId
                              ? "Selected"
                              : "Select"}
                          </button>
                        ) : (
                          <button
                            className="w-full px-4 py-2 rounded  bg-red-500 text-white"
                            onClick={() => handleDeleteClick(media?.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MediaPopUp;
