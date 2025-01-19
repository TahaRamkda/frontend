import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedia, clearMediaState, deleteMedia } from "@/slices/MediaSlice";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import SweetAlert from "sweetalert2";
import App from '@/components/Layout/App';
import UploadMedia from "../UploadMedia";
import Loader from "@/components/Layout/Loader";
import { BASE_URL } from "@/utils/apiConstants";

const MediaList = ({ isPopup, onSelectMedia, contentTypeStr,senderId }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [selectedsenderId, setselectedsenderId] = useState(0);
  const { medias, loading, error } = useSelector((state) => state.media);
 const[Medialist,setmediaList] = useState([]);
  useEffect(() => {
    setmediaList(null)
    // Send contentTypeStr only when isPopup is true, otherwise send an empty string
    const contentType = isPopup ? contentTypeStr : "";
    dispatch(fetchMedia({ ClientId: localStorage.getItem("clientId"), contentTypeStr: contentType,senderId:senderId?senderId:selectedsenderId }));
    return () => clearMediaState();
  }, [dispatch, isPopup, contentTypeStr]);

  useEffect(() => {
    dispatch(fetchMedia({ ClientId: localStorage.getItem("clientId"), contentTypeStr: contentType,senderId:selectedsenderId }));
    return () => clearMediaState();
  }, [dispatch, selectedsenderId]);

  useEffect(() => {
    if (isPopup) {
      setIsModalOpen(true);
    }
  }, [isPopup]);

  const toggleModal = () => {
  setmediaList([]);
    setIsModalOpen(false);
  };
useEffect(() =>{
if(medias){
  setmediaList(medias)
}
},[medias])
 
  const handleDeleteClick = (mediaId) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteMedia({ mediaId })).then(() => {
          SweetAlert.fire("Deleted!", "The media has been deleted.", "success");
          refreshList();
        });
      }
    });
  };
  const handlesenderchange = async(value) => {
    debugger
    setselectedsenderId(value);
    //await refreshList();
  }

   const refreshList = async () => {
    debugger
    const contentType = isPopup ? contentTypeStr : "";
    await dispatch(fetchMedia({ ClientId: localStorage.getItem("clientId"), contentTypeStr: contentType ,senderId:selectedsenderId}));
  };

  const handleSelectImage = (mediaId, mediaPath, mimeType) => {

    setSelectedMediaId(mediaId);
    onSelectMedia(mediaId, mediaPath, mimeType);
    toggleModal();
  };

  const renderMediaPreview = (mediaPath, mimeType) => {
    const previewStyle = "w-full h-56 overflow-hidden flex justify-center items-center rounded-lg bg-gray-100";

    if (mimeType.startsWith("image/")) {
      return (
        <div className={previewStyle}>
          <img
            src={`${BASE_URL}${mediaPath}`}
            alt="Image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      );
    } else if (mimeType.startsWith("video/")) {
      return (
        <div className={previewStyle}>
          <video controls className="w-full h-full object-cover">
            <source src={`${BASE_URL}${mediaPath}`} type={mimeType} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (mimeType.startsWith("audio/")) {
      return (
        <div className={`${previewStyle} p-2`}>
          <audio controls className="w-full">
            <source src={`${BASE_URL}${mediaPath}`} type={mimeType} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    } else if (mimeType === "application/pdf") {
      return (
        <iframe
          src={`${BASE_URL}${mediaPath}`}
          title="PDF Preview"
          className={`${previewStyle} h-full border-none`}
        />
      );
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "application/vnd.ms-excel"
    ) {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`${BASE_URL}${mediaPath}`)}`}
          title="Excel Preview"
          className={`${previewStyle} h-full border-none`}
        />
      );
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`${BASE_URL}${mediaPath}`)}`}
          title="Word Document Preview"
          className={`${previewStyle} h-full border-none`}
        />
      );
    } else {
      return <p>Preview not available for this file type.</p>;
    }
  };

 
  return (
    <>
      {
        isPopup ? (
          <Modal isOpen={isModalOpen} toggle={() => toggleModal()} fade={false}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-50 relative">
         <ModalHeader toggle={() => toggleModal()}>Media Gallery</ModalHeader>
         <ModalBody>
            <div className={`w-full mt-4 ${isPopup ? 'max-h-[40vh] overflow-y-auto' : ''}`}>
      <div>
        {loading && <div className="text-center text-blue-500"><Loader /></div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        <UploadMedia
          onUploadSuccess={refreshList}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4">
          {Medialist.map((media) => (
            <div key={media.mediaId} className="flex flex-col items-center space-y-2">
              <div className="w-full h-64 overflow-hidden">
                {renderMediaPreview(media.mediaPath, media.contentType || "application/pdf")}
              </div>
              {isPopup ? (
                <button
                  type="button"
                  className={`w-full px-4 py-2 rounded bg-blue-700 text-white ${selectedMediaId === media.id ? "bg-green-500" : ""}`}
                  onClick={() =>
                    handleSelectImage(media.id, media.mediaPath, media.contentType)
                  }
                >
                  {selectedMediaId === media.mediaId ? "Selected" : "Select"}
                </button>
              ) : (
                <button
                  className="w-full px-4 py-2 rounded bg-red-500 text-white"
                  onClick={() => handleDeleteClick(media.id)}
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
        ) : (
          <App>
             <div className={`w-full mt-4 ${isPopup ? 'max-h-[40vh] overflow-y-auto' : ''}`}>
      <div>
        {loading && <div className="text-center text-blue-500"><Loader /></div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        <UploadMedia
          onUploadSuccess={refreshList}
          onsenderChange={handlesenderchange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4">
          {Medialist.map((media) => (
            <div key={media.mediaId} className="flex flex-col items-center space-y-2">
              <div className="w-full h-64 overflow-hidden">
                {renderMediaPreview(media.mediaPath, media.contentType || "application/pdf")}
              </div>
              {isPopup ? (
                <button
                  type="button"
                  className={`w-full px-4 py-2 rounded bg-blue-700 text-white ${selectedMediaId === media.id ? "bg-green-500" : ""}`}
                  onClick={() =>
                    handleSelectImage(media.id, media.mediaPath, media.contentType)
                  }
                >
                  {selectedMediaId === media.mediaId ? "Selected" : "Select"}
                </button>
              ) : (
                <button
                  className="w-full px-4 py-2 rounded bg-red-500 text-white"
                  onClick={() => handleDeleteClick(media.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
          </App>
        )
      }
    </>
  );
};

export default MediaList;
