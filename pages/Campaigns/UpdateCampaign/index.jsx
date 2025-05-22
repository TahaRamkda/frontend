import { useState, useEffect, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTemplatesById,
  clearTemplateDetailState,
} from "@/slices/TemplateSlice";
import { usePermissions } from "@/context/PermissionsContext";
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
import { fetchSendernameById, clearSendernameState } from "@/slices/sendernameSlice";
import MediaPopUp from "@/pages/Media/MediaPopUp";
import Loader from "@/components/Layout/Loader";
import bagroundimage from "@/public/images/baground.jpg";
import { BASE_URL } from "@/utils/apiConstants";
import { toast } from "react-toastify";

import {
  UpdateCampaign,
  clearCampaignUpdateState,
  fetchCampaignDetail,
  clearCampaignDetailState,
} from "@/slices/campaignSlice";
const CampaignUpdate = ({ campaignId , onclose}) => {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const dispatch = useDispatch();
  //const CampaignID = useRecoilValue(CampaignState);
  const [Loading, setLoading] = useState(false);
  const { template, loading, error } = useSelector((state) => state.templates);
  const formikRef = useRef(); // Add ref for Formik
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
  const [SelectedCampaign, setSelectedCampaign] = useState(0);
  const [TotalButtonCount, setTotalButtonCount] = useState(0);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [Showallbutton, setShowallbutton] = useState(false);
  
  const [selectedTemplateId, setSelectedTemplateId] = useState(0);
  const [existinggroupId, setexistinggroupId] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const [MessagePreviewupdated, setMessagePreviewupdated] = useState(false);
  const {
    campaigndetail,
    loading: campaignloading,
    error: campaignerror,
  } = useSelector((state) => state.campaigns);
  const handleGroupSelection = (groupIds) => {
    setSelectedGroups(groupIds);
    console.log("Selected Groups:", groupIds);
  };

  const handleTemplateChange = (e) => {
    
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
  };

  useEffect(() => {
    if (campaignId) {
      // Run only if a template is selected
      setSelectedCampaign(campaignId);
    } else {
      onclose();
    }
  }, [SelectedCampaign]);

  useEffect(() => {
    if (SelectedCampaign) {
      setLoading(true);
      dispatch(
        fetchCampaignDetail({
          CampaignId: SelectedCampaign,
        })
      ).then(() => {
        setLoading(false); // Set loading to false when data is fetched
      });
    }
  }, [dispatch, SelectedCampaign]);

  useEffect(() => {
    if (selectedTemplateId) {
      setLoading(true);
      dispatch(
        fetchTemplatesById({
          ClientId: localStorage.getItem("clientId"),
          templateId: selectedTemplateId,
        })
      ).then(() => {
        setLoading(false); // Set loading to false when data is fetched
      });
    }
  }, [dispatch, selectedTemplateId]);

  useEffect(() => {
    
    const initializeCampaignDetails = async () => {
      
      if (campaigndetail) {
        
        setSelectedTemplateId(campaigndetail.templateId);
        setcampaignName(campaigndetail.campaignName);
        setexistinggroupId(
          campaigndetail.groupIds?.replace(/['"]+/g, "").split(",").map(Number)
        );
        setSelectedMediaId(campaigndetail.mediaId);
        setSelectedMediaPath(campaigndetail.mediaURL);
        setSelectedMediaType(campaigndetail.contentType);

        if (campaigndetail.parameters) {
          ;
          // Update header and body variables
          campaigndetail.parameters.forEach((variable, i) => {
            const { paramType, paramName, paramValue, sequence } =
              variable || {};

            if (paramType === 1) {
              addHeaderVariable(paramName, null);
              handleheaderVariableChange(paramName, paramValue || "");
            } else if (paramType === 2) {
              addVariable(paramName, null);
              handleVariableChange(paramName, paramValue || "");
            }
          });

          // Handle dynamic button values
          const filteredButtonValues = campaigndetail.parameters.filter(
            (item) => item.paramType === 3 && item.paramValue !== null
          );

          setsenturlvariables(filteredButtonValues);
        }
      }
    };

    initializeCampaignDetails();
  }, [dispatch, campaigndetail]);

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
    
    if (loading || !template) return;
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
  } 

  // Update Body State
  setBodyFinalContent(template.bodyText);
  // Update Other Template-Related States
  //setSelectedSenderId(template.senderId);
  //setTemplatetype(template.category);
  //setlanguage(template.language);
  setTotalButtonCount(updatedMessagePreview.buttons.length);
  },[Loading, template]);

  
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

  //submit function to update campaign main request body creates here
const handleSubmit = async (values) => {
  setLoading(true);
  
  const requestBody = {
    clientId: template.clientId,
    campaignId: SelectedCampaign,
    campaignName: campaignName,
    senderId: template.senderId,
    templateId: selectedTemplateId,
    campaignType: "1",
    groupIds: selectedGroups.join(","),
    mediaId: selectedMediaId,
    actionBy: localStorage.getItem("userId"),
    campaignParameters: [
      ...headerVariable?.map((variable, index) => ({
        sequence: index,
        paramName: variable.name,
        paramValue: variable.value,
        paramType: 1,
      })),
      ...variables?.map((variable, index) => ({
        sequence: index,
        paramName: variable.name,
        paramValue: variable.value,
        paramType: 2,
      })),
      ...senturlvariables.map((variable, index) => ({
        sequence: variable.sequence,
        paramName: variable.paramName,
        paramValue: variable.urlvalue,
        paramType: 3,
      })),
    ],
  };

  try {
    const response = await dispatch(UpdateCampaign(requestBody)).unwrap();
    if (response) {
      dispatch(clearTemplateDetailState());
      showSweetAlert({
        title: "Updated Successfully",
        text: "",
        icon: "success",
      });
      onclose();
      setLoading(false); // Set loading to false on success
    } else {
      showSweetAlert({
        title: "Failed",
        text: response.message || "",
        icon: "error",
      });
      setLoading(false); // Set loading to false on failure
    }
  } catch (err) {
    console.error("Failed to create Template", err);
    showSweetAlert({
      title: "Failed",
      text: err.message || "",
      icon: "error",
    });
    setLoading(false); // Set loading to false on error
  }
};


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
  useEffect(() => {
    setSelectedTemplateId(0);
  }, [campaignId]);

  const handleheaderVariableChange = (variableName, newValue) => {
    setHeaderVariable((prev) => {
      // Update the variable's value in the array
      const updatedVariables = prev?.map((v) =>
        v.name === variableName ? { ...v, value: newValue } : v
      );

      // Calculate the updated body content using the new variables
      let updatedBody = headContent;

      // Replace all variables with their values in the updatedBody
      updatedVariables?.forEach((variable) => {
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

  const ToggleModal = () => {
    setShowMediaPopup(false)
  }

  const handelCancel = () => {
    // Clear Redux states
    dispatch(clearTemplateDetailState());
    dispatch(clearCampaignUpdateState());
    dispatch(clearCampaignDetailState());
    dispatch(clearSendernameState());
    // Navigate back
    onclose();
  };

  return (
    <>
      {(loading||campaignloading || Loading) && <Loader />}
      <Container fluid className="mt-0">
        <Row style={{ height: "100vh" }}>
          <Col
            md={6}
            lg={7}
            className="campaign-leftsection overflow-auto "
            style={{ padding: "20px", background: "#fff" }}
          >
            <h4 className="mb-4">Update Campaign</h4>
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
                          name="templateId"
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
                          existingdata={existinggroupId}
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
                            isPopup = {true}
                            ToggleModal={ToggleModal}
                            senderId={selectedSenderId}
                            contentTypeStr = {
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

                    {headerVariable?.length > 0 && <h5>Header Variables</h5>}
                    {headerVariable?.map((variable, index) => (
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
                    {variables?.length > 0 && <h5>Body Variables</h5>}
                    {variables?.map((variable, index) => (
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
                            <FormGroup key={index}>
                              <Label>{`Url Value for ${variable.paramName}`}</Label>
                              <Row>
                                <Col>
                                  <Input
                                    className="w-90"
                                    type="text"
                                    value={variable.paramValue || ""}
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
                      {hasPermission("Campaigns", "update") && (
                        <Button
                        className="uniform_btn mt-4 "
                        onClick={() => handleSubmit(values)}
                      >
                        Submit
                      </Button>
                      )}
                      
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
                overflowY: "scroll",
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
                        <img
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
                    <img
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
    </>
  );
};

export default CampaignUpdate;
