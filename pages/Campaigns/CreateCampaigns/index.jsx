import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
} from "reactstrap";
//import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";

import { FaTimes } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  fetchTemplatesById,
  clearTemplateDetailState,
} from "@/slices/TemplateSlice";
import {
  createCampaign,
  clearCampaignCreeateState,
} from "@/slices/CampaignSlice";
import showSweetAlert from "@/components/Sweetalert";
import Groups from "@/components/MultiSelect/GroupDropdown";
import Templates from "@/components/Dropdowns/TemplateDropdown";
import App from "@/components/App";
import moment from "moment";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import bagroundimage from "@/public/images/baground.jpg";
import { BASE_URL } from "@/utils/apiConstants";
import { toast } from "react-toastify";
const CampaignCreate = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(true);
  const { template, loading, error } = useSelector((state) => state.templates);

  const { loading: campaingCreating, error: campaignerror } = useSelector(
    (state) => state.templates
  );
  const [messagePreview, setMessagePreview] = useState({
    header: "",
    body: "",
    footer: "",
    media: null,
    buttons: [],
    visitWebsiteButtonCount: 0,
  });
  const [bodyContent, setBodyContent] = useState("");

  const [campaignName, setcampaignName] = useState("");
  const [variables, setVariables] = useState([]);
  const [urlvariables, seturlvariables] = useState([]);
  const [senturlvariables, setsenturlvariables] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [headContent, setHeadContent] = useState("");
  const [APIheadContent, setAPIheadContent] = useState("");
  const [headerVariable, setHeaderVariable] = useState([]);
  const [bodyFinalContent, setBodyFinalContent] = useState("");
  const [selectedMediaId, setSelectedMediaId] = useState("");
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [selectedMediaPath, setSelectedMediaPath] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [headerTextCount, setheaderTextCount] = useState(0);
  const [bodyTextCount, setbodyTextCount] = useState(0);
  const [APIbodyContent, setAPIbodyContent] = useState("");
  const [TotalButtonCount, setTotalButtonCount] = useState(0);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [Showallbutton, setShowallbutton] = useState(false);
  const [showaction, setshowaction] = useState(false);
  const [headerPayloadDatawithVar, setheaderPayloaddatawithVar] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [updatedvercontent, setupdatedvercontent] = useState("");

  const [selectedTemplateId, setSelectedTemplateId] = useState(0);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const replaceClosingPTagsWithNewline = (content) => {
    return content
      ?.replace(/<\/p>/gi, "\n ")
      .replace(/<p.*?>/gi, "")
      .replace(/\n /g, "\n  ");
  };

  const togglePopup = () => setshowaction(!showaction);

  console.log("!@#$%^&", bodyFinalContent);

  const handleGroupSelection = (groupIds) => {
    setSelectedGroups(groupIds);
    console.log("Selected Groups:", groupIds);
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
  };
  useEffect(() => {
    if (selectedTemplateId) {
      // Run only if a template is selected
      setLoading(true);
      dispatch(
        fetchTemplatesById({
          ClientId: localStorage.getItem("clientId"),
          templateId: selectedTemplateId,
        })
      );
    }
  }, [dispatch, selectedTemplateId]);

  useEffect(() => {
    if (!template) return;

    const updatedMessagePreview = {
      body: template.bodyText,
      footer: template.footerText,
      media: template.mediaURL,
      buttons: template.buttonValues ?? [],
      templatename: template.templateName,
      visitWebsiteButtonCount: 0,
    };

    // Update Header
    if (template.headerType === 1) {
      updatedMessagePreview.header = template.headerText;
      setHeadContent(template.headerText);
      setheaderPayloaddatawithVar(template.headerText);
      setheaderTextCount(template.headerParamCount);

      if (template.headerValue) {
        setHeaderVariable([template.headerValue]);

        if (template.headerValue?.defaultValue !== undefined) {
          handleheaderVariableChange(0, template.headerValue.defaultValue);
        }
      }
    } else {
      //alert(template.mediaURL);
      //alert(template.headerType);
      setSelectedMediaId(template.mediaId);
      setSelectedMediaPath(template.mediaURL);
      setSelectedMediaType(template.contentType);
    }

    // Update Body
    setupdatedvercontent(template.bodyText);
    setBodyFinalContent(template.bodyText);
    setbodyTextCount(template.bodyParamCount);

    if (template.bodyValues) {
      setVariables(template.bodyValues);
      template.bodyValues.forEach((variable, i) => {
        if (variable?.defaultValue !== undefined) {
          handleVariableChange(i, variable.defaultValue);
        }
      });
    }
    if (template.buttonValues.some((item) => item.value !== null)) {
      const filteredButtonValues = template.buttonValues.filter(
        (item) => item["isDynamic"] && item.value !== null
      );
      setsenturlvariables(filteredButtonValues);
      console.log("urlvariables", filteredButtonValues);
    }

    setSelectedSenderId(template.senderId);
    // Update Buttons
    setTotalButtonCount(updatedMessagePreview.buttons.length);

    // Apply Message Preview Updates
    setMessagePreview(updatedMessagePreview);

    // Finalize Template Update
    setLoading(false);

    // Clear State
    clearTemplateDetailState();
  }, [template]);

  useEffect(() => {
    setAPIheadContent(replaceClosingPTagsWithNewline(headContent));
  }, [headContent]); // Trigger only when headContent changes

  useEffect(() => {
    setAPIbodyContent(replaceClosingPTagsWithNewline(bodyFinalContent));
  }, [bodyFinalContent]);

  const handleSubmit = async (values) => {
    if (!campaignName) {
      toast.error("Please select a campaign before proceeding");
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
    let trimmedBodyContent = APIbodyContent.trimEnd();

    const requestBody = {
      templateId: selectedTemplateId,
      clientId: localStorage.getItem("clientId"),
      campaignName: campaignName,
      campaignType: "1",
      status: "0",
      senderId: template.senderId,
      groupIds: selectedGroups.join(","),
      actionBy: localStorage.getItem("userId"),

      campaignParameters: [
        ...headerVariable.map((value, index) => ({
          sequence: index + 1,
          paramName: `${index + 1}`, // Dynamic name for header variables
          paramText: value,
          paramType: 1,
          paramDefaultValue: value,
          isDynamic: true,
          status: 0,
        })),
        ...variables.map((value, index) => ({
          sequence: index + 1,
          paramName: `${index + 1}`, // Dynamic name for header variables
          paramText: value, // Use value from headerVariable
          paramType: 2, // Static type
          paramDefaultValue: value, // Default value same as value
          isDynamic: true, // Static boolean
          status: 0, // Static status
        })),
        ...senturlvariables.map((value, index) => ({
          sequence: value.values.index,
          paramName: `${index + 1}`, // Dynamic name for header variables
          paramText: value.values.value, // Use value from headerVariable
          paramType: 3, // Static type
          paramDefaultValue: value.values.value, // Default value same as value
          isDynamic: true, // Static boolean
          status: 0, // Static status
        })),
      ],
    };

    try {
      const response = await dispatch(createCampaign(requestBody)).unwrap();
      if (response.success) {
        clearCampaignCreeateState();
        showSweetAlert({
          title: "Created Successfully",
          text: "",
          icon: "success",
        });
        await router.push("/Campaigns/CampaignsList");
      } else {
        showSweetAlert({
          title: "Failed",
          text: response.message || "",
          icon: "error",
        });

        //window.location.reload();
      }
    } catch (err) {
      console.error("Failed to create Template", err);
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
    variables.forEach((variable, index) => {
      updatedBody = updatedBody?.replace(`{{${index + 1}}}`, variable);
    });

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
  }, [bodyFinalContent, variables]);

  useEffect(() => {
    setMessagePreview((prev) => ({
      ...prev,
      header: headContent
        .replace(/\{{(\d+)\}}/g, (match, index) => headerVariable[index - 1])
        .replace(/\n/g, "<br />"),
    }));
  }, [headContent, headerVariable]);
  const handleVariableChange = (index, value) => {
    setVariables((prev) => {
      const newVariables = [...prev];
      newVariables[index] = value;
      return newVariables;
    });
  };
  const handelCancel = () => {
    router.push("/Campaigns/CampaignsList");
  };

  const handleBodyChange = (value) => {
    // Allow typing without interruptions
    setBodyContent(value);

    // Clear previous validation timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Validate placeholders with debounce
    const timeout = setTimeout(() => {
      validatePlaceholders(value);
    }, 500); // Delay for smoother typing experience

    setTypingTimeout(timeout);
  };

  const handleheaderVariableChange = (index, value) => {
    setHeaderVariable((prev) => {
      const newHeaderVariable = [...prev];
      newHeaderVariable[index] = value;
      return newHeaderVariable;
    });
  };

  const handleurlVariableChange = (index, value) => {
    setsenturlvariables((prev) => {
      const newurlVariable = [...prev];
      // Create a new object for the `values` property
      const updatedButton = {
        ...newurlVariable[index],
        values: { ...newurlVariable[index].values, value }, // Create a new `values` object
      };
      newurlVariable[index] = updatedButton; // Replace the button at index with the updated button
      return newurlVariable;
    });
  };

  const handleSenderChange = (e) => {
    const role = e.target.value;
    setSelectedSenderId(role);
  };

  useEffect(() => {
    let updatedBody = bodyFinalContent;
    variables.forEach((variable, index) => {
      updatedBody = updatedBody.replace(`{{${index + 1}}}`, variable);
    });
    updatedBody = updatedBody.replace(/\n/g, "<br/>"); // Convert newlines to <br/> tags for HTML rendering

    // Replace <p> tags only if necessary, and ensure newlines are handled correctly
    updatedBody = updatedBody
      .replace(/<\/p>/gi, "<br/>")
      .replace(/<p.*?>/gi, "");
    updatedBody = updatedBody.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    updatedBody = updatedBody.replace(/\*(.*?)\*/g, "<em>$1</em>");

    updatedBody = updatedBody.replace(/~(.*?)~/g, "<sub>$1</sub>");

    // Update the message preview body content
    setMessagePreview((prev) => ({
      ...prev,
      body: updatedBody, // HTML safe body with <br/> tags and replaced variables
    }));
  }, [bodyFinalContent, variables]);

  return (
    <App>
      {loading && <Loader />}
      <Container fluid className="mt-0">
        <Row style={{ height: "100vh" }}>
          <Col
            md={7}
            className="border-end overflow-auto shadow-lg"
            style={{ padding: "20px", background: "#fff" }}
          >
            <h4 className="mb-4">Create Campaign</h4>
            {/* <CustomEditor /> */}

            <Formik
              initialValues={{
                // headerType: template.headerType,
                // headerContent:template.headerText,
                headerMedia: null,
                body: "",
                //footer: template.footerText,
                //senderId: template.senderId,
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
                    {headerVariable.length > 0 && <h5>Header Variables</h5>}
                    {headerVariable.map((variable, index) => (
                      <FormGroup key={index}>
                        <Label>{`Value for {${index + 1}}`}</Label>
                        <Input
                          type="text"
                          value={variable.defaultValue}
                          onChange={(e) =>
                            handleheaderVariableChange(index, e.target.value)
                          }
                          placeholder={`Enter Sample Value for {${index + 1}}`}
                          style={{ borderRadius: "8px" }}
                          className="mb-3"
                        />
                      </FormGroup>
                    ))}
                    {variables.length > 0 && <h5>Body Variables</h5>}
                    {variables.map((variable, index) => (
                      <FormGroup key={index}>
                        <Label>{`Body Value for {${index + 1}}`}</Label>
                        <Input
                          type="text"
                          value={variable}
                          onChange={(e) =>
                            handleVariableChange(index, e.target.value)
                          }
                          placeholder={`Enter Sample Value for {${index + 1}}`}
                          style={{ borderRadius: "8px" }}
                          className="mb-3"
                        />
                      </FormGroup>
                    ))}
                    {senturlvariables.length > 0 && <h5>URL Variables</h5>}
                    {senturlvariables.length > 0 &&
                      senturlvariables.map(
                        (variable, index) =>
                          variable.values !== null && (
                            <FormGroup key={variable.index}>
                              <Label>{`Url Value for {${index + 1}}`}</Label>
                              <Row>
                                <Col>
                                  <Input
                                    className="w-90"
                                    type="text"
                                    value={variable.values.value || ""}
                                    onChange={(e) =>
                                      handleurlVariableChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Enter Sample value for {${
                                      index + 1
                                    }}`}
                                  />
                                </Col>
                              </Row>
                            </FormGroup>
                          )
                      )}

                    <div className="w-full flex justify-end gap-3">
                      <Button
                        className="uniform_btn_Cancel "
                        onClick={handelCancel}
                      >
                        Cancel
                      </Button>

                      <Button
                        className="uniform_btn "
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
          <Col
            md={4}
            className="overflow-hidden h-screen fixed right-10"
            // style={{
            //   position: "fixed", // Fix the position
            //   top: "-50", // Adjust to your layout
            //   right: "0", // Align to the right side of the screen
            //   height: "100vh", // Full viewport height to ensure scrollability
            //   overflowY: "auto", // Enable vertical scrolling
            //   backgroundColor: "#f8f9fa", // Optional: background color for contrast
            //   boxShadow: "0 0 10px rgba(0,0,0,0.1)", // Optional: Add shadow for emphasis
            // }}
          >
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
                className="mb-1 bg-light p-3 shadow-sm"
                style={{ maxWidth: "600px", margin: "auto" }}
              >
                Template Preview
              </h4>
            </div>
            <div
              className="border p-3 rounded"
              style={{
                height: "auto",
                minHeight: "420px",
                backgroundColor: "#e0e0e0",
                backgroundImage: `url(${bagroundimage.src})`, // Update this path
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                maxWidth: "600px", // Increased width of preview container
                margin: "0 auto",
                padding: "5px", // Optional: Adjust padding for more space inside the preview container
              }}
            >
              <div
                className="chat_bubble"
                style={{
                  position: "relative",
                  backgroundColor: "#ffff",
                  borderRadius: "5px",
                  padding: "20px 10px",
                  wordWrap: "break-word",
                  marginBottom: "10px",
                  maxWidth: "400px", // Message body width stays the same
                  marginRight: "0", // Remove any margin from the right side
                }}
              >
                <span className="time_bubble">
                  {moment(new Date()).format("LT")}
                </span>
                {messagePreview.media &&
                  selectedMediaType.startsWith("image/") && (
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
                  selectedMediaType.startsWith("video/") && (
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
                  selectedMediaType.startsWith("audio/") && (
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
