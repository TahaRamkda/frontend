import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Loader from "@/components/Layout/Loader";
import { BASE_URL } from "@/utils/apiConstants";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { Tabs, Tab } from "react-bootstrap";
import {
  fetchSendernameById,
  clearSendernameState,
} from "@/slices/sendernameSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { Image } from "react-bootstrap";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import LanguageDropdown from "@/components/Dropdowns/LanguageDropdown";
import { updateFlow, fetchFlowDetailsById } from "@/slices/FlowsSlice";
import showSweetAlert from "@/components/Sweetalert";
import { toast } from "react-toastify";
import { HiCheck, HiTrash } from "react-icons/hi"; // Added for the checkmark icon
import { dropdownOptions } from "@/utils/constants";
import InteractiveTemplateDropdown from "@/components/Dropdowns/InteractiveTemplateDropWithoutParam";
import FlowDropdown from "@/components/Dropdowns/FlowsDropdown";
import { QuestionTypes } from "@/utils/constants";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";

// Updated FlowPreview component
const FlowPreview = ({
  flowData,
  currentScreenIndex,
  setCurrentScreenIndex,
  senderNameData,
}) => {
  const [contentShow, setContentShow] = useState(true);
  const [answers, setAnswers] = useState(() =>
    flowData.flowScreens.map((screen) =>
      screen.flowChildren.map((child) => {
        if (
          child.type === QuestionTypes.TextInput ||
          child.type === QuestionTypes.TextArea
        )
          return "";
        if (child.type === QuestionTypes.Dropdown) return null;
        if (child.type === QuestionTypes.RadioButtonsGroup) return null;
        if (child.type === QuestionTypes.CheckboxGroup) return [];
        if (child.type === QuestionTypes.TextHeading) return null;
        return "";
      })
    )
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // New state for dropdown options screen
  const [isDropdownOptionsScreen, setIsDropdownOptionsScreen] = useState(false);
  const [dropdownChildIndex, setDropdownChildIndex] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const handlePreviewSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  const handleClick = () => {
    setContentShow(true);
  };
  const handleDropdownClick = (childIndex, options) => {
    setIsDropdownOptionsScreen(true);
    setDropdownChildIndex(childIndex);
    setDropdownOptions(options);
  };

  const handleOptionSelect = (optionText) => {
    const newAnswers = [...answers];
    newAnswers[currentScreenIndex][dropdownChildIndex] = optionText;
    setAnswers(newAnswers);
    setIsDropdownOptionsScreen(false);
    setDropdownChildIndex(null);
    setDropdownOptions([]);
  };
  const handleCLose = () => {
    if (isDropdownOptionsScreen) {
      // Return from dropdown options screen to main screen
      setIsDropdownOptionsScreen(false);
      setDropdownChildIndex(null);
      setDropdownOptions([]);
    } else if (currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1);
    } else {
      setContentShow(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setAnswers((prevAnswers) => {
      const newAnswers = flowData.flowScreens.map((screen, screenIdx) => {
        return screen.flowChildren.map((child, childIdx) => {
          const existingAnswer = prevAnswers[screenIdx]?.[childIdx];
          if (existingAnswer !== undefined) return existingAnswer;
          if (
            child.type === QuestionTypes.TextInput ||
            child.type === QuestionTypes.TextArea
          )
            return "";
          if (child.type === QuestionTypes.Dropdown) return null;
          if (child.type === QuestionTypes.RadioButtonsGroup) return null;
          if (child.type === QuestionTypes.CheckboxGroup) return [];
          if (child.type === QuestionTypes.TextHeading) return null;
          return "";
        });
      });
      return newAnswers;
    });
    setIsLoading(false); // Reset loading after update
  }, [flowData]);

  if (
    flowData.flowScreens.length === 0 ||
    currentScreenIndex < 0 ||
    currentScreenIndex >= flowData.flowScreens.length
  ) {
    return (
      <div
        className="text-center text-muted py-5"
        style={{ fontSize: "1.2rem" }}
      >
        No screens to preview
      </div>
    );
  }

  const currentScreen = flowData.flowScreens[currentScreenIndex];

  const areRequiredQuestionsAnswered = () => {
    if (flowData.flowScreens.length === 0) return true;
    return currentScreen.flowChildren.every((child, index) => {
      if (!child.required) return true;
      const answer = answers[currentScreenIndex]?.[index];
      if (
        child.type === QuestionTypes.TextInput ||
        child.type === QuestionTypes.TextArea
      )
        return answer !== undefined && answer.trim() !== "";
      if (child.type === QuestionTypes.RadioButtonsGroup)
        return answer !== null;
      if (child.type === QuestionTypes.Dropdown) return answer !== null;
      if (child.type === QuestionTypes.CheckboxGroup)
        return answer !== undefined && answer?.length > 0;
      if (child.type === QuestionTypes.TextHeading) return true;
      return true;
    });
  };

  return (
    <div>
      <Card className="max-h-[85vh] overflow-auto border shadow-sm">
        <CardTitle className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2">
          <div>
            <h3 className="font-semibold text-gray-800">Flow Preview</h3>
          </div>
        </CardTitle>
        {isSaved ? (
          <CardBody className="text-center">
            <div className="text-green-600 flex gap-3 justify-center items-center">
              <HiCheck size={24} /> Flow saved successfully
            </div>
          </CardBody>
        ) : (
          <CardBody className="p-4">
            <CardTitle className="mb-3 text-sm text-gray-500">
              Preview - Screen {currentScreenIndex + 1} of{" "}
              {flowData.flowScreens.length}
            </CardTitle>

            <div className="relative mx-auto my-8 w-[18vw] max-w-[360px] h-[640px] bg-white border-8 border-gray-800 rounded-3xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-start p-2 bg-white border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  {senderNameData && (
                    <div className="flex items-center">
                      {senderNameData.mediaPath && (
                        <Image
                          src={`${BASE_URL}${senderNameData.mediaPath}`}
                          alt="Sender Logo"
                          className="rounded-full w-10 h-10 object-cover"
                        />
                      )}
                      <div className="ml-2">
                        <div className="text-xs font-medium text-gray-800">
                          {senderNameData.senderName}
                        </div>
                        <div className="text-[0.66rem] text-gray-600">
                          {senderNameData.phoneNumber}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {contentShow ? (
                <>
                  <div className="h-[62vh] border-t border-black rounded-t-2xl flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-start p-3 bg-white border-b rounded-t-2xl border-gray-200">
                      <div className="flex items-center space-x-5">
                        <div>
                          <button
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                            onClick={handleCLose}
                          >
                            <FiArrowLeft className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-baseline space-x-2">
                          <h5 className="text-gray-600 hover:text-gray-800 m-0">
                            {isDropdownOptionsScreen
                              ? "Select an Option"
                              : currentScreen.title || "Untitled Screen"}
                          </h5>
                        </div>
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-3">
                      {isDropdownOptionsScreen ? (
                        // Dropdown Options Screen
                        <div>
                          {dropdownOptions.map((option, optionIndex) => {
                            const isSelected =
                              answers[currentScreenIndex][
                                dropdownChildIndex
                              ] === option.optionText;
                            return (
                              <div className="w-full">
                              <button
                                key={optionIndex}
                                className={`w-full text-left p-3 mb-2 rounded-lg text-base ${
                                  isSelected ? "text-green-400" : " text-gray-800 hover:bg-gray-200"
                                } flex items-center justify-between`}
                                onClick={() => handleOptionSelect(option.optionText)}
                              >
                                <span>{option.optionText}</span>
                                {isSelected && <HiCheck className="w-5 h-5 text-green-500" />}
                              </button>
                            </div>
                            );
                          })}
                        </div>
                      ) : (
                        // Main Screen Content
                        currentScreen.flowChildren.map((child, childIndex) => (
                          <FormGroup key={childIndex} className="mb-4">
                            {child.type !== QuestionTypes.TextHeading && (
                              <Label className="mb-2 text-[1.1rem] font-medium text-gray-800">
                                {child.text || "Untitled Question"}
                              </Label>
                            )}
                            {child.type === QuestionTypes.TextInput && (
                              <Input
                                type="text"
                                value={
                                  answers[currentScreenIndex][childIndex] || ""
                                }
                                onChange={(e) => {
                                  const newAnswers = [...answers];
                                  newAnswers[currentScreenIndex][childIndex] =
                                    e.target.value;
                                  setAnswers(newAnswers);
                                }}
                                className="rounded-full"
                                style={{
                                  padding: "10px 15px",
                                  borderColor: "#ced4da",
                                }}
                              />
                            )}
                            {child.type === QuestionTypes.TextArea && (
                              <Input
                                type="textarea"
                                value={
                                  answers[currentScreenIndex][childIndex] || ""
                                }
                                onChange={(e) => {
                                  const newAnswers = [...answers];
                                  newAnswers[currentScreenIndex][childIndex] =
                                    e.target.value;
                                  setAnswers(newAnswers);
                                }}
                                className="rounded"
                                style={{
                                  padding: "10px 15px",
                                  borderColor: "#ced4da",
                                  minHeight: "100px",
                                }}
                              />
                            )}
                            {child.type === QuestionTypes.RadioButtonsGroup &&
                              child.flowOptions.map((option, optionIndex) => (
                                <FormGroup
                                  check
                                  key={optionIndex}
                                  className="mb-2"
                                >
                                  <Input
                                    type="radio"
                                    name={`question_${childIndex}`}
                                    value={option.optionText}
                                    checked={
                                      answers[currentScreenIndex][
                                        childIndex
                                      ] === option.optionText
                                    }
                                    onChange={() => {
                                      const newAnswers = [...answers];
                                      newAnswers[currentScreenIndex][
                                        childIndex
                                      ] = option.optionText;
                                      setAnswers(newAnswers);
                                    }}
                                    className="mr-2"
                                  />
                                  <Label
                                    check
                                    className="text-base text-gray-600"
                                  >
                                    {option.optionText}
                                  </Label>
                                </FormGroup>
                              ))}
                            {child.type === QuestionTypes.Dropdown && (
                              <FormGroup className="mb-2">
                                <button
                                  className="w-full text-left p-2 bg-gray-100 rounded-lg text-base text-gray-600 border border-gray-300 flex items-center justify-between"
                                  onClick={() =>
                                    handleDropdownClick(
                                      childIndex,
                                      child.flowOptions
                                    )
                                  }
                                >
                                  <span>
                                  {answers && answers[currentScreenIndex] && answers[currentScreenIndex][childIndex] 
  ? answers[currentScreenIndex][childIndex] 
  : "Select an option"}
                                  </span>
                                  <FiChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                              </FormGroup>
                            )}
                            {child.type === QuestionTypes.CheckboxGroup &&
                              child.flowOptions.map((option, optionIndex) => (
                                <FormGroup
                                  check
                                  key={optionIndex}
                                  className="mb-2"
                                >
                                  <Input
                                    type="checkbox"
                                    value={option.optionText}
                                    checked={
                                      answers[currentScreenIndex][
                                        childIndex
                                      ]?.includes(option.optionText) || false
                                    }
                                    onChange={(e) => {
                                      const newAnswers = [...answers];
                                      const currentValues =
                                        newAnswers[currentScreenIndex][
                                          childIndex
                                        ] || [];
                                      if (e.target.checked) {
                                        newAnswers[currentScreenIndex][
                                          childIndex
                                        ] = [
                                          ...currentValues,
                                          option.optionText,
                                        ];
                                      } else {
                                        newAnswers[currentScreenIndex][
                                          childIndex
                                        ] = currentValues.filter(
                                          (val) => val !== option.optionText
                                        );
                                      }
                                      setAnswers(newAnswers);
                                    }}
                                    className="mr-2"
                                  />
                                  <Label
                                    check
                                    className="text-base text-gray-600"
                                  >
                                    {option.optionText}
                                  </Label>
                                </FormGroup>
                              ))}
                            {child.type === QuestionTypes.TextHeading && (
                              <div className="text-lg text-gray-800 mb-2">
                                {child.text || "Untitled Heading"}
                              </div>
                            )}
                          </FormGroup>
                        ))
                      )}
                      {isSaved && (
                        <div className="text-green-600 text-center mb-3 flex items-center justify-center gap-2">
                          <HiCheck size={24} /> Flow saved successfully
                        </div>
                      )}
                    </div>

                    {/* Fixed Footer Buttons */}
                    {!isDropdownOptionsScreen && (
                      <div className="p-3 bg-white border-t border-gray-200 flex justify-center gap-2">
                        {currentScreenIndex <
                          flowData.flowScreens.length - 1 && (
                          <button
                            onClick={() =>
                              setCurrentScreenIndex(currentScreenIndex + 1)
                            }
                            className="Btn-Regular-4"
                            disabled={!areRequiredQuestionsAnswered()}
                          >
                            {currentScreen.screenButtonText || "Next"}
                          </button>
                        )}
                        {currentScreenIndex ===
                          flowData.flowScreens.length - 1 && (
                          <button
                            onClick={handlePreviewSave}
                            className="Btn-Regular-4"
                          >
                            {currentScreen.screenButtonText || "Save"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-[calc(100%-104px)] overflow-y-auto p-4 bg-[#ece4dd]">
                    <div className="flex justify-end mb-4 relative">
                      <div className="bg-green-200 text-gray-800 p-2 rounded-lg w-32 relative">
                        <div className="w-23 h-1 bg-gray-400 mb-1"></div>
                        <div className="w-23 h-1 bg-gray-400 mb-1"></div>
                        <div className="absolute -right-[6px] top-[3px] w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-green-200"></div>
                      </div>
                    </div>
                    <div className="flex mb-4 relative">
                      <div className="bg-white text-gray-800 p-2 rounded-lg border border-gray-300 relative w-32">
                        <div className="w-28 h-1 bg-gray-400 mb-1 mt-2"></div>
                        <div className="w-28 h-1 bg-gray-400"></div>
                        <hr className="border-gray-300" />
                        <button className="text-blue-600" onClick={handleClick}>
                          Preview Flow
                        </button>
                        <div className="absolute -left-2 top-1 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200">
                    <div className="flex items-center space-x-2 pointer-events-none">
                      <input
                        type="text"
                        className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardBody>
        )}
      </Card>
    </div>
  );
};

const UpdateFlowPage = ({ Flow_Id, onclose }) => {
  const dispatch = useDispatch();
  //const flowId = useRecoilValue(FlowState);
  const router = useRouter();
  const [SendernamesData, setSendernamesData] = useState([]);

  const [flowData, setFlowData] = useState({
    senderId: "0",
    flowName: "",
    flowLanguage: "",
    publishToFB: false,
    actionId: 0,
    actionType: 0,
    flowScreens: [],
  });
  const [isLoading, setIsLoading] = useState(true); // Start as true since we're fetching data
  const [currentEditScreenIndex, setCurrentEditScreenIndex] = useState(0);
  const [senderId, setSenderId] = useState(0);

  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    const fetchFlowData = async () => {
      if (Flow_Id) {
        setIsLoading(true);
        try {
          const response = await dispatch(
            fetchFlowDetailsById({ id: Flow_Id })
          ).unwrap();
          if (response) {
            setSenderId(response.senderId);
            setFlowData(JSON.parse(JSON.stringify(response))); // Deep copy
          } else {
            showSweetAlert({
              title: "Error",
              text: "No flow data found",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Failed to fetch flow details:", error);
          showSweetAlert({
            title: "Error",
            text: "Failed to fetch flow details",
            icon: "error",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFlowData();
  }, [dispatch, Flow_Id]);

  useEffect(() => {
    if (!isLoading && flowData.flowScreens.length > 0) {
      if (currentEditScreenIndex >= flowData.flowScreens.length) {
        setCurrentEditScreenIndex(Math.max(0, flowData.flowScreens.length - 1));
      }
      setCurrentScreenIndex(currentEditScreenIndex);
    }
  }, [flowData.flowScreens.length, currentEditScreenIndex, isLoading]);

  const addScreen = () => {
    const newScreen = {
      name: `screen_${flowData.flowScreens.length + 1}`,
      title: "",
      screenButtonText: "Next",
      flowChildren: [],
    };

    if (flowData.flowScreens.length <= 4) {
      setFlowData({
        ...flowData,
        flowScreens: [...flowData.flowScreens, newScreen],
      });
      setCurrentEditScreenIndex(flowData.flowScreens.length);
    } else {
      toast.error("You can't add more than 5 screens");
    }
  };

  const deleteScreen = () => {
    if (flowData.flowScreens.length <= 1) return;
    const updatedScreens = flowData.flowScreens.filter(
      (_, index) => index !== currentEditScreenIndex
    );
    setFlowData({ ...flowData, flowScreens: updatedScreens });
    if (updatedScreens.length === 0) {
      setCurrentEditScreenIndex(-1);
      setCurrentScreenIndex(-1);
    } else if (currentEditScreenIndex >= updatedScreens.length) {
      setCurrentEditScreenIndex(updatedScreens.length - 1);
      setCurrentScreenIndex(updatedScreens.length - 1);
    }
  };
  useEffect(() => {
    const fetchSenderName = async () => {
      try {
        const response = await dispatch(
          fetchSendernameById({
            senderId: senderId,
            clientId: localStorage.getItem("clientId"),
          })
        ).unwrap();

        // Set the data directly from the response
        setSendernamesData(response.result);
      } catch (error) {
        console.error("Error fetching sender name:", error);
        // Optionally set error state
        setSendernamesData(null); // or handle error state differently
      }
    };
    fetchSenderName();

    // Cleanup function
    return () => {
      dispatch(clearSendernameState());
    };
  }, [dispatch, senderId]); // Added senderId to dependency array

  const addQuestion = () => {
    const newQuestion = {
      text: `Question ${
        flowData.flowScreens[currentEditScreenIndex].flowChildren.length + 1
      }`,
      type: null, // Changed to null to match modal behavior
      required: true,
      flowOptions: [],
    };
    setCurrentQuestion(newQuestion);
    setSelectedQuestionIndex(
      flowData.flowScreens[currentEditScreenIndex].flowChildren.length
    );
    setModalOpen(true);
  };

  const deleteQuestion = (questionIndex) => {
    const updatedScreens = [...flowData.flowScreens];
    updatedScreens[currentEditScreenIndex].flowChildren.splice(
      questionIndex,
      1
    );
    setFlowData({ ...flowData, flowScreens: updatedScreens });
  };

  const openQuestionModal = (questionIndex) => {
    setSelectedQuestionIndex(questionIndex);
    setCurrentQuestion({
      ...flowData.flowScreens[currentEditScreenIndex].flowChildren[
        questionIndex
      ],
    });
    setModalOpen(true);
  };

  const addOption = () => {
    if (!currentQuestion) return;
    const updatedQuestion = { ...currentQuestion };
    if (
      updatedQuestion.type === QuestionTypes.RadioButtonsGroup ||
      updatedQuestion.type === QuestionTypes.CheckboxGroup
    ) {
      updatedQuestion.flowOptions.push({
        optionId: `option_${Date.now()}`,
        optionText: "",
      });
      setCurrentQuestion(updatedQuestion);
    }
  };

  const deleteOption = (optionIndex) => {
    if (!currentQuestion) return;
    const updatedQuestion = { ...currentQuestion };
    if (
      updatedQuestion.type === QuestionTypes.RadioButtonsGroup ||
      updatedQuestion.type === QuestionTypes.CheckboxGroup
    ) {
      updatedQuestion.flowOptions.splice(optionIndex, 1);
      setCurrentQuestion(updatedQuestion);
    }
  };

  const updateField = (field, value) => {
    setFlowData({ ...flowData, [field]: value });
  };

  const updateScreenField = (field, value) => {
    const updatedScreens = [...flowData.flowScreens];
    updatedScreens[currentEditScreenIndex][field] = value;
    setFlowData({ ...flowData, flowScreens: updatedScreens });
  };

  const updateQuestionField = (field, value) => {
    if (!currentQuestion) return;
    const updatedQuestion = { ...currentQuestion, [field]: value };
    setCurrentQuestion(updatedQuestion);
  };

  const updateOptionField = (optionIndex, field, value) => {
    if (!currentQuestion) return;
    const updatedQuestion = { ...currentQuestion };
    updatedQuestion.flowOptions[optionIndex][field] = value;
    setCurrentQuestion(updatedQuestion);
  };

  const handleSenderChange = async (e) => {
    setIsLoading(true);
    const selectedSenderId = e.target.value;
    setFlowData({ ...flowData, senderId: selectedSenderId });
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setFlowData({ ...flowData, flowLanguage: language });
  };

  const handlePublishToFBChange = () => {
    setFlowData({ ...flowData, publishToFB: !flowData.publishToFB });
  };

  const handleSaveQuestion = () => {
    if (selectedQuestionIndex !== null && currentQuestion) {
      const updatedScreens = [...flowData.flowScreens];
      updatedScreens[currentEditScreenIndex].flowChildren[
        selectedQuestionIndex
      ] = { ...currentQuestion };
      setFlowData({ ...flowData, flowScreens: updatedScreens });
      setModalOpen(false);
      setCurrentQuestion(null);
      setSelectedQuestionIndex(null);
    }
  };
  const handleCancel = () => {
    setIsLoading(true);
    onclose();
  };
  const handleSaveFlow = () => {
    setIsLoading(true);
    const requestBody = {
      ...flowData,
      senderId: parseInt(flowData.senderId, 10),
      id: Flow_Id,
    };
    dispatch(updateFlow(requestBody))
      .unwrap()
      .then(() => {
        showSweetAlert({
          title: "Success",
          text: "Flow updated successfully",
          icon: "success",
        });
        handleCancel();
        //router.push("/Flows/FlowList");
      })
      .catch((error) => {
        console.error("Failed to update flow:", error);
        showSweetAlert({
          title: "Error",
          text: error.message || "An error occurred",
          icon: "error",
        });
      });
  };

  const handleTemplateChange = (e) => {
    updateField("actionId", e.target.value);
  };
  const handleFlowChange = (e) => {
    updateField("actionId", e.target.value);
  };

  return (
    <>
      {isLoading && <Loader />}
      <Container
        fluid
        className="py-4 create-flow-container"
      >
          <Row className="flex-grow-1" style={{ overflow: "hidden" }}>
            {/* Left Side - Flow Editor */}
            <Col
              md={7}
              className=""
              style={{ overflowY: "auto", paddingRight: "15px" }}
            >
              <Card className="mb-4 shadow-sm max-h-[72vh] overflow-auto ">
              <CardTitle
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundColor: "white",
                  borderBottom: "1px solid #e0e0e0",
                  padding: "10px 15px",
                }}
              >
                <div className="">
                  <h4
                    className=" "
                    style={{ fontWeight: "600", color: "#333" }}
                  >
                    Update Flow
                  </h4>
                </div>
              </CardTitle>
                <CardBody>
                  <Form>
                    <FormGroup>
                      <Label>Sender Name</Label>
                      <SendernameDropdown
                        value={flowData.senderId}
                        onChange={handleSenderChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Flow Name</Label>
                      <Input
                        value={flowData.flowName}
                        onChange={(e) =>{
                          const value = e.target.value
                          .replace(/\s+/g, "_")
                          .replace(/[^a-zA-Z0-9_]/g, "")
                        updateField("flowName", value)
                      }
                        }
                         
                        className="rounded"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Flow Language</Label>
                      <LanguageDropdown
                        value={flowData.flowLanguage}
                        onChange={handleLanguageChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="actionType">Select Action Type</Label>
                      <Input
                        type="select"
                        id="actionType"
                        value={flowData.actionType}
                        onChange={(e) =>
                          updateField("actionType", parseInt(e.target.value))
                        }
                      >
                        {dropdownOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                    {(flowData.actionType === 1 ||
                      flowData.actionType === "1") && (
                      <FormGroup>
                        <Label for="templateDropdown">Select Template</Label>
                        <InteractiveTemplateDropdown
                          id="templateDropdown"
                          value={flowData.actionId}
                          onChange={handleTemplateChange}
                          TransactionType="0"
                          SenderId={flowData.senderId}
                        />
                      </FormGroup>
                    )}
                    {(flowData.actionType === 8 ||
                      flowData.actionType === "8") && (
                      <FormGroup>
                        <Label for="FlowDropdown">Select Flows</Label>
                        <FlowDropdown
                          id="FlowDropdown"
                          value={flowData.actionId}
                          onChange={handleFlowChange}
                        />
                      </FormGroup>
                    )}
                    <FormGroup check>
                      <Input
                        type="checkbox"
                        checked={flowData.publishToFB}
                        onChange={handlePublishToFBChange}
                        style={{ marginRight: "10px" }}
                      />
                      <Label check>Publish to Facebook</Label>
                    </FormGroup>
                    <div className="d-flex justify-content-between mb-3">
                      <Button
                        color="primary"
                        onClick={addScreen}
                        className="uniform_btn"
                        style={{ border: "none" }}
                      >
                        Add Screen
                      </Button>
                    </div>
                    {flowData.flowScreens.length > 0 && (
                      <>
                        <Tabs
                          activeKey={currentEditScreenIndex}
                          onSelect={(key) =>
                            setCurrentEditScreenIndex(parseInt(key))
                          }
                          className="mb-3"
                        >
                          {flowData.flowScreens.map((screen, index) => (
                            <Tab
                              eventKey={index}
                              title={`Screen ${index + 1}`}
                              key={index}
                            />
                          ))}
                        </Tabs>
                        <Card className="mb-3 shadow-sm border-0">
                          <CardBody>
                            <div className="d-flex justify-content-between align-items-center">
                              <h5>
                                Screen {currentEditScreenIndex + 1} of{" "}
                                {flowData.flowScreens.length}
                              </h5>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={deleteScreen}
                                disabled={flowData.flowScreens.length <= 1}
                              >
                                <HiTrash />
                              </Button>
                            </div>
                            <FormGroup>
                              <Label>Screen Title</Label>
                              <Input
                                value={
                                  flowData.flowScreens[currentEditScreenIndex]
                                    .title
                                }
                                onChange={(e) =>
                                  updateScreenField("title", e.target.value)
                                }
                                className="rounded"
                              />
                            </FormGroup>
                            <Button
                              size="sm"
                              onClick={addQuestion}
                              className="uniform_btn"
                            >
                              Add Control
                            </Button>
                            <ListGroup className="mt-3">
                              {flowData.flowScreens[
                                currentEditScreenIndex
                              ].flowChildren.map((child, childIndex) => (
                                <ListGroupItem
                                  key={childIndex}
                                  className="d-flex justify-content-between align-items-center"
                                  action
                                  onClick={() => openQuestionModal(childIndex)}
                                >
                                  <span>
                                    <strong>{childIndex + 1}.</strong>{" "}
                                    {child.text || `Question ${childIndex + 1}`}
                                  </span>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteQuestion(childIndex);
                                    }}
                                    className="rounded-pill"
                                  >
                                    <HiTrash />
                                  </Button>
                                </ListGroupItem>
                              ))}
                            </ListGroup>
                            <FormGroup className="mt-3">
                              <Label>Button Text</Label>
                              <Input
                                value={
                                  flowData.flowScreens[currentEditScreenIndex]
                                    .screenButtonText
                                }
                                onChange={(e) =>
                                  updateScreenField(
                                    "screenButtonText",
                                    e.target.value
                                  )
                                }
                                className="rounded"
                              />
                            </FormGroup>
                          </CardBody>
                        </Card>
                      </>
                    )}
                  </Form>
                </CardBody>
              </Card>
              {!isLoading && (
                <div className="flex gap-4 justify-end">
                  <button onClick={handleCancel} className="Btn-Regular-1">
                    Cancel
                  </button>
                  <Button
                    onClick={handleSaveFlow}
                    className="uniform_btn"
                    style={{ alignSelf: "flex-start", border: "none" }}
                  >
                    Save Flow
                  </Button>
                </div>
              )}
            </Col>

            {/* Right Side - Live Preview */}
            <Col
              md={5}
              className="h-100"
              style={{
                overflowY: "auto",
                paddingLeft: "15px",
                paddingRight: "15px",
              }}
            >
              <div>
                <FlowPreview
                  flowData={flowData}
                  currentScreenIndex={currentScreenIndex}
                  setCurrentScreenIndex={setCurrentScreenIndex}
                  senderNameData={SendernamesData}
                />
              </div>
            </Col>
          </Row>
   

        {/* Updated Question Configuration Modal */}
        <Modal
          isOpen={modalOpen}
          toggle={() => setModalOpen(false)}
          fade={false}
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3 relative">
              <ModalHeader toggle={() => setModalOpen(false)}>
                {selectedQuestionIndex !== null
                  ? "Edit Children"
                  : "Add Children"}
              </ModalHeader>
              <ModalBody className="max-h-[50vh] overflow-auto">
                {currentQuestion && (
                  <Form>
                    <FormGroup>
                      <Label>Input Type</Label>
                      <Input
                        type="select"
                        value={currentQuestion.type || ""}
                        onChange={(e) =>
                          updateQuestionField("type", parseInt(e.target.value))
                        }
                        className="rounded"
                      >
                        <option value="" disabled>
                          Select Input Type
                        </option>
                        <option value={QuestionTypes.TextInput}>
                          Text Input
                        </option>
                        <option value={QuestionTypes.TextArea}>Textarea</option>
                        <option value={QuestionTypes.RadioButtonsGroup}>
                          Radio Buttons
                        </option>
                        <option value={QuestionTypes.CheckboxGroup}>
                          Checkbox Group
                        </option>
                        <option value={QuestionTypes.TextHeading}>
                          Text Heading
                        </option>
                      </Input>
                    </FormGroup>
                    {currentQuestion.type &&
                      (currentQuestion.type === QuestionTypes.TextHeading ? (
                        <FormGroup>
                          <Label>Heading Text</Label>
                          <Input
                            value={currentQuestion.text}
                            onChange={(e) =>
                              updateQuestionField("text", e.target.value)
                            }
                            className="rounded"
                            placeholder="Enter heading text"
                          />
                        </FormGroup>
                      ) : (
                        <>
                          <FormGroup>
                            <Label>Question Text</Label>
                            <Input
                              value={currentQuestion.text}
                              onChange={(e) =>
                                updateQuestionField("text", e.target.value)
                              }
                              className="rounded"
                            />
                          </FormGroup>
                          <FormGroup check>
                            <Input
                              type="checkbox"
                              checked={currentQuestion.required}
                              onChange={() =>
                                updateQuestionField(
                                  "required",
                                  !currentQuestion.required
                                )
                              }
                            />
                            <Label check>Required</Label>
                          </FormGroup>
                          {(currentQuestion.type ===
                            QuestionTypes.RadioButtonsGroup ||
                            currentQuestion.type ===
                              QuestionTypes.CheckboxGroup) && (
                            <>
                              <Button
                                size="sm"
                                onClick={addOption}
                                className="uniform_btn"
                              >
                                Add Option
                              </Button>
                              {currentQuestion.flowOptions.map(
                                (option, optionIndex) => (
                                  <FormGroup
                                    key={optionIndex}
                                    className="mt-2 d-flex align-items-center"
                                  >
                                    <Input
                                      value={option.optionText}
                                      onChange={(e) =>
                                        updateOptionField(
                                          optionIndex,
                                          "optionText",
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Option ${optionIndex + 1}`}
                                      style={{ flex: 1, marginRight: "10px" }}
                                      className="rounded"
                                    />
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => deleteOption(optionIndex)}
                                      className="rounded-pill"
                                    >
                                      <HiTrash />
                                    </Button>
                                  </FormGroup>
                                )
                              )}
                            </>
                          )}
                        </>
                      ))}
                  </Form>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={handleSaveQuestion}
                  className="uniform_btn"
                >
                  Save
                </Button>
              </ModalFooter>
            </div>
          </div>
        </Modal>
      </Container>
    </>
  );
};
export default UpdateFlowPage;
