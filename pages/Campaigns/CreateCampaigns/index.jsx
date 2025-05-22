import { useState, useEffect } from "react";
import { Formik, Field, useFormikContext } from "formik";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
//import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTemplatesById,
  clearTemplateDetailState,
} from "@/slices/TemplateSlice";
import {
  createCampaign,
  clearCampaignCreeateState,
} from "@/slices/campaignSlice";
import showSweetAlert from "@/components/Sweetalert";
import Groups from "@/components/MultiSelect/GroupDropdown";
import Templates from "@/components/Dropdowns/TemplateDropdown";
import App from "@/components/Layout/App";
import moment from "moment";
import { useRouter } from "next/router";
import MediaPopUp from "@/pages/Media/MediaPopUp";
import { fetchSendernameById, clearSendernameState } from "@/slices/sendernameSlice";
import Loader from "@/components/Layout/Loader";
import bagroundimage from "@/public/images/baground.jpg";
import { BASE_URL } from "@/utils/apiConstants";
import { toast } from "react-toastify";
const CampaignCreate = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [CampaignLoading, setCampaignLoading] = useState(false);
  const { template, loading, error } = useSelector((state) => state.templates);
  const [messagePreview, setMessagePreview] = useState({
    header: "",
    body: "",
    footer: "",
    media: null,
    buttons: [],
    visitWebsiteButtonCount: 0,
  });
  const { sendername } = useSelector((state) => state.sendernames);
  const [showMediaPopup, setShowMediaPopup] = useState(false);
  const [campaignName, setcampaignName] = useState("");
  const [variables, setVariables] = useState([]);
  const [senturlvariables, setsenturlvariables] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [headContent, setHeadContent] = useState("");
  const [headerVariable, setHeaderVariable] = useState([]);
  const [bodyFinalContent, setBodyFinalContent] = useState("");
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [selectedMediaId, setSelectedMediaId] = useState(0);
  const [selectedMediaPath, setSelectedMediaPath] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [TotalButtonCount, setTotalButtonCount] = useState(0);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [Showallbutton, setShowallbutton] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const [MessagePreviewupdated, setMessagePreviewupdated] = useState(false);

  const handleGroupSelection = (groupIds) => {
    setSelectedGroups(groupIds);
    console.log("Selected Groups:", groupIds);
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
  
    // Reset all template-related states
    setVariables([]);
    setHeaderVariable([]);
    setsenturlvariables([]);
    setSelectedTemplateId(templateId);
    setMessagePreview({
      header: "",
      body: "",
      footer: "",
      media: null,
      buttons: [],
      visitWebsiteButtonCount: 0,
    });
    setHeadContent("");
    setBodyFinalContent("");
    setSelectedMediaId(0);
    setSelectedMediaPath("");
    setSelectedMediaType("");
    setTotalButtonCount(0);
    setMessagePreviewupdated(false);
    setErrorMessage("");
    setSelectedSenderId(null);
  
    // Clear the template detail state in Redux
    dispatch(clearTemplateDetailState());
  
    // If a valid templateId is selected, fetch the new template
    if (templateId) {
      setCampaignLoading(true);
      dispatch(
        fetchTemplatesById({
          ClientId: localStorage.getItem("clientId"),
          templateId: templateId,
        })
      )
        .catch((error) => {
          console.error("Error fetching template:", error);
          toast.error("Failed to fetch template data");
        })
        .finally(() => {
          setCampaignLoading(false);
        });
    }
  };
  useEffect(() => {
    if (selectedTemplateId) {
      setCampaignLoading(true);
      dispatch(
        fetchTemplatesById({
          ClientId: localStorage.getItem("clientId"),
          templateId: selectedTemplateId,
        })
      )
        .then((response) => {
          setTemplate(response); // Assuming response is the template object
        })
        .catch((error) => {
          console.error("Error fetching template:", error);
        })
        .finally(() => {
          setCampaignLoading(false);
        });
    }
  }, [dispatch, selectedTemplateId]);

  useEffect(() => {
    const fetchSenderName = async () => {
      if (selectedSenderId) {
        try {
          await dispatch(
            fetchSendernameById({
              senderId: selectedSenderId,
              clientId: localStorage.getItem("clientId"),
            })
          ).unwrap();
        } catch (error) {
          console.error("Error fetching sender name:", error);
        }
      }
    };

    // Clear state before fetching new data
    dispatch(clearSendernameState());

    fetchSenderName();

    // Cleanup function to clear state when component unmounts
    return () => {
      dispatch(clearSendernameState());
    };
  }, [selectedSenderId, dispatch]);

  useEffect(() => {
    if (CampaignLoading || !template) return;
    setSelectedSenderId(template.senderId);
    // Map buttons with conditional logic for phoneNumber or URL
    const customButtons =
      template.buttons?.map((button) => ({
        type: button.buttonType, // Copy over the type
        text: button.buttonText, // Copy over the label
        ...(button.buttonType === 2
          ? { phoneNumber: button.buttonValue }
          : button.buttonType === 3
          ? { url: button.buttonValue }
          : {}),
      })) ?? [];

    // Construct the complete message preview locally
    const updatedMessagePreview = {
      body: template.bodyText,
      footer: template.footerText,
      media: template.mediaPath,
      buttons: customButtons,
      templatename: template.templateName,
      visitWebsiteButtonCount: 0,
      header: template.headerType === 1 ? template.headerText : undefined,
    };

    // Set messagePreview state only if it has changed and not already set
    setMessagePreview((prevPreview) =>
      JSON.stringify(prevPreview) !== JSON.stringify(updatedMessagePreview)
        ? updatedMessagePreview
        : prevPreview
    );

    // Mark messagePreview as set
    if (!MessagePreviewupdated) {
      setMessagePreviewupdated(true);
    }

    // Update Header State
    if (template.headerType === 1) {
      setHeadContent(template.headerText);
      //setupdatedheadvercontent(template.headerText);
      //setheaderTextCount(template.headerParamCount);
    } else {
      setSelectedMediaId(template.mediaId);
      setSelectedMediaPath(template.mediaPath);
      setSelectedMediaType(template.contentType);
    }

    // Update Body State
    setBodyFinalContent(template.bodyText);
    // Update Other Template-Related States
    //setSelectedSenderId(template.senderId);
    //setTemplatetype(template.category);
    //setlanguage(template.language);
    setTotalButtonCount(updatedMessagePreview.buttons.length);
  }, [CampaignLoading, template]);

  useEffect(() => {
    if (!MessagePreviewupdated || CampaignLoading || !template.parameters) return;

    // Use a flag to ensure this runs only once
    let parametersProcessed = false;
    if (parametersProcessed) return;

    // Process Parameters
    const filteredHeaderValues = template.parameters.filter(
      (variable) => variable?.paramType === 1
    );
    if (filteredHeaderValues.length > 0) {
      const allVariables = filteredHeaderValues.map(
        (variable) => variable.paramName
      );
      addHeaderVariable(null, allVariables);
      filteredHeaderValues.forEach((variable) => {
        if (variable?.paramDefaultValue !== undefined) {
          handleheaderVariableChange(
            variable.paramName,
            variable.paramDefaultValue
          );
        }
      });
    }

    const filteredBodyValues = template.parameters.filter(
      (variable) => variable?.paramType === 2
    );
    if (filteredBodyValues.length > 0) {
      const allVariables = filteredBodyValues.map(
        (variable) => variable.paramName
      );
      addVariable(null, allVariables);
      filteredBodyValues.forEach((variable) => {
        if (variable?.paramDefaultValue !== undefined) {
          handleVariableChange(variable.paramName, variable.paramDefaultValue);
        }
      });
    }

    const filteredURLValues = template.parameters.filter(
      (variable) => variable?.paramType === 3
    );
    if (filteredURLValues.length > 0) {
      ;
      setsenturlvariables(filteredURLValues);

      const allVariables = filteredURLValues.map(
        (variable) => variable.paramName
      );

      filteredURLValues
        .filter((variable) => variable?.paramDefaultValue !== undefined)
        .map((variable, index) =>
          handleurlVariableChange(index, variable.paramDefaultValue)
        );
    }

    // Mark parameters as processed
    parametersProcessed = true;

    // Clear Template Detail State
    clearTemplateDetailState();
  }, [MessagePreviewupdated]);



  const addHeaderVariable = (variablename, allVariables) => {
    setHeaderVariable((prev) => {
      // Reset variables array if this is the first call with allVariables
      if (allVariables) {
        return allVariables.map((variable) => {
          // Check if the variable already exists and maintain its value, otherwise default to an empty string
          const existingVariable = prev.find((v) => v.name === variable);
          return {
            name: variable,
            value: existingVariable ? existingVariable.value : "", // If variable exists, retain its value
          };
        });
      }

      // Add a new variable if it doesn't already exist
      const existingVariable = prev.find((v) => v.name === variablename);
      if (!existingVariable) {
        return [...prev, { name: variablename, value: "" }];
      }

      return prev; // Return unchanged if the variable already exists
    });

    setErrorMessage(""); // Clear error message after adding or updating variable
  };

  const addVariable = (variablename, allVariables) => {
    // If this is the first call, clear the existing array
    setVariables((prev) => {
      // Reset variables array if this is the first call with allVariables
      if (allVariables) {
        return allVariables.map((variable) => {
          // Check if the variable already exists and maintain its value, otherwise default to an empty string
          const existingVariable = prev.find((v) => v.name === variable);
          return {
            name: variable,
            value: existingVariable ? existingVariable.value : "", // If variable exists, retain its value
          };
        });
      }

      // Add a new variable if it doesn't already exist
      const existingVariable = prev.find((v) => v.name === variablename);
      if (!existingVariable) {
        return [...prev, { name: variablename, value: "" }];
      }

      return prev; // Return unchanged if the variable already exists
    });

    setErrorMessage(""); // Clear error message after adding or updating variable
  };

  //submit function to create campaign main request body creates here
  const handleSubmit = async (values) => {
    if (!campaignName) {
      toast.error("Please enter a campaign name before proceeding");
      return;
    }
    if (!Array.isArray(selectedGroups) || selectedGroups.length === 0) {
      toast.error("Please select a group before proceeding");
      return; // Stop execution
    }
    if (!selectedTemplateId) {
      toast.error("Please select a template before proceeding");
      return;
    }

    const requestBody = {
      templateId: selectedTemplateId,
      clientId: localStorage.getItem("clientId"),
      campaignName: campaignName,
      senderId: template.senderId,
      groupIds: selectedGroups.join(","),
      mediaId: selectedMediaId,
      actionBy: localStorage.getItem("userId"),
      campaignParameters: [
        ...headerVariable.map((variable, index) => ({
          sequence: index,
          paramName: variable.name, // Dynamic name for header variables
          paramValue: variable.value, // Use value from headerVariable
          paramType: 1,
        })),
        ...variables.map((variable, index) => ({
          sequence: index,
          paramName: variable.name, // Dynamic name for header variables
          paramValue: variable.value, // Use value from headerVariable
          paramType: 2, // Static type
        })),
        ...senturlvariables.map((variable, index) => ({
          sequence: variable.sequence,
          paramName: variable.paramName, // Dynamic name for header variables
          paramValue: variable.urlvalue,
          paramType: 3, // Static type
        })),
      ],
    };
    setCampaignLoading(true);
    try {
      const response = await dispatch(createCampaign(requestBody)).unwrap();
      
      if (response.data.success) {
        dispatch(clearTemplateDetailState());
        showSweetAlert({
          title: "Created Successfully",
          text: "",
          icon: "success",
        });
        router.push("/Campaigns/CampaignsList");
        setCampaignLoading(false);
      } else {
        showSweetAlert({
          title: "Failed",
          text: response.message || "",
          icon: "error",
        });
        setCampaignLoading(false);
        //window.location.reload();
      }
    } catch (err) {
      console.error("Failed to create Campaign", err);
      showSweetAlert({
        title: "Failed",
        text: err.message || "",
        icon: "error",
      });
      //window.location.reload();
    }
  };

  useEffect(() => {
    let updatedBody = bodyFinalContent;

    // Replace variables in the body content

    // Handle newlines and preserve the flow
    updatedBody = updatedBody?.replace(/\n/g, "<br/>"); // Convert newlines to <br/> tags for HTML rendering

    // Replace <p> tags only if necessary, and ensure newlines are handled correctly
    updatedBody = updatedBody
      ?.replace(/<\/p>/gi, "<br/>")
      .replace(/<p.*?>/gi, "");

    // Update the message preview body content
    setMessagePreview((prev) => ({
      ...prev,
      body: updatedBody, // HTML safe body with <br/> tags and replaced variables
    }));
  }, [bodyFinalContent]);

  useEffect(() => {
    setMessagePreview((prev) => ({
      ...prev,
      header: headContent
        .replace(/\{{(\d+)\}}/g, (match, index) => headerVariable[index - 1])
        .replace(/\n/g, "<br />"),
    }));
  }, [headContent]);

  const handleVariableChange = (variableName, newValue) => {
    setVariables((prev) => {
      // Update the variable's value in the array
      const updatedVariables = prev.map((v) =>
        v.name === variableName ? { ...v, value: newValue } : v
      );

      // Calculate the updated body content using the new variables
      let updatedBody = bodyFinalContent;

      updatedVariables.forEach((variable) => {
        updatedBody = updatedBody.replace(
          variable.name,
          variable.value ? variable.value : variable.name
        );
      });

      // Handle newlines and preserve the flow
      updatedBody = updatedBody.replace(/\n/g, "<br/>"); // Convert newlines to <br/> tags for HTML rendering
      updatedBody = updatedBody
        .replace(/<\/p>/gi, "<br/>")
        .replace(/<p.*?>/gi, ""); // Remove <p> tags
      updatedBody = updatedBody?.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      ); // Bold formatting
      updatedBody = updatedBody.replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italic formatting
      updatedBody = updatedBody.replace(/~(.*?)~/g, "<sub>$1</sub>"); // Subscript formatting

      // Update the message preview state in real time
      setMessagePreview((prev) => ({
        ...prev,
        body: updatedBody, // Updated HTML content with variables replaced
      }));

      return updatedVariables; // Update the state
    });
  };

  const handleheaderVariableChange = (variableName, newValue) => {
    setHeaderVariable((prev) => {
      // Update the variable's value in the array
      const updatedVariables = prev.map((v) =>
        v.name === variableName ? { ...v, value: newValue } : v
      );

      // Calculate the updated body content using the new variables
      let updatedBody = headContent;

      // Replace all variables with their values in the updatedBody
      updatedVariables.forEach((variable) => {
        updatedBody = updatedBody.replace(
          variable.name,
          variable.value ? variable.value : variable.name
        );
      });

      // Update the message preview state in real-time
      setMessagePreview((prev) => ({
        ...prev,
        header: updatedBody, // Updated HTML content with variables replaced
      }));

      // Return the updated variables to set the new state
      return updatedVariables;
    });
  };

  const handleurlVariableChange = (index, value) => {
    setsenturlvariables((prevVariables) =>
      prevVariables.map((variable, i) =>
        i === index ? { ...variable, urlvalue: value } : variable
      )
    );
  };

  const handelCancel = () => {
    setCampaignLoading(true)
    router.push("/Campaigns/CampaignsList");
  };

  return (
    <App>
      {(CampaignLoading || loading) ? <Loader /> : null}


      <Container fluid className="mt-0">
        <Row style={{ height: "100vh" }}>
          <Col
            md={6}
            lg={7}
            className="campaign-leftsection overflow-auto "
            style={{ padding: "20px", background: "#fff" }}
          >
            <h4 className="mb-4">Create Campaign</h4>
            {/* <CustomEditor /> */}

            <Formik
              initialValues={{
                headerMedia: null,
                body: "",
                buttons: [],
                variables: [],
                headerVariable: [],
                bodyValues: [],
                buttonValues: [],
              }}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                const ToggleModal = () => {
                  setShowMediaPopup(false)
                }
                return (
                  <Form>
                    <div>
                      <Label for="campaignName">Campaign Name</Label>
                      <Input
                        type="text"
                        id="campaignName"
                        name="name"
                        value={campaignName}
                        onChange={(e) => setcampaignName(e.target.value)}
                        placeholder="Enter Name"
                        className="mb-3"
                        style={{ borderRadius: "8px" }}
                      />
                    </div>
                    <div>
                      <FormGroup>
                        <Label>Select Template</Label>
                        <Templates
                          name="senderId"
                          value={selectedTemplateId}
                          onChange={handleTemplateChange}
                          className="mb-3"
                          TransactionType={1}
                        />
                      </FormGroup>
                    </div>

                    <div>
                      <FormGroup>
                        <Label>Select Groups</Label>
                        <Groups
                          name="senderId"
                          onChange={handleGroupSelection}
                          className="mb-3"
                        />
                      </FormGroup>
                    </div>
                    {template && [2, 3, 4].includes(template.headerType) && (
                      <div className="mt-3 text-sm">
                        <button
                          type="button" // Explicitly prevent form submission
                          className="text-blue-500 hover:underline text-sm font-medium"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default browser behavior
                            setShowMediaPopup(true); // Show the media popup
                          }}
                        >
                          Change{" "}
                          {template.headerType === 2
                            ? "Image"
                            : template.headerType === 3
                            ? "Video"
                            : "Document"}
                        </button>

                        {showMediaPopup && (
                          <MediaPopUp
                            isPopup={true}
                            ToggleModal={ToggleModal}
                            senderId={selectedSenderId}
                            contentTypeStr={
                              template.headerType === 2
                                ? "image"
                                : template.headerType === 3
                                ? "video"
                                : "application"
                            }
                            onSelectMedia={(mediaId, mediaPath, mimeType) => {
                              setSelectedMediaId(mediaId);
                              setSelectedMediaPath(mediaPath);
                              setSelectedMediaType(mimeType);
                              setShowMediaPopup(false); // Close the popup after selection
                            }}
                          />
                        )}
                      </div>
                    )}

                    {headerVariable.length > 0 && <h5>Header Variables</h5>}
                    {headerVariable.map((variable, index) => (
                      <FormGroup key={index}>
                        <Label>{`Value for ${variable.name}`}</Label>
                        <Input
                          type="text"
                          value={variable.value}
                          onChange={(e) =>
                            handleheaderVariableChange(
                              variable.name,
                              e.target.value
                            )
                          }
                          placeholder={`Enter Sample Value for  ${variable.name}`}
                          style={{ borderRadius: "8px" }}
                          className="mb-3"
                        />
                      </FormGroup>
                    ))}
                    {variables.length > 0 && <h5>Body Variables</h5>}
                    {variables.map((variable, index) => (
                      <FormGroup key={index}>
                        <Label>{`Body Value for ${variable.name}`}</Label>
                        <Input
                          type="text"
                          value={variable.value}
                          onChange={(e) =>
                            handleVariableChange(variable.name, e.target.value)
                          }
                          placeholder={`Enter Sample Value for ${variable.name}`}
                          style={{ borderRadius: "8px" }}
                          className="mb-3"
                        />
                      </FormGroup>
                    ))}
                    {senturlvariables.length > 0 && <h5>URL Variables</h5>}
                    {senturlvariables.length > 0 &&
                      senturlvariables.map(
                        (variable, index) =>
                          variable.paramName !== null && (
                            <FormGroup key={variable.index}>
                              <Label>{`Url Value for ${variable.paramName}`}</Label>
                              <Row>
                                <Col>
                                  <Input
                                    className="w-90"
                                    type="text"
                                    value={variable.urlvalue || ""}
                                    onChange={(e) =>
                                      handleurlVariableChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Enter Sample value for {${variable.paramName}}`}
                                  />
                                </Col>
                              </Row>
                            </FormGroup>
                          )
                      )}

                    <div className="w-full flex justify-end gap-3"> 
                    <button
                    type="button"
                        className="Btn-Regular-1 mt-4"
                        onClick={handelCancel}
                      >
                        Cancel
                      </button>

                      <Button
                        className="uniform_btn mt-4"
                        onClick={() => handleSubmit(values)}
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Col>
          <Col md={6} lg={5} className="overflow-hidden h-screen  right-10">
            <div
              style={{
                position: "sticky",
                top: "0",
                zIndex: "10",
                backgroundColor: "white", // Ensure the background color covers the content behind it
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h4
                className="mb-1  p-3 "
                style={{ maxWidth: "100%", margin: "auto" }}
              >
                Template Preview
              </h4>
            </div>
            <div
              className="border "
              style={{
                
                maxHeight: "600px",
                overflow: "auto",
                backgroundColor: "#e0e0e0",
                backgroundImage: `url(${bagroundimage.src})`, // Update this path
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                maxWidth: "800px", // Increased width of preview container
                position: "relative", // Keep the container relative for positioning
              }}
            >
               {sendername && (
                  <div
                    className="flex items-center justify-between text-black px-2 shadow-md bg-white"
                    style={{
                      position: "sticky", // Make this section sticky
                      top: "0", // Stick it to the top
                      zIndex: "10", // Ensure it stays above other content
                      backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white for readability
                    }}
                  >
                    {/* Left Section: Display sender's image, name, and phone number */}
                    <div className="flex items-center space-x-3">
                      {/* Display Image */}
                      {sendername.mediaPath && (
                        <Image
                          src={`${BASE_URL}${sendername.mediaPath}`}
                          alt="Sender Logo"
                          className="rounded-circle me-2 img-fluid"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      {/* Display Name and Phone */}
                      <div className="p-1">
                        <div className=" ">{sendername.senderName}</div>
                        <div className="text-xs text-gray-600">
                          {sendername.phoneNumber}
                        </div>
                      </div>
                    </div>
                    {/* Right Section: Placeholder for future actions */}
                    <div className="flex items-center space-x-4">
                      {/* Add any buttons or actions here */}
                    </div>
                  </div>
                )}
              <div
                className="chat_bubble"
                style={{
                  position: "relative",
                    backgroundColor: "#ffff",
                    borderRadius: "5px",
                    padding: "20px 10px",
                    wordWrap: "break-word",
                    marginTop: "15px",
                    marginBottom: "10px",
                    marginRight: "0", // Remove any margin from the right side
                    marginLeft: "22px",
                    width: "60%",
                }}
              >
                <span className="time_bubble">
                  {moment(new Date()).format("LT")}
                </span>
                {messagePreview.media &&
                  selectedMediaType?.startsWith("image/") && (
                    <Image
                      src={`${BASE_URL}${selectedMediaPath}`}
                      alt="Media"
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "8px",
                        marginBottom: "5px",
                      }}
                    />
                  )}
                {messagePreview.media &&
                  selectedMediaType?.startsWith("video/") && (
                    <video
                      src={`${BASE_URL}${selectedMediaPath}`}
                      autoPlay
                      muted
                      loop
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  )}

                {messagePreview.media &&
                  selectedMediaType?.startsWith("audio/") && (
                    <audio
                      src={`${BASE_URL}${selectedMediaPath}`}
                      controls
                      controlsList="nodownload"
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                {messagePreview.header && (
                  <h6
                    style={{ marginBottom: "" }}
                    dangerouslySetInnerHTML={{ __html: messagePreview.header }}
                  />
                )}
                <div
                  dangerouslySetInnerHTML={{ __html: messagePreview.body }}
                />

                {messagePreview.footer && (
                  <p style={{ marginTop: "", fontSize: "0.9em" }}>
                    {messagePreview.footer}
                  </p>
                )}
                {(Showallbutton || TotalButtonCount <= 3) &&
                  messagePreview.buttons.map((button, index) => (
                    <Button
                      key={index}
                      className="w-100 mb-2"
                      style={{
                        color: "#00a9ee",
                        backgroundColor: "#ffffff",
                        borderColor: "#ffffff",
                        borderStyle: "solid",
                        borderWidth: "1px 1px 1px 1px",
                        borderTopWidth: "0.5px",
                        borderTopStyle: "solid",
                        borderTopColor: "#e1e1e1",
                      }}
                    >
                      {button.type == 1 && (
                        <span style={{ color: "#00a9ee" }}>
                          <i className="fa fa-share fa-flip-horizontal me-2"></i>
                          {button.text || "Button"}
                        </span>
                      )}
                      {button.type == 2 && (
                        <span style={{ color: "#00a9ee" }}>
                          <i className="fa fa-phone me-2"></i>
                          {button.text || "Button"}
                        </span>
                      )}
                      {button.type == 3 && (
                        <span style={{ color: "#00a9ee" }}>
                          <i className="fa fa-external-link me-2"></i>
                          {button.text || "Button"}
                        </span>
                      )}
                    </Button>
                  ))}
                {TotalButtonCount > 3 && !Showallbutton && (
                  <Button
                    className="w-100 mb-2"
                    style={{
                      color: "#00a9ee",
                      backgroundColor: "#ffffff",
                      borderColor: "#ffffff",
                      borderStyle: "solid",
                      borderWidth: "1px 1px 1px 1px",
                      borderTopWidth: "0.5px",
                      borderTopStyle: "solid",
                      borderTopColor: "#e1e1e1",
                    }}
                    onClick={() => setShowallbutton(!Showallbutton)}
                  >
                    <i className="fa fa-list"></i>
                    <span style={{ color: "#00a9ee" }}>See all options</span>
                  </Button>
                )}
                {TotalButtonCount > 3 && Showallbutton && (
                  <Button
                    className="w-100 mb-2"
                    style={{
                      color: "#00a9ee",
                      backgroundColor: "#ffffff",
                      borderColor: "#ffffff",
                      borderStyle: "solid",
                      borderWidth: "1px 1px 1px 1px",
                      borderTopWidth: "0.5px",
                      borderTopStyle: "solid",
                      borderTopColor: "#e1e1e1",
                    }}
                    onClick={() => setShowallbutton(false)}
                  >
                    <span style={{ color: "#00a9ee" }}>
                      <i className="fa fa-bars me-2"></i>
                      Hide All
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </App>
  );
};

export default CampaignCreate;
