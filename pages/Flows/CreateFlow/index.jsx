import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
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
  CardHeader,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { Tabs, Tab } from "react-bootstrap";
import { BASE_URL } from "@/utils/apiConstants";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchSendernameById , clearSendernameState } from "@/slices/sendernameSlice";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import LanguageDropdown from "@/components/Dropdowns/LanguageDropdown";
import { createFlows } from "@/slices/FlowsSlice";
import App from "@/components/Layout/App";
import { toast } from "react-toastify";
import { HiTrash, HiCheck } from "react-icons/hi";
import { is } from "immutable";
import Loader from "@/components/Layout/Loader";
import showSweetAlert from "@/components/Sweetalert";
import { dropdownOptions } from "@/utils/constants";
import InteractiveTemplateDropdown from "@/components/Dropdowns/InteractiveTemplateDropWithoutParam";
import FlowDropdown from "@/components/Dropdowns/FlowsDropdown";
// Enum for question types
const QuestionTypes = {
  TextInput: 1,
  TextArea: 2,
  RadioButtonsGroup: 3,
  CheckboxGroup: 4,
  TextHeading: 5,
};

// FlowPreview component
const FlowPreview = ({
  flowData,
  currentScreenIndex,
  setCurrentScreenIndex,
  senderNameData
}) => {
  const [answers, setAnswers] = useState(() =>
    flowData.flowScreens.map((screen) =>
      screen.flowChildren.map((child) => {
        if (
          child.type === QuestionTypes.TextInput ||
          child.type === QuestionTypes.TextArea
        )
          return "";
        if (child.type === QuestionTypes.RadioButtonsGroup) return null;
        if (child.type === QuestionTypes.CheckboxGroup) return [];
        if (child.type === QuestionTypes.TextHeading) return null;
        return "";
      })
    )
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreviewSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
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
      if (child.type === QuestionTypes.CheckboxGroup)
        return answer !== undefined && answer?.length > 0;
      if (child.type === QuestionTypes.TextHeading) return true;
      return true;
    });
  };

  return (
    <div>
      <div className="">
          <h3
            className="mb-2 "
            style={{  fontWeight: "600", color: "#333" }}
          >
            Flow Preview
          </h3>
          
        </div>
    <Card
      className="max-h-[80vh] overflow-auto border shadow-sm"
      style={{ borderRadius: "10px", overflow: "hidden" }}
    >
      <CardTitle
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        padding: "10px 15px",
      }}>
      

        
       
        <div>
        {senderNameData && (
            <div className="d-flex align-items-center">
              {senderNameData.mediaPath && (
                <img
                  src={`${BASE_URL}${senderNameData.mediaPath}`}
                  alt="Sender Logo"
                  className="rounded-circle me-2 img-fluid"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                  }}
                />
              )}
              <div>
                <div style={{ fontSize: "1rem", fontWeight: "500" }}>
                  {senderNameData.senderName}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#666" }}>
                  {senderNameData.phoneNumber}
                </div>
              </div>
            </div>
          )}
        </div>
      
      </CardTitle>
      {isSaved ? (
         <CardBody className=" text-center">
         <div className="text-success flex gap-3 justify-center ">
           <HiCheck size={24} /> Flow saved successfully
         </div>
       </CardBody>
     ) : (
      <CardBody className="p-4">
        <CardTitle
          className="mb-3"
          style={{ fontSize: "1rem", color: "#656565" }}
        >
          Preview - Screen {currentScreenIndex + 1} of{" "}
          {flowData.flowScreens.length}
        </CardTitle>
        <h5 className="mb-4" style={{ fontSize: "1.5rem", fontWeight: "600" }}>
          {currentScreen.title || "Untitled Screen"}
        </h5>
        {currentScreen.flowChildren.map((child, childIndex) => (
          <FormGroup key={childIndex} className="mb-4">
            {child.type !== QuestionTypes.TextHeading && (
              <Label
                className="mb-2"
                style={{ fontSize: "1.1rem", fontWeight: "500", color: "#333" }}
              >
                <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                  {childIndex + 1}.
                </span>
                {child.text || "Untitled Question"}{" "}
                {child.required && <span style={{ color: "red" }}>*</span>}
              </Label>
            )}
            {child.type === QuestionTypes.TextInput && (
              <Input
                type="text"
                value={answers[currentScreenIndex][childIndex] || ""}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[currentScreenIndex][childIndex] = e.target.value;
                  setAnswers(newAnswers);
                }}
                className="rounded-pill"
                style={{ padding: "10px 15px", borderColor: "#ced4da" }}
              />
            )}
            {child.type === QuestionTypes.TextArea && (
              <Input
                type="textarea"
                value={answers[currentScreenIndex][childIndex] || ""}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[currentScreenIndex][childIndex] = e.target.value;
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
                <FormGroup check key={optionIndex} className="mb-2">
                  <Input
                    type="radio"
                    name={`question_${childIndex}`}
                    value={option.optionText}
                    checked={
                      answers[currentScreenIndex][childIndex] ===
                      option.optionText
                    }
                    onChange={() => {
                      const newAnswers = [...answers];
                      newAnswers[currentScreenIndex][childIndex] =
                        option.optionText;
                      setAnswers(newAnswers);
                    }}
                    style={{ marginRight: "10px" }}
                  />
                  <Label check style={{ fontSize: "1rem", color: "#555" }}>
                    {option.optionText}
                  </Label>
                </FormGroup>
              ))}
            {child.type === QuestionTypes.CheckboxGroup &&
              child.flowOptions.map((option, optionIndex) => (
                <FormGroup check key={optionIndex} className="mb-2">
                  <Input
                    type="checkbox"
                    value={option.optionText}
                    checked={
                      answers[currentScreenIndex][childIndex]?.includes(
                        option.optionText
                      ) || false
                    }
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      const currentValues =
                        newAnswers[currentScreenIndex][childIndex] || [];
                      if (e.target.checked) {
                        newAnswers[currentScreenIndex][childIndex] = [
                          ...currentValues,
                          option.optionText,
                        ];
                      } else {
                        newAnswers[currentScreenIndex][childIndex] =
                          currentValues.filter(
                            (val) => val !== option.optionText
                          );
                      }
                      setAnswers(newAnswers);
                    }}
                    style={{ marginRight: "10px" }}
                  />
                  <Label check style={{ fontSize: "1rem", color: "#555" }}>
                    {option.optionText}
                  </Label>
                </FormGroup>
              ))}
            {child.type === QuestionTypes.TextHeading && (
              <div
                style={{
                  fontSize: "1.2rem",
                  color: "#333",
                  marginBottom: "10px",
                }}
              >
                {child.text || "Untitled Heading"}
              </div>
            )}
          </FormGroup>
        ))}
        {isSaved && (
          <div className="text-success text-center mb-3">
            <HiCheck size={24} /> Flow saved successfully
          </div>
        )}
        <div className="d-flex justify-content-between mt-4">
          {currentScreenIndex > 0 && (
            <Button
              color="secondary"
              onClick={() => setCurrentScreenIndex(currentScreenIndex - 1)}
              className="uniform_btn"
              style={{
                backgroundColor: "#e0e0e0",
                border: "none",
                color: "white",
              }}
            >
              Previous
            </Button>
          )}
          <div className="flex-grow-1" />
          {currentScreenIndex < flowData.flowScreens.length - 1 && (
            <Button
              color="primary"
              onClick={() => setCurrentScreenIndex(currentScreenIndex + 1)}
              className="uniform_btn"
              style={{ backgroundColor: "#00a884", border: "none" }}
              disabled={!areRequiredQuestionsAnswered()}
            >
              {currentScreen.screenButtonText || "Next"}
            </Button>
          )}
          {currentScreenIndex === flowData.flowScreens.length - 1 && (
            <Button
              color="primary"
              onClick={handlePreviewSave}
              className="uniform_btn"
              style={{ backgroundColor: "#00a884", border: "none" }}
            >
              Save
            </Button>
          )}
        </div>
      </CardBody>
      )}
    </Card>
    </div>
  );
};

// Validation helper function
const validateFlowData = (flowData) => {
  const errors = [];

  if (!flowData.senderId || flowData.senderId === "0") {
    errors.push("Please select a sender name");
  }
  if (!flowData.flowName.trim()) {
    errors.push("Flow name is required");
  }
  if (!flowData.flowLanguage) {
    errors.push("Please select a flow language");
  }

  if (flowData.flowScreens.length === 0) {
    errors.push("At least one screen is required");
  }

  flowData.flowScreens.forEach((screen, index) => {
    if (!screen.title.trim()) {
      errors.push(`Screen ${index + 1}: Title is required`);
    }
    
    if (!screen.screenButtonText.trim()) {
      errors.push(`Screen ${index + 1}: Button text is required`);
    }

    if (screen.flowChildren.length === 0) {
      errors.push(`Screen ${index + 1}: At least one control is required`);
    }

    screen.flowChildren.forEach((child, childIndex) => {
      if (!child.text.trim()) {
        errors.push(
          `Screen ${index + 1}, Control ${childIndex + 1}: Text is required`
        );
      }
      
      if (
        (child.type === QuestionTypes.RadioButtonsGroup || 
         child.type === QuestionTypes.CheckboxGroup)
      ) {
        if (child.flowOptions.length === 0) {
          errors.push(
            `Screen ${index + 1}, Control ${childIndex + 1}: At least one option is required`
          );
        }
        child.flowOptions.forEach((option, optionIndex) => {
          if (!option.optionText.trim()) {
            errors.push(
              `Screen ${index + 1}, Control ${childIndex + 1}, Option ${optionIndex + 1}: Option text is required`
            );
          }
        });
      }
    });
  });

  return errors;
};

const CreateFlowPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [SendernamesData, setSendernamesData] = useState([]);
  const [flowData, setFlowData] = useState({
    senderId: "0",
    flowName: "",
    moduleId : 4,
    flowLanguage: "",
    publishToFB: false,
    actionId: 0,
    actionType: 0,
    flowScreens: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentEditScreenIndex, setCurrentEditScreenIndex] = useState(0);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    if (currentEditScreenIndex >= flowData.flowScreens.length) {
      setCurrentEditScreenIndex(Math.max(0, flowData.flowScreens.length - 1));
    }
    setCurrentScreenIndex(currentEditScreenIndex);
  }, [flowData.flowScreens.length, currentEditScreenIndex]);

  const addScreen = () => {
    if (flowData.flowScreens.length >= 5) {
      toast.error("You can't add more than 5 screens");
      return;
    }
    
    const newScreen = {
      name: `screen`,
      title: "",
      screenButtonText: "", // Changed default to empty string to enforce validation
      flowChildren: [],
    };
    setFlowData({
      ...flowData,
      flowScreens: [...flowData.flowScreens, newScreen],
    });
    setCurrentEditScreenIndex(flowData.flowScreens.length);
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

  const addQuestion = () => {
    const currentScreen = flowData.flowScreens[currentEditScreenIndex];
    if (!currentScreen.title.trim()) {
      toast.error("Please enter a screen title before adding controls");
      return;
    }
    
    setCurrentQuestion({
      type: null,
      text: "",
      required: true,
      flowOptions: [],
    });
    setSelectedQuestionIndex(currentScreen.flowChildren.length);
    setModalOpen(true);
  };

  const deleteQuestion = (questionIndex) => {
    const updatedScreens = [...flowData.flowScreens];
    updatedScreens[currentEditScreenIndex].flowChildren.splice(questionIndex, 1);
    setFlowData({ ...flowData, flowScreens: updatedScreens });
  };

  const openQuestionModal = (questionIndex) => {
    setSelectedQuestionIndex(questionIndex);
    setCurrentQuestion({
      ...flowData.flowScreens[currentEditScreenIndex].flowChildren[questionIndex],
    });
    setModalOpen(true);
  };

  const addOption = () => {
    if (!currentQuestion) return;
    if (!currentQuestion.type) {
      toast.error("Please select an input type first");
      return;
    }
    const updatedQuestion = { ...currentQuestion };
    if (
      updatedQuestion.type === QuestionTypes.RadioButtonsGroup ||
      updatedQuestion.type === QuestionTypes.CheckboxGroup
    ) {
      updatedQuestion.flowOptions.push({
        //optionId: `option_${Date.now()}`,
        optionText: "",
      });
      setCurrentQuestion(updatedQuestion);
    }
  };

  const deleteOption = (optionIndex) => {
    if (!currentQuestion) return;
    const updatedQuestion = { ...currentQuestion };
    updatedQuestion.flowOptions.splice(optionIndex, 1);
    setCurrentQuestion(updatedQuestion);
  };

  const updateField = (field, value) => {
    setFlowData({ ...flowData, [field]: value });
  };

  const handleCancel = () => {
    router.push("/Flows/FlowList");
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

  const handleSenderChange = async(e) => {
    const selectedSenderId = e.target.value;
    setFlowData({ ...flowData, senderId: selectedSenderId });
    const senderId = e.target.value;
    console.log("Selected Sender ID:", senderId);
    // Clear sender name state before fetching new data
    dispatch(clearSendernameState());
    setSendernamesData(null); // Reset local state

    try {
      const response = await dispatch(
        fetchSendernameById({
          senderId: senderId,
          clientId: localStorage.getItem("clientId"),
        })
      ).unwrap();

      if (response) {
        console.log("Fetched Sender Data:", response.result); // Debugging
        setSendernamesData(response.result);
      } else {
        console.error("Failed to fetch details");
      }
    } catch (error) {
      console.error("Error fetching sender details:", error);
    } 
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setFlowData({ ...flowData, flowLanguage: language });
  };

  const handlePublishToFBChange = () => {
    setFlowData({ ...flowData, publishToFB: !flowData.publishToFB });
  };

  const handleSaveQuestion = () => {
    if (!currentQuestion) return;

    if (!currentQuestion.type) {
      toast.error("Please select an input type");
      return;
    }
    if (!currentQuestion.text.trim()) {
      toast.error("Please enter question/heading text");
      return;
    }
    
    if (
      (currentQuestion.type === QuestionTypes.RadioButtonsGroup || 
       currentQuestion.type === QuestionTypes.CheckboxGroup)
    ) {
      if (currentQuestion.flowOptions.length === 0) {
        toast.error("Please add at least one option");
        return;
      }
      if (currentQuestion.flowOptions.some(option => !option.optionText.trim())) {
        toast.error("All options must have text");
        return;
      }
    }

    const updatedScreens = [...flowData.flowScreens];
    updatedScreens[currentEditScreenIndex].flowChildren[selectedQuestionIndex] = {
      ...currentQuestion,
    };
    setFlowData({ ...flowData, flowScreens: updatedScreens });
    setModalOpen(false);
    setCurrentQuestion(null);
    setSelectedQuestionIndex(null);
  };

  useEffect(() => {
    // This will run when isLoading changes
    if (!isLoading) {
      // Loading has completed
      console.log('Loading completed');
      // Add any post-loading logic here if needed
    }
  }, [isLoading]);
  const handleSaveFlow = () => {
    debugger
    const errors = validateFlowData(flowData);
  
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }
  
    setIsLoading(true);
    const requestBody = {
      ...flowData,
      senderId: parseInt(flowData.senderId, 10),
    };
  
    dispatch(createFlows(requestBody))
      .unwrap()
      .then((response) => {
        if (response?.result?.status === 1) {
          showSweetAlert({
            title: response?.message || "Flow created successfully",
            text: "",
            icon: "success",
          });
          router.push('/Flows/FlowList');
        } else {
          showSweetAlert({
            title: response?.message || "An error occurred",
            text: "",
            icon: "error",
          });
        }
      })
      .catch((error) => {
        showSweetAlert({
          title: error?.message || "An unexpected error occurred",
          text: "",
          icon: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setIsLoading(true);
    try {
      updateField("actionId", templateId);
    } catch (error) {
      console.error("Error in handleTemplateChange:", error);
    }finally {
      setIsLoading(false);
    }
  };
  const handleFlowChange = async (e) => {
    setIsLoading(true);
    const flowId = e.target.value;
    try {
      updateField("actionId", flowId);
    } catch (error) {
      console.error("Error in handleFlowChange:", error);
    }finally {
      setIsLoading(false);
    }
  };


  

  return (
    <App>
      {isLoading && <Loader />}
      <Container
        fluid
        className="py-4 create-flow-container"
        style={{ minHeight: "100vh" }}
      >
        <h2 className="mb-4">Create Flow</h2>
        
        <Row className="flex-grow-1" style={{ overflow: "hidden" }}>
          <Col
            md={7}
            className="h-100"
            style={{ overflowY: "auto", paddingRight: "15px" }}
          >
            <Card className="mb-4 shadow-sm max-h-[80vh] overflow-auto">
              <CardBody>
                <Form>
                  <FormGroup>
                    <Label>Sender Name *</Label>
                    <SendernameDropdown
                      value={flowData.senderId}
                      onChange={handleSenderChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Flow Name *</Label>
                    <Input
                      value={flowData.flowName}
                      onChange={(e) => updateField("flowName", e.target.value)}
                      className="rounded"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Flow Language *</Label>
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
                    onChange={(e) => updateField("actionType", parseInt(e.target.value))}
                    >
                              {dropdownOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                          {(flowData.actionType === 1 || flowData.actionType === "1") && (
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
        {(flowData.actionType === 8 || flowData.actionType === "8") && (
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
                      style={{ backgroundColor: "#00a884", border: "none" }}
                    >
                      Add Screen
                    </Button>
                  </div>
                  {flowData.flowScreens.length > 0 && (
                    <>
                      <Tabs
                        activeKey={currentEditScreenIndex}
                        onSelect={(key) => setCurrentEditScreenIndex(parseInt(key))}
                        className="mb-3"
                        variant="pills"
                        style={{
                          backgroundColor: "#f8f9fa",
                          padding: "10px",
                          borderRadius: "8px",
                        }}
                      >
                        {flowData.flowScreens.map((screen, index) => (
                          <Tab
                            eventKey={index}
                            title={`Screen ${index + 1}`}
                            key={index}
                            tabClassName="px-3 py-2"
                            style={{
                              backgroundColor:
                                currentEditScreenIndex === index
                                  ? "#00a884"
                                  : "transparent",
                              color:
                                currentEditScreenIndex === index
                                  ? "white"
                                  : "#333",
                              borderRadius: "20px",
                              marginRight: "5px",
                            }}
                          />
                        ))}
                      </Tabs>
                      <Card className="mb-3 shadow-sm">
                        <CardBody>
                          <div className="flex justify-end">
                            <Button
                              color="danger"
                              onClick={deleteScreen}
                              disabled={flowData.flowScreens.length <= 1}
                            >
                              <HiTrash />
                            </Button>
                          </div>
                          <FormGroup>
                            <Label>Screen Title *</Label>
                            <Input
                              value={flowData.flowScreens[currentEditScreenIndex].title}
                              onChange={(e) => updateScreenField("title", e.target.value)}
                              className="rounded"
                              required
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
                            {flowData.flowScreens[currentEditScreenIndex].flowChildren.map(
                              (child, childIndex) => (
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
                              )
                            )}
                          </ListGroup>
                          <FormGroup className="mt-3">
                            <Label>Button Text *</Label> {/* Added asterisk to indicate required */}
                            <Input
                              value={flowData.flowScreens[currentEditScreenIndex].screenButtonText}
                              onChange={(e) =>
                                updateScreenField("screenButtonText", e.target.value)
                              }
                              className="rounded"
                              required
                            />
                          </FormGroup>
                        </CardBody>
                      </Card>
                    </>
                  )}
                </Form>
              </CardBody>
            </Card>
            <div className="flex gap-4 justify-end">
          <button onClick={handleCancel} className="Btn-Regular-1">
            Cancel
          </button>
          <Button
            onClick={handleSaveFlow}
            className="uniform_btn"
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#00a884",
              border: "none",
            }}
          >
            Save Flow
          </Button>
        </div>
          </Col>
          <Col
            md={5}
            className="h-100"
            style={{
              overflowY: "auto",
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
          >
            <div >
              <FlowPreview
                flowData={flowData}
                currentScreenIndex={currentScreenIndex}
                setCurrentScreenIndex={setCurrentScreenIndex}
                senderNameData={SendernamesData}
              />
            </div>
          </Col>
        </Row>

        <Modal
          isOpen={modalOpen}
          toggle={() => setModalOpen(false)}
          fade={false}
        >
          <div className="fixed inset-0  bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white  p-6 rounded shadow-lg w-1/3 relative">
              <ModalHeader toggle={() => setModalOpen(false)}>
                {selectedQuestionIndex !== null ? "Edit Control" : "Add Control"}
              </ModalHeader>
              <ModalBody className="max-h-[50vh] overflow-auto">
                {currentQuestion && (
                  <Form>
                    <FormGroup>
                      <Label>Input Type *</Label>
                      <Input
                        type="select"
                        value={currentQuestion.type || ""}
                        onChange={(e) =>
                          updateQuestionField("type", parseInt(e.target.value))
                        }
                        className="rounded"
                        required
                      >
                        <option value="" disabled>
                          Select Input Type
                        </option>
                        <option value={QuestionTypes.TextInput}>Text Input</option>
                        <option value={QuestionTypes.TextArea}>Textarea</option>
                        <option value={QuestionTypes.RadioButtonsGroup}>
                          Radio Buttons
                        </option>
                        <option value={QuestionTypes.CheckboxGroup}>
                          Checkbox Group
                        </option>
                        <option value={QuestionTypes.TextHeading}>Text Heading</option>
                      </Input>
                    </FormGroup>
                    {currentQuestion.type && (
                      currentQuestion.type === QuestionTypes.TextHeading ? (
                        <FormGroup>
                          <Label>Heading Text *</Label>
                          <Input
                            value={currentQuestion.text}
                            onChange={(e) => updateQuestionField("text", e.target.value)}
                            className="rounded"
                            required
                            placeholder="Enter heading text"
                          />
                        </FormGroup>
                      ) : (
                        <>
                          <FormGroup>
                            <Label>Question Text *</Label>
                            <Input
                              value={currentQuestion.text}
                              onChange={(e) => updateQuestionField("text", e.target.value)}
                              className="rounded"
                              required
                            />
                          </FormGroup>
                          <FormGroup check>
                            <Input
                              type="checkbox"
                              checked={currentQuestion.required}
                              onChange={() =>
                                updateQuestionField("required", !currentQuestion.required)
                              }
                            />
                            <Label check>Required</Label>
                          </FormGroup>
                          {(currentQuestion.type === QuestionTypes.RadioButtonsGroup ||
                            currentQuestion.type === QuestionTypes.CheckboxGroup) && (
                            <>
                              <Button
                                size="sm"
                                onClick={addOption}
                                className="uniform_btn"
                              >
                                Add Option
                              </Button>
                              {currentQuestion.flowOptions.map((option, optionIndex) => (
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
                                    required
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
                              ))}
                            </>
                          )}
                        </>
                      )
                    )}
                  </Form>
                )}
              </ModalBody>
              <ModalFooter>
                <button
                  color="primary"
                  onClick={handleSaveQuestion}
                  className="uniform_btn"
                >
                  Save
                </button>
              </ModalFooter>
            </div>
          </div>
        </Modal>
      </Container>
    </App>
  );
};

export default CreateFlowPage;