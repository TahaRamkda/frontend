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
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  createTemplates,
  clearTemplateCreateState,
} from "@/slices/TemplateSlice";
import { fetchSendernameById , clearSendernameState } from "@/slices/sendernameSlice";
import showSweetAlert from "@/components/Sweetalert";
import defaultimage from "@/public/images/12.jpg";
import bagroundimage from "@/public/images/baground.jpg";
import MediaPopUp from "@/pages/Media/MediaPopUp";

import Sendernames from "@/components/Dropdowns/SendernameDropdown";
import App from "@/components/Layout/App";
import ButtonAction from "../ButtonAction";
import moment from "moment";
import CustomMagicEditor from "@/components/CustomMagicEditor";
import { BASE_URL } from "@/utils/apiConstants";
import ClientDropdown from "@/components/Dropdowns/ClientDropdown";
import { set } from "date-fns";
import Loader from "@/components/Layout/Loader";
import MonitorFormikContext from "@/components/monitorformikcontext";
import TemplateCategoryDropdown from "@/components/Dropdowns/TemplateCategorydropdown";
import LanguageDropdown from "@/components/Dropdowns/LanguageDropdown";
import { toast } from "react-toastify";
const CustomEditor = dynamic(
  () => import("../../../components/CustomEditor/CustomEditor"),
  { ssr: false }
);
const TemplateCreationPage = () => {
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
  const [TemplateName, setTemplateName] = useState("");
  const { loading, error } = useSelector((state) => state.templates);
  const { sendername } = useSelector((state) => state.sendernames);
  const [bodyContent, setBodyContent] = useState("");
  const [variables, setVariables] = useState([]);
  const [SendernamesData, setSendernamesData] = useState([]);
  const [localLoading, setLocalLoading] = useState(false); // Renamed to avoid conflict
  const [showMediaPopup, setShowMediaPopup] = useState(false);
  const [urlerror, seturlerror] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonType, setButtonType] = useState(null);
  const [buttonText, setButtonText] = useState("");
  const [ButtonSelected, setButtonSelected] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [websiteUrl, setwebsiteUrl] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [marketingOptOutAdded, setMarketingOptOutAdded] = useState(false);
  const [callPhoneNumberButtonCount, setCallPhoneNumberButtonCount] = useState(0);
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
    if (data.actiontype === null || data.actiontype === "") {
      data.actiontype = 0;
    }

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
    if (!Templatetype) {
      toast.error("Please select a Template Type before proceeding.");
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

    if (!bodyPayloadDatawithVar) {
      toast.error("Please Enter Body Text before proceeding.");
      return; // Prevent further execution if language is not selected
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


    const variablePattern = /{{(.*?)}}/g;
    const matches = bodyfinalReplace.match(variablePattern);
    if (matches && variables && matches.length !== variables.length) {

      toast.error("Please load all body variables before proceeding.");
      return;
    }
    const headmatches = finalHeaderReplace.match(variablePattern);
    if (headmatches &&  headerVariable && headmatches.length !== headerVariable.length) {
      toast.error("Please load all  header variables before proceeding.");
    }


    const requestBody = {
      clientId: localStorage.getItem("clientId"),
      name: values.templateName,
      category: Templatetype,
      language: language,
      senderNameId: selectedSenderId,
      mediaId: selectedMediaId,
      actionBy: localStorage.getItem("userId"),
      header: {
        format: values.headerType,
        text: finalHeaderReplace,
        dynamicValue: headerVariable.reduce((acc, variable) => {
          acc.paramName = variable.name;
          acc.paramValue = variable.value;
          return acc;
        }, {}),

      },
      body: {
        text: bodyfinalReplace,
        dynamicValues: variables.map((variable) => ({
          paramName: variable.name,
          paramValue: variable.value,
        })),
      },
      footer: {
        text: messagePreview.footer,
      },
      buttons: messagePreview.buttons.map((button, index) => ({
        buttonType: button.type,
        buttonText: button.text,
        buttonValue: button.type === "2"
          ? `${button.countryCode}-${button.phoneNumber}`
          : button.websiteUrl,
        sequence: index,
        dynamicValue: {
          paramName: button.urlveriable,
          paramValue: button.urlveriablevalue,
        },
        actionId: button.actionId,
        actionType: button.actionType,
        buttonId: button.buttonValue,
      })),
    };
    if (!language) {
      alert("Please select Languaage");
    }
    try {
      const response = await dispatch(createTemplates(requestBody)).unwrap();
      if (response.success) {
        clearTemplateCreateState();
        showSweetAlert({
          title: "Template Created",
          text:
            response.result.message ||
            "The Template has been successfully created.",
          icon: "success",
        });
        await router.push("/Templates/TemplatesList");
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


  const loadurlVariables = (index) => {
    
    seturlerror("");
    const updatedButtons = [...messagePreview.buttons];
    const variablePattern = /{{(.*?)}}/g;
    const matches = updatedButtons[index].websiteUrl.match(variablePattern);
    if (matches && matches.length === 1) {
      matches.forEach((variable) => {
        //const variableName = variable.replace(/{{|}}/g, '');
        addURLVariable(index, variable);
      });
    } else {
      seturlerror("Please enter only one variable in header");
    }
  };

  const addURLVariable = (index, veriablename) => {
    
    const newIndex = 1;

    const updatedButtons = [...messagePreview.buttons];

    if (updatedButtons[index].websiteUrl.includes(veriablename)) {
      //const html = updatedButtons[index].websiteUrl;
      //.replace(/<p[^>]*>/g, '') // Remove opening <p> tags
      // .replace(/<\/p>/g, '<br />'); // Replace closing </p> tags with <br />
      //.replace(/<br\s*\/?>/g, ''); // Remove existing <br /> tag
      //var a = `${html}{{${newIndex}}}`;
      //var value = bodyTextCount;
      //setbodyTextCount(value+1);
      //updatedButtons[index].websiteUrl = a;
      updatedButtons[index].urlveriable = veriablename;
      updatedButtons[index].urlveriablevalue = "";
      //updatedButtons[index].urlverindex = newIndex;
      //setwebsiteUrl(e.target.value)
      setMessagePreview({ ...messagePreview, buttons: updatedButtons });
      //console.log("Updated Buttons:", messagePreview.buttons);
      //setwebsiteUrl(a);
      // alert(websiteUrl);
      //seturlvariables((prev) => [...prev, ""]);
      setErrorMessage("");
    } else {
      setErrorMessage(`Variable {${newIndex}} already exists in the body.`);
    }
  };

  // const removeWebsiteVariable = (index) => {
  //   const updatedButtons = [...messagePreview.buttons];

  //   // Check if the variable exists in the URL
  //   if (
  //     updatedButtons[index].websiteUrl.includes(
  //       `{{${updatedButtons[index].urlverindex}}}`
  //     )
  //   ) {
  //     // Remove the variable from the website URL
  //     updatedButtons[index].websiteUrl = updatedButtons[
  //       index
  //     ].websiteUrl.replace(`{{${updatedButtons[index].urlverindex}}}`, "");
  //     delete updatedButtons[index].urlveriable;
  //     delete updatedButtons[index].urlveriablevalue;
  //     delete updatedButtons[index].urlverind;

  //     // Update the state
  //     setMessagePreview({ ...messagePreview, buttons: updatedButtons });
  //     setErrorMessage(""); // Clear any existing error messages
  //   } else {
  //     setErrorMessage(
  //       `Variable {${updatedButtons[index].urlverindex}} does not exist in the URL.`
  //     );
  //   }
  // };

  useEffect(() => {
    setMessagePreview((prev) => ({
      ...prev,
      header: headContent.replace(/\n/g, "<br />"),
    }));
  }, [headContent]);

  // const removeVariable = (indexToRemove) => {
  //   // Remove the variable at the specified index from the variables array
  //   const updatedVariables = variables.filter((_, i) => i !== indexToRemove);

  //   // Determine the placeholder to remove
  //   const variableToRemove = `{{${indexToRemove + 1}}}`; // Variable to remove with its index

  //   // Ensure we only remove the exact placeholder and not affect others' values
  //   let updatedBodyContent = bodyPayloadDatawithVar;

  //   // Remove the placeholder being deleted
  //   updatedBodyContent = updatedBodyContent.replaceAll(variableToRemove, ""); // Only removes the exact placeholder

  //   // Adjust the remaining placeholders (renumber variables)
  //   updatedVariables.forEach((_, newIndex) => {
  //     const oldIndex = newIndex >= indexToRemove ? newIndex + 1 : newIndex; // Adjust old index based on removal
  //     const oldVariable = `{{${oldIndex + 1}}}`; // Variable with old index
  //     const newVariable = `{{${newIndex + 1}}}`; // Variable with new index

  //     // Replace the old placeholder with the new placeholder
  //     updatedBodyContent = updatedBodyContent.replaceAll(
  //       oldVariable,
  //       newVariable
  //     );
  //   });

  //   // Cleanup: Remove extra spaces introduced by deletion
  //   updatedBodyContent = updatedBodyContent
  //     .replace(/\s\s+/g, " ") // Replace multiple spaces with a single space
  //     .trim(); // Trim leading and trailing spaces

  //   // Update the state with the renumbered variables and updated content
  //   setVariables(updatedVariables.map((_, i) => `{{${i + 1}}}`)); // Adjust indices in variables
  //   setupdatedvercontent(updatedBodyContent); // Update the content
  //   setbodyTextCount(updatedVariables.length); // Update the variable count
  // };

  // const removeHeaderVariable = (index) => {
  //   //alert(bodyPayloadDatawithVar)
  //   const updatedVariables = headerVariable.filter((_, i) => i !== index);
  //   const updatedHeadContent = headerPayloadDatawithVar
  //     .replace(`{{${index + 1}}}`, "")
  //     .replace(/\s\s+/g, " ");
  //   var value = headerTextCount;
  //   setheaderTextCount(value - 1);
  //   setHeaderVariable(updatedVariables);
  //   setupdatedheadvercontent(updatedHeadContent);
  // };

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
    ;
    setHeaderVariable((prev) => {
      // Update the variable's value in the array
      const updatedVariables = prev.map((v) =>
        v.name === variableName ? { ...v, value: newValue } : v
      );

      // Calculate the updated body content using the new variables
      let updatedBody = finalContent;

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
    const placeholders = variables.map((_, index) => `${index}`);
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

  const handleurlVariableChange = (index, value) => {
    const updatedButtons = [...messagePreview.buttons];
    updatedButtons[index].urlveriablevalue = value; // Update the variable value
    setMessagePreview({ ...messagePreview, buttons: updatedButtons });
  };

  const handleButtonSelect = (type) => {
    if (!type || !messagePreview || !messagePreview.buttons) {
      console.error("Invalid input or message preview state.");
      return;
    }

    const callPhoneNumberButtonCount = messagePreview.buttons.filter(
      (button) => button.type === "2"
    ).length;
    const visitWebsiteButtonCount = messagePreview.buttons.filter(
      (button) => button.type === "3"
    ).length;

    if (type === "2" && callPhoneNumberButtonCount >= 1) {
      toast.error("You can only add one call phone number button.");
      setButtonType(null);
    } else if (type === "3" && visitWebsiteButtonCount >= 2) {
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

      switch (type) {
        case "1":
          setButtonText("");
          setMarketingOptOutAdded(true);
          setTotalButtonCount((prev) => prev + 1);
          break;
        case "2":
          setButtonText("Call Phone Number");
          setCallPhoneNumberButtonCount((prev) => prev + 1);
          setTotalButtonCount((prev) => prev + 1);
          break;
        case "3":
          setButtonText("Visit Website");
          setVisitWebsiteButtonCount(visitWebsiteButtonCount + 1);
          setTotalButtonCount((prev) => prev + 1);
          break;
        default:
          setButtonText("");
          break;
      }
    }
  };
  const handelCancel = () => {
    setLocalLoading(true);
    router.push("/Templates/TemplatesList");
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
  const handleSenderChange = async (e) => {
    const senderId = e.target.value;
    console.log("Selected Sender ID:", senderId);

    setSelectedSenderId(senderId);
    setLocalLoading(true); // Use local loading state

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
    } finally {
      setLocalLoading(false);
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
  }, [bodyFinalContent]);

  //console.log("BodyFinalContent12", bodyContent, finalContent)
  const HandleTemplatetypechange = (e) => {
    const templatetype = e.target.value;
    setTemplatetype(templatetype);
  };

  const HandleTemplateLanguagechange = (e) => {
    const Language = e.target.value;
    setlanguage(Language);
  };
  
  return (
    <App>
      <Container fluid className="mt-0">
      {(loading || localLoading) && <Loader />}

        <Row style={{ height: "100vh" }}>
          <Col
            md={6} lg={7}
            className="overflow-auto templete-leftsection"
            style={{ padding: "20px", background: "#fffff" }}
          >
            <h4 className="mb-4">Create Template</h4>
            <label className="block mb-1 mt-1">Sender Names</label>
            <Sendernames
              name="senderId"
              value={selectedSenderId}
              onChange={handleSenderChange}
              required
            />

            <label className="block mb-1 mt-1">Template type</label>
            <TemplateCategoryDropdown
              name="templatetype"
              value={Templatetype}
              onChange={HandleTemplatetypechange}
              required
            />

            <label className="block mb-1 mt-1">Language</label>
            <LanguageDropdown
              name="language"
              value={language}
              onChange={HandleTemplateLanguagechange}
              required
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
              }}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                const ToggleModal = () => {
                  setShowMediaPopup(false)
                }
                
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
                              variables={variables}
                              setheaderPayloaddatawithVar={
                                setheaderPayloaddatawithVar
                              }
                              onFunction={addHeaderVariable}
                              headerVariable={headerVariable}
                              handleheaderVariableChange={
                                handleheaderVariableChange
                              }
                              setHeaderVariable={setHeaderVariable}
                              headContent={headContent}
                              setFinalContent={setFinalContent}
                              existingContent={updatedheadvercontent}
                              body={false}
                            />
                          </FormGroup>
                        )}

                        {["2", "3", "4"].includes(values.headerType) && (
                          <div>
                            <MediaPopUp
                              key={values.headerType}
                              isPopup={true}
                              contentTypeStr={
                                values.headerType === "2"
                                  ? "image"
                                  : values.headerType === "3"
                                    ? "video"
                                    : "application"
                              }
                              senderId={selectedSenderId}
                              onSelectMedia={(mediaId, mediaPath, mimeType) => {
                                setSelectedMediaId(mediaId);
                                setSelectedMediaPath(mediaPath);
                                setSelectedMediaType(mimeType);
                              }}
                            />

                            {/* New Button for Changing MediaPopUp */}
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
                            variables={variables}
                            setBodyPayloadDatawithVar={
                              setBodyPayloadDatawithVar
                            }
                            setBodyFinalContent={setBodyFinalContent}
                            handleVariableChange={handleVariableChange}
                            addVariable={addVariable}
                            handleBodyChange={handleBodyChange}
                            body={true}
                            existingBodyContent={updatedvercontent}
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
                        <div className="flex">
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
                        className="d-flex align-items-center my-3 border-b-2 pb-3"
                      >
                        {/* Common Button Text Input */}

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
                          style={{
                            flex: "1 1 40%",
                            minWidth: "250px",
                            marginBottom: "10px",
                          }}
                        />
                        {/* Type-Specific Inputs */}
                        {button.type === "2" && (
                          <div
                            className="d-flex align-items-center border rounded px-2"
                            style={{ flex: "1 1 60%", minWidth: "300px" }}
                          >
                            {/* Country Code Dropdown */}
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
                              style={{
                                border: "none",
                                width: "80px",
                                appearance: "none",
                                background: "transparent",
                                paddingRight: "8px",
                              }}
                              className="me-2"
                            >
                              <option value="+965">+965</option>
                              <option value="+1">+1</option>
                              <option value="+91">+91</option>
                            </Input>

                            {/* Phone Number Input */}
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
                              style={{ flex: 1, border: "none" }}
                            />
                          </div>
                        )}

                        {button.type === "3" && (
                          <div className="mb-2" style={{ flex: "1 1 60%" }}>
                            {/* Website URL Input and Variable */}
                            <div className="d-flex flex-column">
                              {/* Website URL Input */}
                              <div className="d-flex align-items-center">
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
                                  style={{
                                    flex: "2 1 auto",
                                    minWidth: "250px",
                                    marginRight: "10px",
                                  }}
                                />

                                {/* Add Variable Button */}
                                <Button
                                  onClick={() => loadurlVariables(index)}
                                  className="bg-transparent border-0 text-primary"
                                  style={{
                                    flex: "0 0 auto",
                                    minWidth: "max-content",
                                    fontSize: "0.75rem",
                                    padding: "5px 10px",
                                  }}
                                >
                                  + Load Variable
                                </Button>
                              </div>
                              {button.urlveriablevalue != null && (
                                <div className="mt-2" style={{ width: "100%" }}>
                                  <Row className="align-items-center">
                                    <Col>
                                      <Input
                                        type="text"
                                        value={button.urlveriablevalue}
                                        onChange={(e) =>
                                          handleurlVariableChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                        placeholder={`Enter Sample value for ${index + 1
                                          }`}
                                        className="w-100"
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              )}
                            </div>
                            {urlerror && (
                              <Alert color="danger" className="mt-2">
                                {urlerror}
                              </Alert>
                            )}
                          </div>

                        )}

                        {/* Action Button for Type 1 */}
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
            md={6} lg={5}
            className=" h-screen right-10 templete_chatSection "
          // style={{
          //   position: "fixed", // Fix the position
          //   top: "-20", // Adjust to your layout
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
                className="mb-1  p-3  "
                style={{ maxWidth: "100%", margin: "auto" }}
              >
                Template Preview
              </h4>
            </div>
            <div>
              {/* Show the header and sender data only when selectedSenderId is set and data is fetched */}

              <div
                className="border"
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
                    className=""
                    style={{
                      position: "sticky", // Make this section sticky
                      top: "0", // Stick it to the top
                      zIndex: "10", // Ensure it stays above other content
                      backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white 
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
                        <div className="">{sendername.senderName}</div>
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

export default TemplateCreationPage;
