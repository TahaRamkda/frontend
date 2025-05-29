import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Formik, Field, useFormikContext } from "formik";
import { Image } from "react-bootstrap";
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
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  createInteractiveTemplates,
  clearInteractiveTemplateCreateState,
} from "@/slices/InteractiveTemplateSlice";
import showSweetAlert from "@/components/Sweetalert";
import defaultimage from "@/public/images/12.jpg";
import bagroundimage from "@/public/images/baground.jpg";
import MediaPopUp from "@/pages/Media/MediaPopUp";
import Sendernames from "@/components/Dropdowns/SendernameDropdown";
import { fetchSendernameById } from "@/slices/sendernameSlice";
import App from "@/components/Layout/App";
import ButtonAction from "@/pages/Templates/ButtonAction";
import moment from "moment";
import CustomMagicEditor from "@/components/CustomMagicEditor";
import { BASE_URL } from "@/utils/apiConstants";
import Loader from "@/components/Layout/Loader";
import MonitorFormikContext from "@/components/monitorformikcontext";
import LanguageDropdown from "@/components/Dropdowns/LanguageDropdown";
import { toast } from "react-toastify";
const CustomEditor = dynamic(
  () => import("../../../components/CustomEditor/CustomEditor"),
  { ssr: false }
);
const InteractiveTemplateCreation = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const stripHtml = (input) => input.replace(/<[^>]*>/g, "");
  const [messagePreview, setMessagePreview] = useState({
    header: "",
    body: "",
    footer: "",
    media: null,
    buttons: [],
    visitWebsiteButtonCount: 0,
  });
  const locationButtonExists = messagePreview?.buttons?.some(
    (btn) => btn.type === "7"
  );
  const otherButtonsExist = messagePreview?.buttons?.some(
    (btn) => btn.type !== "7"
  );
  const { loading, error } = useSelector((state) => state.interactiveTemplates);
  const [bodyContent, setBodyContent] = useState("");
  const [variables, setVariables] = useState([]);
  const [TemplateName, setTemplateName] = useState("");
  const [urlvariables, seturlvariables] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonType, setButtonType] = useState(null);
  const [senderLoading, setSenderLoading] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const { sendername } = useSelector((state) => state.sendernames);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
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
  const [ButtonSelected, setButtonSelected] = useState(false);
  const [showMediaPopup, setShowMediaPopup] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState(0);
  const [SendernamesData, setSendernamesData] = useState([]);
  const [selectedSenderId, setSelectedSenderId] = useState(null);
  const [selectedMediaPath, setSelectedMediaPath] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [headerTextCount, setheaderTextCount] = useState(0);
  const [bodyTextCount, setbodyTextCount] = useState(0);
  const [APIbodyContent, setAPIbodyContent] = useState("");
  const [TotalButtonCount, setTotalButtonCount] = useState(0);
  const [Showallbutton, setShowallbutton] = useState(false);
  const [showaction, setshowaction] = useState(false);
  const [actionType, setActionType] = useState(0);
  const [actionId, setActionId] = useState(null);
  const [buttonindex, setbuttonindex] = useState(0);
  const [headerPayloadDatawithVar, setheaderPayloaddatawithVar] = useState("");
  const [bodyPayloadDatawithVar, setBodyPayloadDatawithVar] = useState("");
  const [removeHeaderButtonEnabled, setRemoveHeaderButtonEnabled] =
    useState(false);
  const [updatedvercontent, setupdatedvercontent] = useState("");
  const [updatedheadvercontent, setupdatedheadvercontent] = useState("");
  const [Templatetype, setTemplatetype] = useState("");
  const [language, setlanguage] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [actionbuttonvalues, setactionbuttonvalues] = useState([]);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const replaceClosingPTagsWithNewline = (content) => {
    return content
      ?.replace(/<\/p>/gi, "\n ")
      .replace(/<p.*?>/gi, "")
      .replace(/\n /g, "\n  ");
  };

  const togglePopup = () => setshowaction(!showaction);

  //console.log("!@#$%^&", bodyFinalContent)

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

  const handleSubmit = async (values) => {
    if (!selectedSenderId) {
      toast.error("Please select a Sender Name before proceeding.");
      return; // Prevent further execution if language is not selected
    }
    if (!language) {
      toast.error("Please select a language before proceeding.");
      return; // Prevent further execution if language is not selected
    }
    if (!TemplateName) {
      toast.error("Please Enter Template Name before proceeding.");
      return; // Prevent further execution if language is not selected
    }
    let isValid = true; // Flag to track validation status
    if (!bodyPayloadDatawithVar) {
      toast.error("Please Enter Body Text before proceeding.");
      return; // Prevent further execution if language is not selected
    }

    messagePreview.buttons.forEach((button, index) => {
      // Common validation for button text
      if (!button.text || button.text.trim() === "") {
        toast.error(`Please enter button text for Button ${index + 1}.`);
        isValid = false;
        return;
      }

      // Type-specific validations
      switch (button.type) {
        case "1":
        case 1:
          // Type 1 has no additional validation
          break;

        case "2":
        case 2:
          if (
            !button.phoneNumber ||
            button.phoneNumber.trim() === "" ||
            !button.countryCode
          ) {
            toast.error(
              `Please enter a valid phone number for Button ${index + 1}.`
            );
            isValid = false;
            return;
          }
          break;

        case "3":
        case 3:
          if (!button.websiteUrl || button.websiteUrl.trim() === "") {
            toast.error(`Please enter a valid URL for Button ${index + 1}.`);
            isValid = false;
            return;
          }
          break;
        case "7":
        case 7:
          break;
        default:
          toast.error(`Invalid button type for Button ${index + 1}.`);
          isValid = false;
          return;
      }
    });

    // Prevent API call if validation failed
    if (!isValid) {
      console.log("Validation failed. Request will not be sent.");
      return; // Stop further execution
    }

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
      clientId: localStorage.getItem("clientId"),
      name: values.templateName,
      senderNameId: selectedSenderId,
      language: language,
      usedByAgent: values.usedByAgent,
      mediaId: selectedMediaId,
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
        buttonType: button.type,
        buttonText: button.text,
        actionId: button.actionId,
        actionType: button.actionType,
        systemActionId: 0,
        sequence: index + 1,
        buttonValue: button.websiteUrl?.trim()
          ? button.websiteUrl
          : `${button.countryCode}${button.phoneNumber}`,
      })),
    };
    
    try {
      const response = await dispatch(
        createInteractiveTemplates(requestBody)
      ).unwrap();
      debugger
      if (response.status === 200) {
        
        clearInteractiveTemplateCreateState();
        showSweetAlert({
          title: "Template Created",
          text:
            response.message ||
            "The Template has been successfully created.",
          icon: "success",
        });
        await router.push("/InteractiveTemplates/InteractiveList");
      } else {
        showSweetAlert({
          title: "Creation Failed",
          text:
            response.message || "Failed to create Template. Please try again.",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Failed to create Template", err);
      showSweetAlert({
        title: "Creation Failed",
        text: err.message || "Failed to create Template. Please try again.",
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

  useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const handleButtonSelect = (type) => {
    const locationButtonCount = messagePreview.buttons.filter(
      (button) => button.type === "7"
    ).length;
    const otherButtonsExist = messagePreview.buttons.some(
      (btn) => btn.type !== "7"
    );

    if (type === "7" && otherButtonsExist) {
      toast.error(
        "You cannot add a location button when other buttons already exist."
      );
      setButtonType(null);
      return;
    }

    if (locationButtonCount >= 1 && type !== "7") {
      toast.error(
        "You cannot add other buttons when a location button is already added."
      );
      setButtonType(null);
      return;
    }
    if (type === "7" && locationButtonCount >= 1) {
      toast.error("You can only add one location button.");
      setButtonType(null);
    } else {
      if (type === "2" && callPhoneNumberButtonCount >= 1) {
        toast.error("You can only add one call phone number button.");
        setButtonType(null);
      } else if (
        type === "3" &&
        messagePreview.buttons.filter((button) => button.type === "3").length >=
          2
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
          setButtonText("");
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
    }
  };
  const handelCancel = () => {
    router.push("/InteractiveTemplates/InteractiveList");
  };

  useEffect(() => {
    if (buttonType) {
      const newButton = {
        type: buttonType,
        text: buttonText,
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
  useEffect(() => {
    if (sendername) {
      setSendernamesData(sendername);
    }
  }, [sendername]);

  // Handle sender change
  const handleSenderChange = async (e) => {
    const senderId = e.target.value;
    console.log("Selected Sender ID:", senderId); // Debugging
    setSelectedSenderId(senderId);
    setSenderLoading(true);

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
    } finally {
      setSenderLoading(false);
    }
  };

  const handlebuttonaction = (index, actionId, actionType, buttonValue) => {
    setbuttonindex(index);
    const buttonaction = {
      actionId: actionId,
      actionType: actionType,
      buttonValue: buttonValue,
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

    // Replace variables in the body content
    variables.forEach((variable, index) => {
      updatedBody = updatedBody.replace(`{{${index + 1}}}`, variable);
    });

    // Handle newlines and preserve the flow
    updatedBody = updatedBody.replace(/\n/g, "<br/>"); // Convert newlines to <br/> tags for HTML rendering

    // Replace <p> tags only if necessary, and ensure newlines are handled correctly
    updatedBody = updatedBody
      .replace(/<\/p>/gi, "<br/>")
      .replace(/<p.*?>/gi, "");
    updatedBody = updatedBody?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    updatedBody = updatedBody.replace(/\*(.*?)\*/g, "<em>$1</em>");
    updatedBody = updatedBody.replace(/~(.*?)~/g, "<sub>$1</sub>");
    // Update the message preview body content
    setMessagePreview((prev) => ({
      ...prev,
      body: updatedBody, // HTML safe body with <br/> tags and replaced variables
    }));
  }, [bodyFinalContent, variables]);

  const HandleTemplateLanguagechange = (e) => {
    const Language = e.target.value;
    setlanguage(Language);
  };

  return (
    <App>
      <Container fluid className="mt-0">
        {(loading || senderLoading) && <Loader />}
        <Row style={{ height: "100vh" }}>
          <Col
            md={6}
            lg={7}
            className="Interactivetemplete-leftsection"
            style={{ padding: "20px", background: "#fffff" }}
          >
            <h4 className="mb-4">Create Interactive Template</h4>
            <label className="block mb-1 mt-1">Sender Names</label>
            <Sendernames
              name="senderId"
              value={selectedSenderId}
              onChange={handleSenderChange}
            />

            <label className="block mb-1 mt-1">Language</label>
            <LanguageDropdown
              name="language"
              value={language}
              onChange={HandleTemplateLanguagechange}
            />
            <Formik
              initialValues={{
                templateName: "",
                headerType: "0",
                headerContent: "",
                headerMedia: null,
                body: "",
                footer: "",
                buttons: [],
                variables: [],
                headerVariable: [],
                bodyValues: [],
                buttonValues: [],
                usedByAgent: true,
              }}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                const ToggleModal = () => {
                  setShowMediaPopup(false);
                };
                return (
                  <Form>
                    <div className="">
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
                          maxLength="50"
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\s+/g, "_")
                              .replace(/[^a-zA-Z0-9_]/g, "")
                              .toLowerCase();
                            setFieldValue("templateName", value); // Update Formik's state
                            setTemplateName(value);
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

                    <div className="mt-3 ">
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
                        {values.headerType === "1" && (
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
                              existingContent={updatedheadvercontent}
                              body={false}
                              showaddvarbutton={false}
                            />
                          </FormGroup>
                        )}
                        {/* {console.log("Value Mania", ["2", "3", "4"].includes(values.headerType))} */}
                        {["2", "3", "4"].includes(values.headerType) && (
                          <>
                            <div>
                              <MediaPopUp
                                key={values.headerType} // This forces re-rendering when headerType changes
                                isPopup={["2", "3", "4"].includes(
                                  values.headerType
                                )}
                                senderId={selectedSenderId}
                                contentTypeStr={
                                  values.headerType === "2"
                                    ? "image"
                                    : values.headerType === "3"
                                    ? "video"
                                    : "application"
                                }
                                onSelectMedia={(
                                  mediaId,
                                  mediaPath,
                                  mimeType
                                ) => {
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
                                  Change{" "}
                                  {values.headerType === "2"
                                    ? "Image"
                                    : values.headerType === "3"
                                    ? "Video"
                                    : "Document"}
                                </button>

                                {showMediaPopup && (
                                  <MediaPopUp
                                    isPopup={true}
                                    ToggleModal={ToggleModal}
                                    senderId={selectedSenderId}
                                    contentTypeStr={
                                      values.headerType === "2"
                                        ? "image"
                                        : values.headerType === "3"
                                        ? "video"
                                        : "application"
                                    }
                                    onSelectMedia={(
                                      mediaId,
                                      mediaPath,
                                      mimeType
                                    ) => {
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
                          required
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

                          <DropdownItem
                            onClick={() => handleButtonSelect("1")}
                            className={
                              locationButtonExists ? "bg-light text-muted" : ""
                            }
                          >
                            Quick Reply
                            <small className="text-muted d-block">
                              Recommended
                            </small>
                          </DropdownItem>

                          <DropdownItem header className="fw-bold">
                            Call-To-Action buttons
                          </DropdownItem>

                          <DropdownItem
                            onClick={() => handleButtonSelect("2")}
                            className={
                              locationButtonExists ? "bg-light text-muted" : ""
                            }
                          >
                            Call Phone Number
                            <small className="text-muted d-block">
                              1 button maximum
                            </small>
                          </DropdownItem>

                          <DropdownItem
                            onClick={() => handleButtonSelect("3")}
                            className={
                              locationButtonExists ? "bg-light text-muted" : ""
                            }
                          >
                            Visit website
                            <small className="text-muted d-block">
                              2 button maximum
                            </small>
                          </DropdownItem>

                          <DropdownItem
                            onClick={() => handleButtonSelect("7")}
                            className={
                              otherButtonsExist ? "bg-light text-muted" : ""
                            }
                          >
                            Location
                            <small className="text-muted d-block">
                              1 button maximum
                            </small>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>

                    {messagePreview.buttons.map((button, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center my-3 border-b-2 pb-3"
                      >
                        {/* Button Text Input */}
                        <Input
                          type="text"
                          value={button.text}
                          placeholder="Button Text"
                          onChange={(e) => {
                            const updatedButtons = [...messagePreview.buttons];
                            updatedButtons[index].text = e.target.value;
                            setMessagePreview({
                              ...messagePreview,
                              buttons: updatedButtons,
                            });
                          }}
                          className="me-2"
                        />

                        {/* Type 1 Action Button */}
                        {button.type === "1" && (
                          <Button
                            style={{
                              backgroundColor: "grey",
                              borderColor: "green",
                              color: "white",
                            }}
                            className="me-2"
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
                        {button.type === "2" && (
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
                              value={button.phoneNumber}
                              placeholder="Phone Number"
                              onChange={(e) => {
                                const updatedButtons = [
                                  ...messagePreview.buttons,
                                ];
                                updatedButtons[index].phoneNumber =
                                  e.target.value;
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
                        {button.type === "3" && (
                          <>
                            <div className="d-flex flex-column me-2">
                              {/* Website URL Input */}
                              <div className="d-flex">
                                <Input
                                  type="text"
                                  value={button.websiteUrl}
                                  placeholder="Website URL"
                                  onChange={(e) => {
                                    const updatedButtons = [
                                      ...messagePreview.buttons,
                                    ];
                                    updatedButtons[index].websiteUrl =
                                      e.target.value;
                                    setMessagePreview({
                                      ...messagePreview,
                                      buttons: updatedButtons,
                                    });
                                  }}
                                  className="me-2"
                                />
                              </div>
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
                        Create
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

          <Col
            md={6}
            lg={5}
            className="h-screen right-10 Interactive_PreviewSection"
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
                className="mb-1  p-3 "
                style={{ maxWidth: "100%", margin: "auto" }}
              >
                Template Preview
              </h4>
            </div>
            <div>
              {/* Show the header and sender data only when selectedSenderId is set and data is fetched */}

              <div
                className="border "
                style={{
                 maxHeight: "600px",
                  overflowY: "scroll",
                  minHeight: "400px",
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
                      <div className="p-1 ">
                        <div>{sendername.senderName}</div>
                        <div className="text-xs text-gray-600">
                          {sendername.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rest of the content (message preview, etc.) */}
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
                    selectedMediaType.startsWith("image/") && (
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
                      dangerouslySetInnerHTML={{
                        __html: messagePreview.header,
                      }}
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
                        {button.type == 7 && (
                          <span style={{ color: "#00a9ee" }}>
                            <i className="fa fa-map-pin me-2"></i>
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
            </div>
          </Col>
        </Row>
      </Container>

      <ButtonAction
        isOpen={showaction}
        toggle={togglePopup}
        onSubmit={handleSaveActionData}
        index={buttonindex}
        SenderId={selectedSenderId}
        existingData={actionbuttonvalues}
      />
    </App>
  );
};

export default InteractiveTemplateCreation;
