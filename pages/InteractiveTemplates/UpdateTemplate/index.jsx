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
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  createTemplates,
  clearTemplateCreateState,
} from "@/slices/TemplateSlice";
import {
  updateInteractiveTemplates,
  fetchInteractiveTemplatesById,
  clearInteractiveTemplateDetailState,
} from "@/slices/InteractiveTemplateSlice";
import showSweetAlert from "@/components/Sweetalert";
import defaultimage from "@/public/images/12.jpg";
import bagroundimage from "@/public/images/baground.jpg";
import Media from "@/pages/Media/MediaList";
import Sendernames from "@/components/Dropdowns/SendernameDropdown";
import App from "@/components/Layout/App";
import ButtonAction from "@/pages/Templates/ButtonAction";
import moment from "moment";
import CustomMagicEditor from "@/components/CustomMagicEditor";
import { BASE_URL } from "@/utils/apiConstants";
import Loader from "@/components/Layout/Loader";
import { useRecoilValue } from "recoil";
import { TemplateState } from "@/components/recoil";
import MonitorFormikContext from "@/components/monitorformikcontext";
import TemplateCategoryDropdown from "@/components/Dropdowns/TemplateCategorydropdown";
import LanguageDropdown from "@/components/Dropdowns/LanguageDropdown";
import { set } from "date-fns";
const CustomEditor = dynamic(
  () => import("../../../components/CustomEditor/CustomEditor"),
  { ssr: false }
);
const InteractiveTemplateUpdate = () => {
  const Template_Id = useRecoilValue(TemplateState);
  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
  const router = useRouter();
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(true);
  const [actionbuttonvalues, setactionbuttonvalues] = useState([]);
  const { interactivetemplatedetail, loading, error } = useSelector(
    (state) => state.interactiveTemplates
  );
  const stripHtml = (input) => input.replace(/<[^>]*>/g, "");
  const [messagePreview, setMessagePreview] = useState({
    header: "",
    body: "",
    footer: "",
    media: null,
    buttons: [],
    visitWebsiteButtonCount: 0,
  });
  const [bodyContent, setBodyContent] = useState("");
  const [variables, setVariables] = useState([]);
  const [urlvariables, seturlvariables] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonType, setButtonType] = useState(null);
  const [buttonText, setButtonText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("US +1");
  const [showMediaPopup, setShowMediaPopup] = useState(false);
  const [websiteUrl, setwebsiteUrl] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [marketingOptOutAdded, setMarketingOptOutAdded] = useState(false);
  const [callPhoneNumberButtonCount, setCallPhoneNumberButtonCount] =
    useState(0);
  const [visitWebsiteButtonCount, setVisitWebsiteButtonCount] = useState(0);
  const [headContent, setHeadContent] = useState("");
  const [APIheadContent, setAPIheadContent] = useState("");
  const [headPreContent, setheadPreContent] = useState("");
  const [headerVariable, setHeaderVariable] = useState([]);
  const [finalContent, setFinalContent] = useState("");
  const [bodyFinalContent, setBodyFinalContent] = useState("");
  const [selectedMediaId, setSelectedMediaId] = useState(0);
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [selectedMediaPath, setSelectedMediaPath] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [headerTextCount, setheaderTextCount] = useState(0);
  const [bodyTextCount, setbodyTextCount] = useState(0);
  const [APIbodyContent, setAPIbodyContent] = useState("");
  const [TotalButtonCount, setTotalButtonCount] = useState(0);
  const [Showallbutton, setShowallbutton] = useState(false);
  const [showaction, setshowaction] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [buttonindex, setbuttonindex] = useState(0);
  const [headerPayloadDatawithVar, setheaderPayloaddatawithVar] = useState("");
  const [bodyPayloadDatawithVar, setBodyPayloadDatawithVar] = useState("");
  const [removeHeaderButtonEnabled, setRemoveHeaderButtonEnabled] =
    useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [updatedvercontent, setupdatedvercontent] = useState("");
  const [updatedheadvercontent, setupdatedheadvercontent] = useState("");
  const [Templatetype, setTemplatetype] = useState("");
  const [language, setlanguage] = useState("");
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const replaceClosingPTagsWithNewline = (content) => {
    return content
      ?.replace(/<\/p>/gi, "\n ")
      .replace(/<p.*?>/gi, "")
      .replace(/\n /g, "\n  ");
  };

  const togglePopup = () => setshowaction(!showaction);

  console.log("!@#$%^&", bodyFinalContent);

  useEffect(() => {
    if (Template_Id) {
      setLoading(true);
      dispatch(
        fetchInteractiveTemplatesById({
          ClientId: localStorage.getItem("clientId"),
          templateId: Template_Id,
        })
      )
        .then((response) => {
          setTemplate(response); // Assuming response is the interactivetemplatedetail object
        })
        .catch((error) => {
          console.error("Error fetching interactivetemplatedetail:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    else{
      router.back()
    }
  }, [dispatch, Template_Id]);
  

  // Handle interactivetemplatedetail updates once it has been fetched (Second useEffect)
  useEffect(() => {
    if (Loading || !interactivetemplatedetail) return; // Wait for the data to be loaded

    const updatedMessagePreview = {
      body: interactivetemplatedetail.bodyText,
      footer: interactivetemplatedetail.footerText,
      media: interactivetemplatedetail.mediaPath,
      buttons: interactivetemplatedetail.buttons ?? [],
      templatename: interactivetemplatedetail.templateName,
      visitWebsiteButtonCount: 0,
    };

    // Update Header
    if (interactivetemplatedetail.headerType === 1) {
      updatedMessagePreview.header = interactivetemplatedetail.headerText;
      setHeadContent(interactivetemplatedetail.headerText);
      setupdatedheadvercontent(interactivetemplatedetail.headerText);
      setheaderTextCount(interactivetemplatedetail.headerParamCount);

      if (interactivetemplatedetail.headerValue) {
        setHeaderVariable([interactivetemplatedetail.headerValue]);
        interactivetemplatedetail.headerValue.forEach((variable, i) => {
          if (variable?.defaultValue !== undefined) {
            handleheaderVariableChange(i, variable.defaultValue);
          }
        });
      }
    } else {
      setSelectedMediaId(interactivetemplatedetail.mediaId);
      setSelectedMediaPath(interactivetemplatedetail.mediaPath);
      setSelectedMediaType(interactivetemplatedetail.contentType);
    }

    // Update Body
    setupdatedvercontent(interactivetemplatedetail.bodyText);
    setbodyTextCount(interactivetemplatedetail.bodyParamCount);

    if (interactivetemplatedetail.bodyValues) {
      setVariables(interactivetemplatedetail.bodyValues);
      interactivetemplatedetail.bodyValues.forEach((variable, i) => {
        if (variable?.defaultValue !== undefined) {
          handleVariableChange(i, variable.defaultValue);
        }
      });
    }
    if (interactivetemplatedetail.buttonsJson) {
      const updatedButtons = [...updatedMessagePreview.buttons];
      updatedButtons.websiteUrl = interactivetemplatedetail.buttons.url;
      updatedButtons.urlveriable = interactivetemplatedetail.buttons;
      updatedButtons.urlveriablevalue = interactivetemplatedetail.buttons;
      updatedButtons.urlverindex = interactivetemplatedetail.buttons;
      setMessagePreview({ ...messagePreview, buttons: updatedButtons });
    }
    setSelectedSenderId(interactivetemplatedetail.senderId);
    setTemplatetype(interactivetemplatedetail.category);
    setlanguage(interactivetemplatedetail.language);
    setTotalButtonCount(updatedMessagePreview.buttons.length);

    setMessagePreview(updatedMessagePreview);

    // Clear Template Detail State
    clearInteractiveTemplateDetailState();
  }, [Loading, interactivetemplatedetail]);

  useEffect(() => {
    setAPIheadContent(replaceClosingPTagsWithNewline(headContent));
  }, [headContent]); // Trigger only when headContent changes

  useEffect(() => {
    setAPIbodyContent(replaceClosingPTagsWithNewline(bodyFinalContent));
  }, [bodyFinalContent]);

  const handleSaveActionData = (data, index) => {
    setMessagePreview((prev) => {
      const updatedButtons = [...prev.buttons];
      updatedButtons[index] = {
        ...updatedButtons[index],
        ...data, // Update the button with the new data
      };

      return {
        ...prev,
        buttons: updatedButtons,
      };
    });
  };
  const handelCancel = () => {
    router.push("/InteractiveTemplates/InteractiveList");
  };
  const handleSubmit = async (values) => {
    // let trimmedBodyContent = APIbodyContent.replace(/\*\*/g, "*").trimEnd();
    // let APIbodyContent = "**Latest**<sub>Text</sub>*Example*   "; // Example content

    // Replace ** with *, * with _, and <sub>/<sub> with ~
    let trimmedBodyContent = APIbodyContent;

    //Replacing the words
    const result = headerPayloadDatawithVar.replace(/\*\*/g, "+");
    const subresult = result.replace(/\*/g, "`");
    const supresult = subresult.replace(/<sub>.*?<\/sub>/g, "~");
    const replaceX = supresult.replace(/`/g, "_");
    const finalHeaderReplace = replaceX.replace(/\+/g, "*");

    const bodyresult = bodyPayloadDatawithVar.replace(/\*\*/g, "+");
    const bodysubresult = bodyresult.replace(/\*/g, "`");
    const bodysupresult = bodysubresult.replace(/<sub>.*?<\/sub>/g, "~");
    const bodyreplaceX = bodysupresult.replace(/`/g, "_");
    const bodyfinalReplace = bodyreplaceX.replace(/\+/g, "*");

    const requestBody = {
      Id: Template_Id,
      clientId: localStorage.getItem("clientId"),
      senderNameId: selectedSenderId,
      name: values.templateName,
      language: language,
      usedByAgent: interactivetemplatedetail.usedByAgent,
      mediaId: selectedMediaId,
      status: "1",
      defaultTypeId: interactivetemplatedetail.defaultTypeId,
      actionBy: localStorage.getItem("userId"),
      header: {
        format: values.headerType,
        text: finalHeaderReplace,
      },
      body: {
        text: bodyfinalReplace,
      },
      footer: {
        text: messagePreview.footer,
      },
      buttons: messagePreview.buttons.map((button, index) => ({
        buttonType: button.buttonType,
        buttonText: button.buttonText,
        actionId: button.actionId,
        actionType: button.actionType,
        index: index,
        buttonValue: button.buttonValue,
      })),
    };

    //console.log("TimingData", requestBody)

    try {
      const response = await dispatch(
        updateInteractiveTemplates(requestBody)
      ).unwrap();
      if (response.success) {
        clearInteractiveTemplateDetailState();
        showSweetAlert({
          title: "Updated Successfully",
          text: "",
          icon: "success",
        });
        router.push("/InteractiveTemplates/InteractiveList");
      } else {
        showSweetAlert({
          title: "Failed",
          text: response.message || "",
          icon: "error",
        });

        //window.location.reload();
      }
    } catch (err) {
      console.error("Failed to update Template", err);
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

 
  const handleVariableChange = (index, value) => {
    setVariables((prev) => {
      const newVariables = [...prev];
      newVariables[index] = value;
      return newVariables;
    });
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

  const validatePlaceholders = (value) => {
    const placeholders = variables.map((_, index) => `{{${index + 1}}}`);
    const isValid = placeholders.every((placeholder) =>
      value.includes(placeholder)
    );

    if (!isValid) {
      setErrorMessage(
        "You cannot change the variable placeholders in the body."
      );
    } else {
      setErrorMessage("");
    }
  };

  useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const handleHeadChange = (value) => {
    const placeholders = headerVariable.map((_, index) => `{{${index + 1}}}`);
    const isValid = placeholders.every((placeholder) =>
      value.includes(placeholder)
    );

    if (isValid) {
      setHeadContent(value.replace(/\s\s+/g, " "));
      setErrorMessage("");
    } else {
      setErrorMessage(
        "You cannot change the variable placeholders in the header."
      );
    }
  };

  const handleheaderVariableChange = (index, value) => {
    setHeaderVariable((prev) => {
      const newHeaderVariable = [...prev];
      newHeaderVariable[index] = value;
      return newHeaderVariable;
    });
  };

  const handleurlVariableChange = (index, value) => {
    const updatedButtons = [...messagePreview.buttons];
    updatedButtons[index].urlveriablevalue = value; // Update the variable value
    setMessagePreview({ ...messagePreview, buttons: updatedButtons });
  };

  const handleButtonSelect = (type) => {
    if (type === "2" && callPhoneNumberButtonCount >= 1) {
      toast.error("You can only add one call phone number button.");
      setButtonType(null);
    } else if (
      type === "3" &&
      messagePreview.buttons.filter((button) => button.type === "3").length >= 2
    ) {
      toast.error("You can only add two visit website buttons.");
      setButtonType(null);
      setButtonText("");
      setwebsiteUrl("");
    } else {
      setButtonType(type);
      setButtonText("");
      setPhoneNumber("");
      setCountryCode("+965");
      setwebsiteUrl("");
      setActionId(0);
      setActionType(0);
      if (type === "1") {
        setButtonText(" ");
        setMarketingOptOutAdded(true);
        setTotalButtonCount((prev) => prev + 1);
      } else if (type === "2") {
        setButtonText("Call Phone Number");
        setCallPhoneNumberButtonCount((prev) => prev + 1);
        setTotalButtonCount((prev) => prev + 1);
      } else if (type === "3") {
        setButtonText("Visit Website");
        setVisitWebsiteButtonCount(
          messagePreview.buttons.filter((button) => button.type === "3")
            .length + 1
        );
        setTotalButtonCount((prev) => prev + 1);
      } else {
        setButtonText("");
      }
    }
  };

  useEffect(() => {
    if (buttonType) {
      const newButton = {
        buttonType: buttonType,
        buttonText: buttonText,
        phoneNumber: buttonType === "2" ? phoneNumber : "",
        countryCode: buttonType === "2" ? countryCode : "",
        websiteUrl: buttonType === "3" ? websiteUrl : null,
      };

      setMessagePreview((prev) => {
        const buttons = [...prev.buttons];

        if (newButton.type === "1") {
          // Find the index of the last type `1` button
          const lastType1Index = buttons.reduce(
            (lastIndex, button, index) =>
              button.type === "1" ? index : lastIndex,
            -1
          );

          // Insert the new type `1` button right after the last type `1` button
          buttons.splice(lastType1Index + 1, 0, newButton);
        } else {
          // Add type `2` or `3` buttons at the end
          buttons.push(newButton);
        }

        return { ...prev, buttons };
      });

      // Reset button details
      setButtonType(null);
      setButtonText("");
      setPhoneNumber("");
      setCountryCode("+965");
      setwebsiteUrl("");
    }
  }, [buttonType, buttonText]);

  const removeButtonFromPreview = (index) => {
    var totalcount = TotalButtonCount;
    setTotalButtonCount(totalcount - 1);
    setMessagePreview((prev) => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index),
    }));

    if (messagePreview.buttons[index].type === "2") {
      setCallPhoneNumberButtonCount(callPhoneNumberButtonCount - 1);
    }
  };

  const handleSenderChange = (e) => {
    const role = e.target.value;
    setSelectedSenderId(role);
  };

  const handlebuttonaction = (index, actionId, actionType , buttonValue) => {
    
    setbuttonindex(index);
    const buttonaction = {
      actionId: actionId,
      actionType: actionType,
      buttonValue:buttonValue
    };
    setactionbuttonvalues(buttonaction);
    setshowaction(true);
  };

  useEffect(() => {
    if (finalContent) {
      console.log("MineFinalContent", finalContent);
      let formattedContent = finalContent?.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      );
      formattedContent = formattedContent.replace(/\*(.*?)\*/g, "<em>$1</em>");
      formattedContent = formattedContent.replace(/~(.*?)~/g, "<sub>$1</sub>");
      setMessagePreview((prev) => ({
        ...prev,
        header: formattedContent,
      }));
    }
  }, [finalContent]);
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
    updatedBody = updatedBody
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // for **bold** text
      .replace(/_(.*?)_/g, "<strong>$1</strong>"); // for _bold_ text

    updatedBody = updatedBody.replace(/\*(.*?)\*/g, "<em>$1</em>");

    updatedBody = updatedBody.replace(/~(.*?)~/g, "<sub>$1</sub>");

    // Update the message preview body content
    setMessagePreview((prev) => ({
      ...prev,
      body: updatedBody, // HTML safe body with <br/> tags and replaced variables
    }));
  }, [bodyFinalContent, variables]);

  console.log("BodyFinalContent12", bodyContent, finalContent);
  if (Loading)
    return (
      <App>
        <Loader />
      </App>
    );
  return (
    <App>
      <Container fluid className="mt-0">
        <Row style={{ height: "100vh" }}>
          <Col
            md={7}
            className="border-end overflow-auto shadow-lg"
            style={{ padding: "20px", background: "#fff" }}
          >
            <h4 className="mb-4">Update Template</h4>
            {/* <CustomEditor /> */}
            <label className="block mb-1 mt-1">Sender Names</label>
            <Sendernames
              name="senderId"
              value={selectedSenderId}
              disabled={true}
            />

            <label className="block mb-1 mt-1">Language</label>
            <LanguageDropdown
              name="language"
              value={language}
              disabled={true}
            />
            <Formik
              initialValues={{
                templateName: interactivetemplatedetail.templateName,
                headerType: interactivetemplatedetail.headerType,
                headerContent: interactivetemplatedetail.headerText,
                headerMedia: null,
                body: "",
                footer: interactivetemplatedetail.footerText,
                senderId: interactivetemplatedetail.senderId,
                buttons: [],
                variables: [],
                headerVariable: [],
                bodyValues: [],
                buttonValues: [],
                usedByAgent: interactivetemplatedetail.usedByAgent,
              }}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                return (
                  <Form>
                    <div
                      style={{ background: "#fff" }}
                      className=""
                    >
                      <FormGroup>
                        <Label
                          for="templateName"
                          className="font-semibold text-sm mb-0"
                        >
                          Template Name
                        </Label>
                        <Field
                          as={Input}
                          type="text"
                          name="templateName"
                          id="templateName"
                          value={values.templateName} // Ensure it syncs with Formik's state
                          readOnly // Prevent direct editing
                          onClick={(e) => {
                            // Allow user interactions like selecting or focusing the input
                            e.preventDefault();
                          }}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\s+/g, "_")
                              .replace(/[^a-zA-Z0-9_]/g, "")
                              .toLowerCase();
                            setFieldValue("templateName", value); // Update Formik's state
                          }}
                        />
                      </FormGroup>
                    </div>
                    <div className="mt-3">
                      <FormGroup className="d-flex align-items-center">
                        <Field name="usedByAgent">
                          {({ field, form }) => (
                            <Input
                              type="checkbox"
                              id="usedByAgent"
                              checked={field.value} // Ensure boolean value
                              onChange={(e) =>
                                form.setFieldValue(
                                  "usedByAgent",
                                  e.target.checked
                                )
                              }
                              className="me-2"
                            />
                          )}
                        </Field>
                        <Label
                          for="usedByAgent"
                          className="mb-0 text-sm font-semibold"
                        >
                          Used by agent?
                        </Label>
                      </FormGroup>
                    </div>
                    <div
                      style={{ background: "#fff" }}
                      className=""
                    >
                      <FormGroup>
                        <Label
                          for="headerType"
                          className="font-semibold text-sm mb-0"
                        >
                          Header Type
                        </Label>
                        <Field
                          as={Input}
                          type="select"
                          name="headerType"
                          className="form-control"
                          style={{ height: "46px" }}
                        >
                          {["none", "text", "image", "video", "document"].map(
                            (type, index) => (
                              <option
                                key={type}
                                value={index === 0 ? 0 : index}
                              >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </option>
                            )
                          )}
                        </Field>
                      </FormGroup>
                      <div>
                        {(values.headerType === 1 ||
                          values.headerType === "1") && (
                          <FormGroup>
                            <Label
                              for="headerContent"
                              className="font-semibold text-sm mb-0"
                            >
                              Header Content
                            </Label>
                            <CustomMagicEditor
                              errorMessage={errorMessage}
                              setheaderPayloaddatawithVar={
                                setheaderPayloaddatawithVar
                              }
                              headContent={headContent}
                              setFinalContent={setFinalContent}
                              body={false}
                              existingContent={updatedheadvercontent}
                              showaddvarbutton={false}
                            />
                          </FormGroup>
                        )}
                        {/* {console.log("Value Mania", ["2", "3", "4"].includes(values.headerType))} */}
                        {["2", "3", "4"].includes(values.headerType) && (
                          <>
                          <div>
                            <Media
                              key={values.headerType} // This forces re-rendering when headerType changes
                              isPopup={["2", "3", "4"].includes(
                                values.headerType
                              )}
                              contentTypeStr={
                                values.headerType === "2"
                                  ? "image"
                                  : values.headerType === "3"
                                  ? "video"
                                  : "application"
                              }
                              onSelectMedia={(mediaId, mediaPath, mimeType) => {
                                setSelectedMediaId(mediaId);
                                setSelectedMediaPath(mediaPath);
                                setSelectedMediaType(mimeType);
                              }}
                            />
                             <div className="mt-3 text-sm">
  <button
    type="button" // Explicitly prevent form submission
    className="text-blue-500 hover:underline text-sm font-medium"
    onClick={(e) => {
      e.preventDefault(); // Prevent default browser behavior
      setShowMediaPopup(true); // Show the media popup
    }}
  >
    Change {values.headerType === "2" ? "Image" : values.headerType === "3" ? "Video" : "Document"}
  </button>

  {showMediaPopup && (
    <Media
      isPopup={true}
      contentTypeStr={
        values.headerType === "2"
          ? "image"
          : values.headerType === "3"
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
</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="">
                      <FormGroup>
                        <Label for="body" className="text-sm font-semibold">
                          Body
                        </Label>
                        <div style={{ position: "relative" }}>
                          <CustomMagicEditor
                            errorMessage={errorMessage}
                            setBodyPayloadDatawithVar={
                              setBodyPayloadDatawithVar
                            }
                            setBodyFinalContent={setBodyFinalContent}
                            handleBodyChange={handleBodyChange}
                            body={true}
                            existingBodyContent={updatedvercontent}
                            showaddvarbutton={false}
                          />
                        </div>
                        {errorMessage && (
                          <Alert color="danger" className="mt-2">
                            {errorMessage}
                          </Alert>
                        )}
                      </FormGroup>
                    </div>

                    <div className="">
                      <FormGroup>
                        <Label for="footer" className="text-sm font-semibold">
                          Footer
                        </Label>
                        <Field
                          as={Input}
                          name="footer"
                          placeholder="Add footer text"
                          className="form-control"
                          maxLength="50"
                        />
                      </FormGroup>
                      {/* Button dropdown */}
                      <Dropdown
                        isOpen={dropdownOpen}
                        toggle={toggleDropdown}
                        className="mt-3"
                      >
                        <div className="flex justify-end">
                          <DropdownToggle
                            caret
                            color="gray"
                            className=" border-1"
                          >
                            + Add button
                          </DropdownToggle>
                        </div>
                        <DropdownMenu>
                          <DropdownItem header className="fw-bold">
                            Quick reply buttons
                          </DropdownItem>
                          <DropdownItem onClick={() => handleButtonSelect("1")}>
                            Quick Reply
                            <small className="text-muted d-block">
                              Recommended
                            </small>
                          </DropdownItem>
                          <DropdownItem header className="fw-bold">
                            Call-To-Action buttons
                          </DropdownItem>
                          <DropdownItem onClick={() => handleButtonSelect("2")}>
                            Call Phone Number
                            <small className="text-muted d-block">
                              1 button maximum
                            </small>
                          </DropdownItem>
                          <DropdownItem onClick={() => handleButtonSelect("3")}>
                            Visit website
                            <small className="text-muted d-block">
                              2 button maximum
                            </small>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    {messagePreview.buttons.map((button, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center my-3"
                      >
                        {/* Button Text Input */}
                        <Input
                          type="text"
                          value={button.buttonText}
                          placeholder="Button Text"
                          onChange={(e) => {
                            // Create a deep copy of the button being updated
                            const updatedButtons = messagePreview.buttons.map(
                              (button, btnIndex) => {
                                if (btnIndex === index) {
                                  return {
                                    ...button, // Create a new object for the specific button
                                    buttonText: e.target.value, // Update the buttonText property
                                  };
                                }
                                return button; // Keep other buttons unchanged
                              }
                            );

                            // Update the state with the new buttons array
                            setMessagePreview({
                              ...messagePreview,
                              buttons: updatedButtons,
                            });
                          }}
                          className="me-2"
                        />

                        {/* Type 1 Action Button */}
                        {(button.buttonType === "1" ||
                          button.buttonType === 1) && (
                          <Button
                            style={{
                              backgroundColor: "grey",
                              borderColor: "green",
                              color: "white",
                            }}
                            className=""
                            onClick={() =>
                              handlebuttonaction(
                                index,
                                button.actionId,
                                button.actionType,
                                button.buttonValue
                              )
                            }
                          >
                            <i className="fa fa-bolt"></i>
                          </Button>
                        )}

                        {/* Type 2: Phone Number Input */}
                        {(button.buttonType === "2" ||
                          button.buttonType === 2) && (
                          <div className="d-flex me-2">
                            <Input
                              type="select"
                              value={button.countryCode}
                              onChange={(e) => {
                                const updatedButtons = [
                                  ...messagePreview.buttons,
                                ];
                                updatedButtons[index].countryCode =
                                  e.target.value;
                                setMessagePreview({
                                  ...messagePreview,
                                  buttons: updatedButtons,
                                });
                                setCountryCode(e.target.value);
                              }}
                              className="me-2"
                              style={{ minWidth: "120px" }}
                            >
                              <option value="+965">KW +965</option>
                              <option value="+1">US +1</option>
                              <option value="+91">IN +91</option>
                            </Input>
                            <Input
                              type="text"
                              value={button.buttonValue}
                              placeholder="Phone Number"
                              onChange={(e) => {
                                const updatedButtons = messagePreview.buttons.map((button, btnIndex) =>
                                  btnIndex === index ? { ...button, buttonValue: e.target.value } : button
                                );
                              
                                setMessagePreview({
                                  ...messagePreview,
                                  buttons: updatedButtons,
                                });
                              }}
                              
                              className="me-2"
                              style={{ minWidth: "220px" }}
                            />
                          </div>
                        )}

                        {/* Type 3: Website URL Input */}
                        {(button.buttonType === "3" ||
                          button.buttonType === 3) && (
                          <>
                            <div className="d-flex flex-column me-2">
                              {/* Website URL Input */}
                              <div className="d-flex">
                                <Input
                                  type="text"
                                  value={button.buttonValue}
                                  placeholder="Website URL"
                                  onChange={(e) => {
                                    const updatedButtons = [
                                      ...messagePreview.buttons,
                                    ];
                                    updatedButtons[index].buttonValue =
                                      e.target.value;
                                    setMessagePreview({
                                      ...messagePreview,
                                      buttons: updatedButtons,
                                    });
                                  }}
                                  className="me-2"
                                />
                               
                              </div>

                              {/* URL Variable Input */}
                              {button.urlveriablevalue != null && (
                                <div className="mt-3">
                                  <Row>
                                    <Col>
                                      <Input
                                        className="w-100"
                                        type="text"
                                        value={button.urlveriablevalue}
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
                                    <Col xs="auto">
                                      <div
                                        className="border-1 d-flex align-items-center justify-content-center rounded"
                                        style={{
                                          height: "46px",
                                          width: "38px",
                                          background: "#e1e1e1",
                                        }}
                                      >
                                        <FaTimes
                                          key={index}
                                          onClick={() => {
                                            removeWebsiteVariable(index);
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            color: "red",
                                          }}
                                        />
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {/* Remove Button */}
                        <Button
                          onClick={() => removeButtonFromPreview(index)}
                          color="danger"
                          className="h-10 w-10 ml-1"
                        >
                          <FaRegTrashCan />
                        </Button>
                      </div>
                    ))}

                    <div className="w-full flex justify-end gap-3">
                      <Button
                        className="uniform_btn_Cancel "
                        onClick={handelCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="uniform_btn  "
                        onClick={() => handleSubmit(values)}
                      >
                        Submit
                      </Button>
                    </div>

                    <MonitorFormikContext
                      setMessagePreview={setMessagePreview} // Pass setMessagePreview as a prop
                      defaultImage={defaultimage} // Pass the defaultImage as a prop
                    />
                  </Form>
                );
              }}
            </Formik>
          </Col>
          <Col md={4} className="overflow-hidden h-screen fixed right-10">
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
                    style={{ marginBottom: "5px" }}
                    dangerouslySetInnerHTML={{ __html: messagePreview.header }}
                  />
                )}
                <div
                  dangerouslySetInnerHTML={{ __html: messagePreview.body }}
                />
                {messagePreview.footer && (
                  <p style={{ marginTop: "5px", fontSize: "0.9em" }}>
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
                      {button.buttonType == 1 && (
                        <span style={{ color: "#00a9ee" }}>
                          <i className="fa fa-share fa-flip-horizontal me-2"></i>
                          {button.buttonText || "Button"}
                        </span>
                      )}
                      {button.buttonType == 2 && (
                        <span style={{ color: "#00a9ee" }}>
                          <i className="fa fa-phone me-2"></i>
                          {button.buttonText || "Button"}
                        </span>
                      )}
                      {button.buttonType == 3 && (
                        <span style={{ color: "#00a9ee" }}>
                          <i className="fa fa-external-link me-2"></i>
                          {button.buttonText || "Button"}
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

      <ButtonAction
        isOpen={showaction}
        toggle={togglePopup}
        onSubmit={handleSaveActionData}
        index={buttonindex}
        existingData={actionbuttonvalues}
      />
    </App>
  );
};

export default InteractiveTemplateUpdate;
