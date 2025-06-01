import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedia, clearMediaState, deleteMedia } from "@/slices/MediaSlice";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import SweetAlert from "sweetalert2";
import App from "@/components/Layout/App";
import UploadMedia from "../UploadMedia";
import { Image } from "react-bootstrap";
import { usePermissions } from "@/context/PermissionsContext";
import Loader from "@/components/Layout/Loader";
import { BASE_URL } from "@/utils/apiConstants";

const MediaList = ({ isPopup, onSelectMedia, contentTypeStr, senderId }) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [selectedsenderId, setselectedsenderId] = useState(0);
  const { mediaList, loading, error } = useSelector((state) => state.media);
  const [Medialist, setmediaList] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [filterText, setFilterText] = useState("");
  useEffect(() => {
    setmediaList(null);
    // Send contentTypeStr only when isPopup is true, otherwise send an empty string
    const contentType = contentTypeStr;
    dispatch(
      fetchMedia({
        ClientId: localStorage.getItem("clientId"),
        contentTypeStr: contentType,
        FileName: filterText,
        senderId: selectedsenderId,
      })
    );
    return () => clearMediaState();
  }, [dispatch, contentTypeStr, selectedMediaId, selectedsenderId]);

  const handleSearchString = (e) => {
    const searchValue = e;
    setFilterText(searchValue);

    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      dispatch(
        fetchMedia({
          ClientId: localStorage.getItem("clientId"),
          contentTypeStr: contentTypeStr,
          FileName: searchValue,
          senderId: selectedsenderId,
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
  const toggleModal = () => {
    setmediaList([]);
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (mediaList && mediaList.length > 0) {
      setmediaList(mediaList);
    }
  }, [mediaList]);

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
  const handlesenderchange = async (value) => {
    setselectedsenderId(value);
    //await refreshList();
  };

  const refreshList = async () => {
    const contentType = contentTypeStr;
    await dispatch(
      fetchMedia({
        ClientId: localStorage.getItem("clientId"),
        contentTypeStr: contentType,
        FileName: filterText,
        senderId: selectedsenderId,
      })
    );
  };

  const handleSelectImage = (mediaId, mediaPath, mimeType) => {
    setSelectedMediaId(mediaId);
    onSelectMedia(mediaId, mediaPath, mimeType);
    toggleModal();
  };

  const renderMediaPreview = (mediaPath, mimeType) => {
    const previewStyle =
      "w-full popup_img_container overflow-hidden flex justify-center items-center rounded-lg bg-gray-100";

    if (mimeType.startsWith("image/")) {
      return (
        <div className={previewStyle}>
          <Image
            src={`${BASE_URL}${mediaPath}`}
            alt="Image"
            className="w-full img-fluid h-full object-cover rounded-lg"
          />
        </div>
      );
    } else if (mimeType.startsWith("video/")) {
      return (
        <div className={previewStyle}>
          <video
            controls
            className=" w-full popup_img_container overflow-hidden flex justify-center items-center rounded-lg bg-gray-100"
          >
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
      mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "application/vnd.ms-excel"
    ) {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            `${BASE_URL}${mediaPath}`
          )}`}
          title="Excel Preview"
          className={`${previewStyle} h-full border-none`}
        />
      );
    } else if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            `${BASE_URL}${mediaPath}`
          )}`}
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
      <App>
        <div className={"w-full mt-4"}>
          <div>
            {loading && (
              <div className="text-center text-blue-500">
                <Loader />
              </div>
            )}
            {error && <div className="text-center text-red-500">{error}</div>}
            <UploadMedia
              onUploadSuccess={refreshList}
              onsenderChange={handlesenderchange}
              ispopUp={isPopup}
              handleSearch={handleSearchString}
              fetchMedia={refreshList}
              filterText={filterText}
            />
            <div className="row">
              {Medialist?.map((media) => (
                <div
                  key={media.mediaId}
                  className="flex flex-col items-center space-y-2 col-lg-2 col-md-3 mb-5"
                >
                  <div className="w-full overflow-hidden text-center">
                    {renderMediaPreview(
                      media.mediaPath,
                      media.contentType || "application/pdf"
                    )}
                    <span className="text-xs font-bold font-sans truncate  block">
                      {media.fileName}
                    </span>
                  </div>
                  {hasPermission("Media", "delete") && (
                    <button
                      className="Btn-Regular-3"
                      onClick={() => handleDeleteClick(media.id)}
                    >
                      <i className="fa fa-trash mr-2"></i>
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </App>
    </>
  );
};

export default MediaList;
