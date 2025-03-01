import React, { useState, useEffect } from "react";
import {
  fetchAgentTemplate,
  cleaAgentTemplateState,
  fetchAgentTemplatesDetail,
  clearAgentTemplateDetailState,
} from "@/slices/AgentTemplateSlice";
import {
  SendInteractivetemp,
  clearAgentTemplateSentState,
} from "@/slices/ConversationSlice";
import { useDispatch, useSelector } from "react-redux";
import showSweetAlert from "@/components/Sweetalert";
import { toast } from "react-toastify";
import {
  Card,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Container,
  Row,
  Button,
  CardHeader,
} from "reactstrap";
import { BASE_URL } from "@/utils/apiConstants";
import { extractTime } from "@/utils/constants";
import { set } from "date-fns";
const DefinedTemplates = ({ isVisible, onClose, SenderId, ChatId, onSend }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [parameterValues, setParameterValues] = useState([]);
  const [templateView, settemplateView] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const dispatch = useDispatch();
  const { agenttemplates, loading, error } = useSelector(
    (state) => state.agenttemplates
  );
  const [Perameter, setParameter] = useState([]);
  const {
    agenttemplatedetail,
    loading: detailloading,
    error: detailerror,
  } = useSelector((state) => state.agenttemplates);
  const [sending, setsending] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (agenttemplatedetail) {
      const newMessage = {
        messageId: Date.now(),
        typeId: 1,
        messageContent: agenttemplatedetail.bodyText,
        contentType: agenttemplatedetail.contentType
          ? agenttemplatedetail.contentType
          : "", // Set content type if there's media
        mediaPath: agenttemplatedetail.mediaPath
          ? agenttemplatedetail.mediaPath
          : "", // Set media path if there's media
        buttonJson: agenttemplatedetail.buttonsJson
          ? agenttemplatedetail.buttonsJson
          : "",
        createdDate: new Date().toLocaleString(),
        headerText: agenttemplatedetail.headerText,
      };

      setChatMessages((prevMessages) => [newMessage, ...prevMessages]);
    }
  }, [agenttemplatedetail]);

  useEffect(() => {
    if (debouncedSearchQuery.trim() !== "") {
      setParameter([]);
      dispatch(
        fetchAgentTemplate({
          clientId: localStorage.getItem("clientId"),
          searchStr: debouncedSearchQuery,
          senderId: SenderId,
        })
      );
    } else {
      dispatch(cleaAgentTemplateState());
    }

    return () => {
      dispatch(cleaAgentTemplateState());
    };
  }, [dispatch, debouncedSearchQuery]);

  const handleSelection = (templateId) => {
    setChatMessages([]);
    setSelectedOption(templateId);
    if (templateId) {
      dispatch(
        fetchAgentTemplatesDetail({
          clientId: localStorage.getItem("clientId"),
          TemplateId: templateId,
          senderId: SenderId,
        })
      );
    } else {
      dispatch(clearAgentTemplateDetailState());
    }
  };

  useEffect(() => {
    if (agenttemplatedetail) {
      setParameter(agenttemplatedetail.parameters);
      settemplateView(agenttemplatedetail.bodyText);
    }
    return () => {
      //dispatch(clearAgentTemplateDetailState());
    };
  }, [agenttemplatedetail]);

  const handleSend = async (e) => {
    e.preventDefault();
    const Values = parameterValues.map((values) => ({
      key: values.key,
      value: values.value,
    }));

    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("SenderId", SenderId);
    formData.append("ConversationId", ChatId);
    formData.append("InteractiveTemplateId", selectedOption);
    formData.append("ActionBy", localStorage.getItem("userId"));
    Values.forEach((item, index) => {
      formData.append(`Values[${index}].Key`, item.key);
      formData.append(`Values[${index}].Value`, item.value);
    });

    try {
      // onClose();
      setsending(true);
      const response = await dispatch(SendInteractivetemp(formData)).unwrap();

      if (response.success) {
      
        dispatch(clearAgentTemplateSentState());
        // Invoke the onSend callback with agenttemplatedetail
        if (onSend && typeof onSend === "function") {
          // Make a copy of the agenttemplatedetail object
          const updatedTemplateDetail = { ...agenttemplatedetail,
            ChatId: ChatId
           };

          // Update the messageContent directly
          updatedTemplateDetail.bodyText = templateView;

          // Pass the updated object to onSend
          onSend(updatedTemplateDetail);
        }

        onClose();
        //toast.success("Template Sent Successfully");
        dispatch(clearAgentTemplateDetailState());
      } else {
        toast.error(response.message || "Failed to send template");
      }
    } catch (err) {
      toast.error("Failed to send template");
    }
    setsending(false);
  };
  useEffect(() => {
    setParameterValues([]);
    setParameter([]);
  }, [dispatch]);

  const handleParameterChange = (paramName, value) => {
    setParameterValues((prevValues) => {
      const updatedValues = prevValues.filter((item) => item.key !== paramName);
      const newValues = [...updatedValues, { key: paramName, value }];

      // Now, perform operations that require the updated state inside this callback
      const Values1 = newValues.map((item) => ({
        key: item.key,
        value: item.value,
      }));

      let view = chatMessages[0].messageContent;
      Values1.forEach((item) => {
        view = view.replace(new RegExp(item.key, "g"), item.value);
      });

      settemplateView(view);
      console.log("Updated Params", newValues); // Logging the updated values

      return newValues; // Return updated state value
    });
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setChatMessages([]);
    console.log("Param Name", parameterValues);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        onClose(); // Call onClose when the Escape key is pressed
      }
    };

    // Add the event listener for keydown
    window.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [onClose]);

  return (
    <>
      {isVisible && (
        <div
          className="absolute bottom-[1.5rem] bg-white text-gray-800 shadow-2xl rounded-lg z-50 ChatPopUpFull"
          style={{  right: "-20px", bottom:"50px" }}
        >
          <div
            className="absolute top-2 right-2 text-end w-full  cursor-pointer"
            onClick={onClose}
          >
            <i className="fa fa-times"></i>{" "}
            {/* You can change this to an "X" or another icon */}
          </div>
          <div className="flex ChatPopUp ">
            {/* Left Section (Search Bar and Template List) */}
            <div className="w-1/2 p-4">
              {/* Search Bar */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="   Search Template"
                  className="w-full bg-gray-100 text-gray-800 pl-10 mb-1 py-1 rounded-md focus:outline-none border border-gray-300"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500">
                  <i className="fa fa-search pl-2"></i>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {agenttemplates?.length > 0 ? (
                  agenttemplates.map((option) => (
                    <div
                      key={option.id}
                      className={`px-4 py-2 cursor-pointer text-sm ${
                        selectedOption === option.id
                          ? "bg-blue-100 text-blue-600 border-l-4 border-blue-500"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() => handleSelection(option.id)}
                    >
                      {option.name}
                    </div>
                  ))
                ) : (
                  <div className="max-h-60 overflow-y-auto">
                    No templates found
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 rounded-lg z-50">
                  <i className="fa fa-spinner fa-spin fa-2x text-gray-800"></i>
                </div>
              )}
              <br />
              {/* Bottom Section (Parameters) */}
              {Perameter.length > 0 && (
                <div className="overflow-auto max-h-[300px] bg-gray-100 p-1">
                  {Perameter.map((option) => (
                    <div key={option.paramId} className="mb-2">
                      <label
                        htmlFor={option.paramId}
                        className="block text-sm text-gray-700"
                      >
                        {option.paramName}
                      </label>
                      <input
                        id={option.paramId}
                        type="text"
                        value={
                          parameterValues.find(
                            (item) => item.key === option.paramName
                          )
                            ? parameterValues.find(
                                (item) => item.key === option.paramName
                              ).value
                            : ""
                        }
                        onChange={(e) =>
                          handleParameterChange(
                            option.paramName,
                            e.target.value
                          )
                        }
                        className="w-full mt-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder={`Enter Value`}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Right Section (Preview Area) */}
            <div className="flex flex-col w-1/2 p-4">
              <div className="flex-1 overflow-auto">
                {/* Preview content goes here */}
                <div className="">
                  {selectedOption && (
                    <div className="preview-content">
                      {chatMessages.map((message) => (
                        <div
                          key={message.messageId}
                          className={`flex ${
                            message.typeId === 1
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs p-2 rounded-2xl shadow-sm ${
                              message.typeId === 1
                                ? "bg-[#ddffd9] text-black rounded-br-none"
                                : "bg-[#ffffff] text-black rounded-bl-none"
                            }`}
                          >
                            {message.parentMessageContent &&
                              message.parentMessageContent.trim() !== "" && (
                                <div
                                  className="mb-2 p-1 rounded bg-gray-100 text-gray-600 text-sm italic border-l-4 border-gray-300 overflow-hidden text-ellipsis"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {message.parentMessageContent}
                                </div>
                              )}
                            {message.contentType &&
                              message.contentType !== "" && (
                                <>
                                  {message.contentType.startsWith("image/") && (
                                    <img
                                      src={`${BASE_URL}${message.mediaPath}`}
                                      alt="Image"
                                      className="max-w-full rounded"
                                    />
                                  )}
                                  {message.contentType.startsWith("video/") && (
                                    <video
                                      controls
                                      src={`${BASE_URL}${message.mediaPath}`}
                                      className="max-w-full rounded"
                                    />
                                  )}
                                  {message.contentType.startsWith("audio/") && (
                                    <audio
                                      controls
                                      src={`${BASE_URL}${message.mediaPath}`}
                                      className="max-w-full rounded"
                                    />
                                  )}
                                </>
                              )}
                            {message.headerText &&
                              message.headerText !== "" && (
                                <>
                                  {message.headerText
                                    .split("\n")
                                    .map((line, index) => (
                                      <span key={index}>
                                        {line}
                                        <br />
                                      </span>
                                    ))}
                                </>
                              )}
                            <p className="">
                              {templateView.split("\n").map((line, index) => (
                                <span key={index}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                            </p>
                            {message.buttonJson &&
                              message.buttonJson.length > 0 && (
                                <div className="mt-2">
                                  {(typeof message.buttonJson === "string"
                                    ? JSON.parse(message.buttonJson)
                                    : message.buttonJson
                                  ).map((button, index) => (
                                    <Button
                                      key={index}
                                      className="w-100 mb-2"
                                      style={{
                                        color: "#00a9ee",
                                        backgroundColor: "#ddffd9",
                                        borderColor: "#ffffff",
                                        borderStyle: "solid",
                                        borderWidth: "2px 2px 2px 2px",
                                        borderTopWidth: "0.5px",
                                        borderTopStyle: "solid",
                                        borderTopColor: "#e1e1e1",
                                      }}
                                    >
                                      {button.ButtonType == 1 && (
                                        <span>
                                          <i className="fa fa-share fa-flip-horizontal me-2"></i>
                                          {button.ButtonText || "Button"}
                                        </span>
                                      )}
                                      {button.ButtonType == 2 && (
                                        <span>
                                          <i className="fa fa-phone me-2"></i>
                                          {button.ButtonText || "Button"}
                                        </span>
                                      )}
                                      {button.ButtonType == 3 && (
                                        <span>
                                          <i className="fa fa-external-link me-2"></i>
                                          {button.ButtonText || "Button"}
                                        </span>
                                      )}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            <p className="text-xs text-gray-500">
                              {extractTime(message.createdDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Send Button */}
              {selectedOption && (
                <div className="text-end mt-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                    onClick={handleSend}
                    disabled={sending}
                  >
                    <i className="fa fa-paper-plane-o"></i>
                    {sending ? " Sending..." : " Send"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DefinedTemplates;
