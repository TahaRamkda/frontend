import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRecoilValue } from "recoil";
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
  CardTitle 
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
import LanguageDropdown from '@/components/Dropdowns/LanguageDropdown';
import { fetchFlowDetailsById, updateFlow } from '@/slices/FlowsSlice';
import showSweetAlert from '@/components/Sweetalert';
import { FlowState } from '@/components/recoil';
import App from '@/components/Layout/App';
// Enum for question types
const QuestionTypes = {
  TextInput: 1,
  TextArea: 2,
  RadioButtonsGroup: 3,
  CheckboxGroup: 4,
  TextHeading: 5
};

// Separate component for the preview section
const FlowPreview = ({ flowData, currentScreenIndex, setCurrentScreenIndex }) => {
  const [answers, setAnswers] = useState(() => 
    flowData.flowScreens.map(screen => 
      screen.flowChildren.map(child => {
        if (child.type === QuestionTypes.TextInput || child.type === QuestionTypes.TextArea) return '';
        if (child.type === QuestionTypes.RadioButtonsGroup) return null;
        if (child.type === QuestionTypes.CheckboxGroup) return [];
        if (child.type === QuestionTypes.TextHeading) return null;
        return '';
      })
    )
  );

  useEffect(() => {
    setAnswers(prevAnswers => {
      const newAnswers = flowData.flowScreens.map((screen, screenIdx) => {
        return screen.flowChildren.map((child, childIdx) => {
          const existingAnswer = prevAnswers[screenIdx]?.[childIdx];
          if (existingAnswer !== undefined) return existingAnswer;
          if (child.type === QuestionTypes.TextInput || child.type === QuestionTypes.TextArea) return '';
          if (child.type === QuestionTypes.RadioButtonsGroup) return null;
          if (child.type === QuestionTypes.CheckboxGroup) return [];
          if (child.type === QuestionTypes.TextHeading) return null;
          return '';
        });
      });
      return newAnswers;
    });
  }, [flowData]);

  if (flowData.flowScreens.length === 0 || currentScreenIndex < 0 || currentScreenIndex >= flowData.flowScreens.length) {
    return (
      <div className="text-center text-muted py-5" style={{ fontSize: '1.2rem' }}>
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
      if (child.type === QuestionTypes.TextInput || child.type === QuestionTypes.TextArea) 
        return answer !== undefined && answer.trim() !== '';
      if (child.type === QuestionTypes.RadioButtonsGroup) 
        return answer !== null;
      if (child.type === QuestionTypes.CheckboxGroup) 
        return answer !== undefined && answer?.length > 0;
      if (child.type === QuestionTypes.TextHeading) 
        return true;
      return true;
    });
  };

  return (
    <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
      <CardBody className="p-4">
        <CardTitle className="mb-3" style={{ fontSize: '1rem', color: '#656565' }}>
          Preview - Screen {currentScreenIndex + 1} of {flowData.flowScreens.length}
        </CardTitle>
        <h5 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
          {currentScreen.title || 'Untitled Screen'}
        </h5>
        {currentScreen.flowChildren.map((child, childIndex) => (
          <FormGroup key={childIndex} className="mb-4">
            <Label className="mb-2" style={{ fontSize: '1.1rem', fontWeight: '500', color: '#333' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{childIndex + 1}.</span>
              {child.text || 'Untitled Question'} {child.required && child.type !== QuestionTypes.TextHeading && <span style={{ color: 'red' }}>*</span>}
            </Label>
            {child.type === QuestionTypes.TextInput && (
              <Input
                type="text"
                value={answers[currentScreenIndex][childIndex] || ''}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[currentScreenIndex][childIndex] = e.target.value;
                  setAnswers(newAnswers);
                }}
                className="rounded-pill"
                style={{ padding: '10px 15px', borderColor: '#ced4da' }}
              />
            )}
            {child.type === QuestionTypes.TextArea && (
              <Input
                type="textarea"
                value={answers[currentScreenIndex][childIndex] || ''}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[currentScreenIndex][childIndex] = e.target.value;
                  setAnswers(newAnswers);
                }}
                className="rounded"
                style={{ padding: '10px 15px', borderColor: '#ced4da', minHeight: '100px' }}
              />
            )}
            {child.type === QuestionTypes.RadioButtonsGroup && (
              child.flowOptions.map((option, optionIndex) => (
                <FormGroup check key={optionIndex} className="mb-2">
                  <Input
                    type="radio"
                    name={`question_${childIndex}`}
                    value={option.optionText}
                    checked={answers[currentScreenIndex][childIndex] === option.optionText}
                    onChange={() => {
                      const newAnswers = [...answers];
                      newAnswers[currentScreenIndex][childIndex] = option.optionText;
                      setAnswers(newAnswers);
                    }}
                    style={{ marginRight: '10px' }}
                  />
                  <Label check style={{ fontSize: '1rem', color: '#555' }}>
                    {option.optionText}
                  </Label>
                </FormGroup>
              ))
            )}
            {child.type === QuestionTypes.CheckboxGroup && (
              child.flowOptions.map((option, optionIndex) => (
                <FormGroup check key={optionIndex} className="mb-2">
                  <Input
                    type="checkbox"
                    value={option.optionText}
                    checked={answers[currentScreenIndex][childIndex]?.includes(option.optionText) || false}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      const currentValues = newAnswers[currentScreenIndex][childIndex] || [];
                      if (e.target.checked) {
                        newAnswers[currentScreenIndex][childIndex] = [...currentValues, option.optionText];
                      } else {
                        newAnswers[currentScreenIndex][childIndex] = currentValues.filter(val => val !== option.optionText);
                      }
                      setAnswers(newAnswers);
                    }}
                    style={{ marginRight: '10px' }}
                  />
                  <Label check style={{ fontSize: '1rem', color: '#555' }}>
                    {option.optionText}
                  </Label>
                </FormGroup>
              ))
            )}
            {child.type === QuestionTypes.TextHeading && (
              <div style={{ fontSize: '1.2rem', color: '#333', marginBottom: '10px' }}>
                {child.text || 'Untitled Heading'}
              </div>
            )}
          </FormGroup>
        ))}
        <div className="d-flex justify-content-between mt-4">
          {currentScreenIndex > 0 && (
            <Button 
              color="secondary" 
              onClick={() => setCurrentScreenIndex(currentScreenIndex - 1)}
              className="rounded-pill px-4 py-2"
              style={{ backgroundColor: '#e0e0e0', border: 'none', color: '#333' }}
            >
              Previous
            </Button>
          )}
          <div className="flex-grow-1" />
          {currentScreenIndex < flowData.flowScreens.length - 1 && (
            <Button 
              color="primary" 
              onClick={() => setCurrentScreenIndex(currentScreenIndex + 1)}
              className="rounded-pill px-4 py-2"
              style={{ backgroundColor: '#00a884', border: 'none' }}
              disabled={!areRequiredQuestionsAnswered()}
            >
              Next
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

const UpdateFlowPage = () => {
  const dispatch = useDispatch();
  const flowId = useRecoilValue(FlowState);
  const [flowData, setFlowData] = useState({
    senderId: "0",
    flowName: '',
    flowLanguage: '',
    publishToFB: false,
    flowScreens: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentEditScreenIndex, setCurrentEditScreenIndex] = useState(0);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  useEffect(() => {
    const fetchFlowData = async () => {
      if (flowId) {
        setIsLoading(true);
        try {
          const response = await dispatch(fetchFlowDetailsById({ id: flowId })).unwrap();
          if (response) {
            // Ensure deep copy of nested objects to avoid immutability issues
            setFlowData(JSON.parse(JSON.stringify(response)));
          } else {
            showSweetAlert({ title: "Error", text: "No flow data found", icon: "error" });
          }
        } catch (error) {
          console.error('Failed to fetch flow details:', error);
          showSweetAlert({ title: "Error", text: "Failed to fetch flow details", icon: "error" });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFlowData();
  }, [dispatch, flowId]);

  useEffect(() => {
    if (currentEditScreenIndex >= flowData.flowScreens.length) {
      setCurrentEditScreenIndex(Math.max(0, flowData.flowScreens.length - 1));
    }
    setCurrentScreenIndex(currentEditScreenIndex);
  }, [flowData.flowScreens.length, currentEditScreenIndex]);

  const addScreen = () => {
    const newScreen = {
      name: `screen_${flowData.flowScreens.length + 1}`,
      title: '',
      screenButtonText: 'Next',
      flowChildren: []
    };
    setFlowData({
      ...flowData,
      flowScreens: [...flowData.flowScreens, newScreen]
    });
    setCurrentEditScreenIndex(flowData.flowScreens.length);
  };

  const deleteScreen = () => {
    if (flowData.flowScreens.length <= 1) return;
    const updatedScreens = flowData.flowScreens.filter((_, index) => index !== currentEditScreenIndex);
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
    const newQuestion = {
      text: '',
      type: QuestionTypes.TextInput,
      required: true,
      flowOptions: []
    };
    const updatedScreens = [...flowData.flowScreens];
    updatedScreens[currentEditScreenIndex].flowChildren.push(newQuestion);
    setFlowData({ ...flowData, flowScreens: updatedScreens });
  };

  const addOption = (questionIndex) => {
    const updatedScreens = JSON.parse(JSON.stringify(flowData.flowScreens)); // Deep copy
    const question = updatedScreens[currentEditScreenIndex].flowChildren[questionIndex];
    if (question.type === QuestionTypes.RadioButtonsGroup || question.type === QuestionTypes.CheckboxGroup) {
      question.flowOptions.push({
        optionId: `option_${Date.now()}`,
        optionText: ''
      });
      setFlowData({ ...flowData, flowScreens: updatedScreens });
    }
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const updatedScreens = JSON.parse(JSON.stringify(flowData.flowScreens)); // Deep copy
    const question = updatedScreens[currentEditScreenIndex].flowChildren[questionIndex];
    if (question.type === QuestionTypes.RadioButtonsGroup || question.type === QuestionTypes.CheckboxGroup) {
      question.flowOptions.splice(optionIndex, 1);
      setFlowData({ ...flowData, flowScreens: updatedScreens });
    }
  };

  const updateField = (field, value) => {
    setFlowData({ ...flowData, [field]: value });
  };

  const updateScreenField = (field, value) => {
    const updatedScreens = JSON.parse(JSON.stringify(flowData.flowScreens)); // Deep copy
    updatedScreens[currentEditScreenIndex][field] = value;
    setFlowData({ ...flowData, flowScreens: updatedScreens });
  };

  const updateQuestionField = (questionIndex, field, value) => {
    const updatedScreens = JSON.parse(JSON.stringify(flowData.flowScreens)); // Deep copy
    updatedScreens[currentEditScreenIndex].flowChildren[questionIndex] = {
      ...updatedScreens[currentEditScreenIndex].flowChildren[questionIndex],
      [field]: value
    };
    setFlowData({ ...flowData, flowScreens: updatedScreens });
  };

  const updateOptionField = (questionIndex, optionIndex, field, value) => {
    const updatedScreens = JSON.parse(JSON.stringify(flowData.flowScreens)); // Deep copy
    updatedScreens[currentEditScreenIndex].flowChildren[questionIndex].flowOptions[optionIndex] = {
      ...updatedScreens[currentEditScreenIndex].flowChildren[questionIndex].flowOptions[optionIndex],
      [field]: value
    };
    setFlowData({ ...flowData, flowScreens: updatedScreens });
  };

  const handleSenderChange = (e) => {
    const selectedSenderId = e.target.value;
    setFlowData({ ...flowData, senderId: selectedSenderId });
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setFlowData({ ...flowData, flowLanguage: language });
  };

  const handleRequiredChange = (questionIndex) => {
    const updatedScreens = JSON.parse(JSON.stringify(flowData.flowScreens)); // Deep copy
    updatedScreens[currentEditScreenIndex].flowChildren[questionIndex].required = 
      !updatedScreens[currentEditScreenIndex].flowChildren[questionIndex].required;
    setFlowData({ ...flowData, flowScreens: updatedScreens });
  };

  const handleSaveFlow = () => {
    const requestBody = {
      ...flowData,
      senderId: parseInt(flowData.senderId, 10),
      id: flowId
    };
    dispatch(updateFlow(requestBody))
      .unwrap()
      .then(() => {
        showSweetAlert({ 
          title: "Success", 
          text: "Flow updated successfully", 
          icon: "success" 
        });
      })
      .catch((error) => {
        console.error('Failed to update flow:', error);
        showSweetAlert({ title: "Error", text: error.message || "An error occurred", icon: "error" });
      });
  };

  const goToPreviousScreen = () => {
    if (currentEditScreenIndex > 0) {
      setCurrentEditScreenIndex(currentEditScreenIndex - 1);
    }
  };

  const goToNextScreen = () => {
    if (currentEditScreenIndex < flowData.flowScreens.length - 1) {
      setCurrentEditScreenIndex(currentEditScreenIndex + 1);
    }
  };

  return (
    <App>
    <Container fluid className="py-4" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2>{flowId ? "Update Flow" : "Create WhatsApp Business Flow"}</h2>
      {isLoading ? (
        <div>Loading flow details...</div>
      ) : (
        <Row style={{ flex: 1, overflow: 'hidden' }}>
          <Col md={6} style={{ height: '100%', overflowY: 'auto', paddingRight: '15px' }}>
            <Card className="mb-4">
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
                      onChange={(e) => updateField('flowName', e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Flow Language</Label>
                    <LanguageDropdown 
                      value={flowData.flowLanguage}
                      onChange={handleLanguageChange}
                    />
                  </FormGroup>
                  <div className="d-flex justify-content-between mb-3">
                    <Button
                      color="secondary"
                      onClick={goToPreviousScreen}
                      disabled={currentEditScreenIndex === 0}
                      className="rounded-pill px-4 py-2"
                      style={{ backgroundColor: '#e0e0e0', border: 'none', color: '#333' }}
                    >
                      Previous Screen
                    </Button>
                    <Button
                      color="primary"
                      onClick={addScreen}
                      className="rounded-pill px-4 py-2"
                      style={{ backgroundColor: '#00a884', border: 'none' }}
                    >
                      Add Screen
                    </Button>
                    <Button
                      color="secondary"
                      onClick={goToNextScreen}
                      disabled={currentEditScreenIndex === flowData.flowScreens.length - 1}
                      className="rounded-pill px-4 py-2"
                      style={{ backgroundColor: '#e0e0e0', border: 'none', color: '#333' }}
                    >
                      Next Screen
                    </Button>
                  </div>
                  {flowData.flowScreens.length > 0 && (
                    <Card className="mb-3">
                      <CardBody>
                        <div className="d-flex justify-content-between align-items-center">
                          <h5>Screen {currentEditScreenIndex + 1} of {flowData.flowScreens.length}</h5>
                          <Button 
                            color="danger" 
                            size="sm" 
                            onClick={deleteScreen}
                            disabled={flowData.flowScreens.length <= 1}
                          >
                            Delete
                          </Button>
                        </div>
                        <FormGroup>
                          <Label>Screen Title</Label>
                          <Input
                            value={flowData.flowScreens[currentEditScreenIndex].title}
                            onChange={(e) => updateScreenField('title', e.target.value)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Button Text</Label>
                          <Input
                            value={flowData.flowScreens[currentEditScreenIndex].screenButtonText}
                            onChange={(e) => updateScreenField('screenButtonText', e.target.value)}
                          />
                        </FormGroup>
                        <Button
                          color="success"
                          size="sm"
                          onClick={addQuestion}
                          className="mb-2"
                        >
                          Add Question
                        </Button>
                        {flowData.flowScreens[currentEditScreenIndex].flowChildren.map((child, childIndex) => (
                          <div key={childIndex} className="border p-3 mb-2">
                            <FormGroup>
                              <Label>Question Text</Label>
                              <Input
                                value={child.text}
                                onChange={(e) => updateQuestionField(childIndex, 'text', e.target.value)}
                              />
                            </FormGroup>
                            {child.type !== QuestionTypes.TextHeading && (
                              <FormGroup check>
                                <Input
                                  type="checkbox"
                                  name={`required_${currentEditScreenIndex}_${childIndex}`}
                                  checked={child.required}
                                  onChange={() => handleRequiredChange(childIndex)}
                                />
                                <Label check>Required</Label>
                              </FormGroup>
                            )}
                            <FormGroup>
                              <Label>Input Type</Label>
                              <Input
                                type="select"
                                value={child.type}
                                onChange={(e) => updateQuestionField(childIndex, 'type', parseInt(e.target.value))}
                              >
                                <option value={QuestionTypes.TextInput}>Text Input</option>
                                <option value={QuestionTypes.TextArea}>Textarea</option>
                                <option value={QuestionTypes.RadioButtonsGroup}>Radio Buttons</option>
                                <option value={QuestionTypes.CheckboxGroup}>Checkbox Group</option>
                                <option value={QuestionTypes.TextHeading}>Text Heading</option>
                              </Input>
                            </FormGroup>
                            {(child.type === QuestionTypes.RadioButtonsGroup || child.type === QuestionTypes.CheckboxGroup) && (
                              <>
                                <Button
                                  color="info"
                                  size="sm"
                                  onClick={() => addOption(childIndex)}
                                  className="mb-2"
                                >
                                  Add Option
                                </Button>
                                {child.flowOptions.map((option, optionIndex) => (
                                  <FormGroup key={optionIndex} className="mt-2 d-flex align-items-center">
                                    <Input
                                      value={option.optionText}
                                      onChange={(e) => updateOptionField(childIndex, optionIndex, 'optionText', e.target.value)}
                                      placeholder={`Option ${optionIndex + 1}`}
                                      style={{ flex: 1, marginRight: '10px' }}
                                    />
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => deleteOption(childIndex, optionIndex)}
                                    >
                                      Delete
                                    </Button>
                                  </FormGroup>
                                ))}
                              </>
                            )}
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  )}
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col 
                     md={6} 
                     className="h-100" 
                     style={{ overflowY: 'auto', paddingLeft: '15px', paddingRight: '15px' }}
                   >
                     <div style={{ paddingTop: '20px' }}>
                       <FlowPreview 
                         flowData={flowData} 
                         currentScreenIndex={currentScreenIndex} 
                         setCurrentScreenIndex={setCurrentScreenIndex} 
                       />
                     </div>
                   </Col>
        </Row>
      )}
      <Button 
        color="success" 
        onClick={handleSaveFlow} 
        style={{ marginTop: '20px', alignSelf: 'flex-start' }}
        disabled={isLoading}
      >
        {flowId ? "Update Flow" : "Save Flow"}
      </Button>
    </Container>
    </App>
  );
};

export default UpdateFlowPage;