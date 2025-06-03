import React, { useState, useEffect } from "react";
import { getAgentTemplate, getAgentTemplateDetail } from "@/slices/ChatBridgeSlice";
import {
  SendInteractivetemp,
  clearAgentTemplateSentState,
} from "@/slices/ConversationSlice";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
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

const DefinedTemplates = ({ isVisible, onClose, SenderId, ChatId, onSend }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [parameterValues, setParameterValues] = useState([]);
  const [templateView, setTemplateView] = useState("");
  const [chatMessages, setChatMessages] = useState(null);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [showTemplateList, setShowTemplateList] = useState(true); // New state to control template list visibility
  const dispatch = useDispatch();

  const agenttemplates = useSelector((state) => state.bridge.agentTemplatesList);
  const agenttemplatedetails = useSelector((state) => state.bridge.agenttemplatedetails);
  const [sending, setSending] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter templates based on senderId and search query
  useEffect(() => {
    
    const filtered = agenttemplates?.filter((template) => {
      const matchesSenderId = template.senderId === SenderId;
      const matchesSearchQuery = template.name
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());
      return matchesSenderId && matchesSearchQuery;
    });
    setFilteredTemplates(filtered);
  }, [debouncedSearchQuery, agenttemplates, SenderId]);

  // Fetch agent templates when the component mounts
  useEffect(() => {
    dispatch(getAgentTemplate({ senderId: SenderId }));
  }, [dispatch, SenderId]);

  const handleSelection = (templateId) => {
    setSelectedOption(templateId);
    setChatMessages(null);
    setParameterValues([]);
    setParameters([]);
    setTemplateView("");
    setShowTemplateList(false); // Hide the template list when a template is selected

    if (templateId) {
      const cachedDetail = agenttemplatedetails.find(
        (detail) => detail.templateId === templateId && detail.senderId === SenderId
      );
      if (!cachedDetail) {
        dispatch(getAgentTemplateDetail({ templateId, senderId: SenderId }));
      }
    }
  };

  // Update preview when agenttemplatedetails, selectedOption, or parameterValues change
  useEffect(() => {
    if (selectedOption) {
      
      const selectedDetail = agenttemplatedetails.find(
        (detail) => detail.templateId === selectedOption && detail.senderId === SenderId
      );
      if (selectedDetail) {
        setParameters(selectedDetail.parameters || []);
        let updatedView = selectedDetail.bodyText || "";
        parameterValues.forEach((param) => {
          updatedView = updatedView.replace(new RegExp(`{{${param.key}}}`, "g"), param.value);
        });
        setTemplateView(updatedView);
        setChatMessages({
          messageId: `preview-${selectedOption}`,
          typeId: 1,
          contentType: selectedDetail.contentType || "",
          mediaPath: selectedDetail.mediaPath || "",
          conversationID: ChatId,
          createdDate: new Date().toISOString(),
          messageContent: updatedView,
          headerText: selectedDetail.headerText || "",
          buttonJson: selectedDetail.buttonsJson || [],
        });
      }
    }
  }, [agenttemplatedetails, selectedOption, SenderId, parameterValues]);

  const handleSend = async (e) => {
    
    e.preventDefault();
    const values = parameterValues.map((val) => ({
      key: val.key,
      value: val.value,
    }));

    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("SenderId", SenderId);
    formData.append("ConversationId", ChatId);
    formData.append("InteractiveTemplateId", selectedOption);
    formData.append("ActionBy", localStorage.getItem("userId"));
    values.forEach((item, index) => {
      formData.append(`Values[${index}].Key`, item.key);
      formData.append(`Values[${index}].Value`, item.value);
    });

    try {
      setSending(true);
      const response = await dispatch(SendInteractivetemp(formData)).unwrap();
      
      if (response.success === true) {
        dispatch(clearAgentTemplateSentState());
        if (onSend && typeof onSend === "function") {
          onSend(chatMessages);
        }
        onClose();
      } else {
        toast.error(response.message || "Failed to send template");
      }
    } catch (err) {
      toast.error("Failed to send template");
    } finally {
      setSending(false);
    }
  };

  const handleParameterChange = (paramName, value) => {
    setParameterValues((prevValues) => {
      const updatedValues = prevValues.filter((item) => item.key !== paramName);
      const newValues = [...updatedValues, { key: paramName, value }];

      const selectedDetail = agenttemplatedetails.find(
        (detail) => detail.templateId === selectedOption && detail.senderId === SenderId
      );
      if (selectedDetail) {
        let updatedView = selectedDetail.bodyText || "";
        newValues.forEach((item) => {
          updatedView = updatedView.replace(new RegExp(`{{${item.key}}}`, "g"), item.value);
        });
        setTemplateView(updatedView);
        setChatMessages({
          messageId: `preview-${selectedOption}`,
          typeId: 1,
          contentType: "",
          createdDate: new Date().toISOString(),
          messageContent: updatedView,
          headerText: selectedDetail.headerText || "",
          buttonJson: selectedDetail.buttonsJson || [],
        });
      }
      return newValues;
    });
  };

  const handleSearchTemplate = (value) => {
    setSearchQuery(value);
    setChatMessages(null);
    setShowTemplateList(true); // Show the template list when search bar is clicked or typed in
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onClose]);

  return (
    <>
      {isVisible && (
        <div
          className="absolute bottom-[1.5rem] bg-white text-gray-800 shadow-2xl rounded-lg z-50 ChatPopUpFull"
          style={{ right: "-20px", bottom: "50px" }}
        >
          <div className="absolute top-2 right-2 text-end w-full cursor-pointer" onClick={onClose}>
            <i className="fa fa-times"></i>
          </div>
          <div className="flex ChatPopUp">
            {/* Left Section (Search Bar and Template List/Parameters) */}
            <div className="w-1/2 p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="   Search Template"
                  className="w-full bg-gray-100 text-gray-800 pl-10 mb-1 py-1 rounded-md focus:outline-none border border-gray-300"
                  value={searchQuery}
                  onChange={(e) => handleSearchTemplate(e.target.value)}
                  onClick={() => setShowTemplateList(true)} // Show list when search bar is clicked
                />
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500">
                  <i className="fa fa-search pl-2"></i>
                </div>
              </div>

              {showTemplateList ? (
                <div className="max-h-60 overflow-y-auto">
                  {filteredTemplates?.length > 0 ? (
                    filteredTemplates.map((option) => (
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
                    <div className="max-h-60 overflow-y-auto">No templates found</div>
                  )}
                </div>
              ) : (
                parameters.length > 0 && (
                  <div className="overflow-auto max-h-[300px] bg-gray-100 p-1">
                    {parameters.map((option) => (
                      <div key={option.paramId} className="mb-2">
                        <label htmlFor={option.paramId} className="block text-sm text-gray-700">
                          {option.paramName}
                        </label>
                        <input
                          id={option.paramId}
                          type="text"
                          value={
                            parameterValues.find((item) => item.key === option.paramName)?.value || ""
                          }
                          onChange={(e) => handleParameterChange(option.paramName, e.target.value)}
                          className="w-full mt-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder={`Enter Value`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Right Section (Preview Area) */}
            <div className="flex flex-col w-1/2 p-4">
              <div className="flex-1 overflow-auto">
                {selectedOption && chatMessages && (
                  <div className="preview-content">
                    <div
                      key={chatMessages.messageId}
                      className={`flex ${chatMessages.typeId === 1 ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs p-2 rounded-2xl shadow-sm ${
                          chatMessages.typeId === 1
                            ? "bg-[#ddffd9] text-black rounded-br-none"
                            : "bg-[#ffffff] text-black rounded-bl-none"
                        }`}
                      >
                        {chatMessages.parentMessageContent &&
                          chatMessages.parentMessageContent.trim() !== "" && (
                            <div
                              className="mb-2 p-1 rounded bg-gray-100 text-gray-600 text-sm italic border-l-4 border-gray-300 overflow-hidden text-ellipsis"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                whiteSpace: "normal",
                              }}
                            >
                              {chatMessages.parentMessageContent}
                            </div>
                          )}
                        {chatMessages.contentType && chatMessages.contentType !== "" && (
                          <>
                            {chatMessages.contentType.startsWith("image/") && (
                              <Image
                                src={`${BASE_URL}${chatMessages.mediaPath}`}
                                alt="Image"
                                className="max-w-full rounded"
                              />
                            )}
                            {chatMessages.contentType.startsWith("video/") && (
                              <video
                                controls
                                src={`${BASE_URL}${chatMessages.mediaPath}`}
                                className="max-w-full rounded"
                              />
                            )}
                            {chatMessages.contentType.startsWith("audio/") && (
                              <audio
                                controls
                                src={`${BASE_URL}${chatMessages.mediaPath}`}
                                className="max-w-full rounded"
                              />
                            )}
                          </>
                        )}
                        {chatMessages.headerText && chatMessages.headerText !== "" && (
                          <>
                            {chatMessages.headerText.split("\n").map((line, index) => (
                              <span key={index}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </>
                        )}
                        <p>
                          {templateView.split("\n").map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </p>
                        {chatMessages.buttonJson && chatMessages.buttonJson.length > 0 && (
                          <div className="mt-2">
                            {(typeof chatMessages.buttonJson === "string"
                              ? JSON.parse(chatMessages.buttonJson)
                              : chatMessages.buttonJson
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
                        <p className="text-xs text-gray-500">{extractTime(chatMessages.createdDate)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedOption && (
                <div className="text-end mt-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
                    onClick={sending ? null : handleSend}
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