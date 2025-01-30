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
  updateTemplates,
  fetchTemplatesById,
  clearTemplateDetailState,
} from "@/slices/TemplateSlice";
import showSweetAlert from "@/components/Sweetalert";
import defaultimage from "@/public/images/12.jpg";
import bagroundimage from "@/public/images/baground.jpg";
import Media from "@/pages/Media/MediaList";
import Sendernames from "@/components/Dropdowns/SendernameDropdown";
import App from "@/components/Layout/App";
import ButtonAction from "../ButtonAction";
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
const TemplateUpdatePage = () => {
  const Template_Id = useRecoilValue(TemplateState);
  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
  const router = useRouter();
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(true);
  const [actionbuttonvalues, setactionbuttonvalues] = useState([]);
  const { template, loading, error } = useSelector((state) => state.templates);
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
  const [showMediaPopup, setShowMediaPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonType, setButtonType] = useState(null);
  const [buttonText, setButtonText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("US +1");
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
  const [urlerror, seturlerror] = useState("");
  const[MessagePreviewupdated,setMessagePreviewupdated] = useState(false);
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
        fetchTemplatesById({
          ClientId: localStorage.getItem("clientId"),
          templateId: Template_Id,
        })
      )
        .then((response) => {
          setTemplate(response); // Assuming response is the template object
        })
        .catch((error) => {
          console.error("Error fetching template:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      router.back();
    }
  }, [dispatch, Template_Id]);

  useEffect(() => {
    debugger
    if (Loading || !template) return;
  
    // Map buttons with conditional logic for phoneNumber or URL
    const customButtons = template.buttons?.map(button => ({
      actionId: button.actionId,
      actionType:button.actionType,
      buttonValue:button.buttonValue,
      type: button.buttonType, // Copy over the type
      text: button.buttonText, // Copy over the label
      ...(button.buttonType === 2
        ? { phoneNumber: button.buttonValue }
        : button.buttonType === 3
        ? { url: button.buttonValue }
        : {})
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
    setMessagePreview(prevPreview =>
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
      setupdatedheadvercontent(template.headerText);
      setheaderTextCount(template.headerParamCount);
    } else {
      setSelectedMediaId(template.mediaId);
      setSelectedMediaPath(template.mediaPath);
      setSelectedMediaType(template.contentType);
    }
  
    // Update Body State
    setupdatedvercontent(template.bodyText);
    setbodyTextCount(template.bodyParamCount);
  
    // Update Other Template-Related States
    setSelectedSenderId(template.senderId);
    setTemplatetype(template.category);
    setlanguage(template.language);
    setTotalButtonCount(updatedMessagePreview.buttons.length);
  
  }, [Loading, template]);
  
  useEffect(() => {
    if (!MessagePreviewupdated || Loading || !template.parameters) return;
  
    // Use a flag to ensure this runs only once
    let parametersProcessed = false;
    if (parametersProcessed) return;
  
    // Process Parameters
    const filteredHeaderValues = template.parameters.filter(
      variable => variable?.paramType === 1
    );
    if (filteredHeaderValues.length > 0) {
      const allVariables = filteredHeaderValues.map(variable => variable.paramName);
      addHeaderVariable(null, allVariables);
      filteredHeaderValues.forEach(variable => {
        if (variable?.paramDefaultValue !== undefined) {
          handleheaderVariableChange(variable.paramName, variable.paramDefaultValue);
        }
      });
    }
  
    const filteredBodyValues = template.parameters.filter(
      variable => variable?.paramType === 2
    );
    if (filteredBodyValues.length > 0) {
      const allVariables = filteredBodyValues.map(variable => variable.paramName);
      addVariable(null, allVariables);
      filteredBodyValues.forEach(variable => {
        if (variable?.paramDefaultValue !== undefined) {
          handleVariableChange(variable.paramName, variable.paramDefaultValue);
        }
      });
    }
  
    const filteredURLValues = template.parameters.filter(
      variable => variable?.paramType === 3
    );
    if (filteredURLValues.length > 0) {
      const allVariables = filteredURLValues.map(variable => variable.paramName);
      filteredURLValues.forEach(variable => {
        if (variable?.paramDefaultValue !== undefined) {
          addURLVariable(variable.sequence , variable.paramName);
          handleurlVariableChange(variable.sequence , variable.paramDefaultValue);
        }
      });
    }
  
    // Mark parameters as processed
    parametersProcessed = true;
  
    // Clear Template Detail State
    clearTemplateDetailState();
  }, [ MessagePreviewupdated]);
  
  useEffect(() => {
    setAPIheadContent(replaceClosingPTagsWithNewline(headContent));
  }, [headContent]); // Trigger only when headContent changes

  useEffect(() => {
    setAPIbodyContent(replaceClosingPTagsWithNewline(bodyFinalContent));
  }, [bodyFinalContent]);

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
    router.push("/Templates/TemplatesList");
  };
  // const handleSubmit = async (values) => {
  //   // let trimmedBodyContent = APIbodyContent.replace(/\*\*/g, "*").trimEnd();
  //   // let APIbodyContent = "**Latest**<sub>Text</sub>*Example*   "; // Example content

  //   // Replace ** with *, * with _, and <sub>/<sub> with ~
  //   let trimmedBodyContent = APIbodyContent;

  //   //Replacing the words
  //   const result = headerPayloadDatawithVar.replace(/\*\*/g, "+");
  //   const subresult = result.replace(/\*/g, "`");
  //   const supresult = subresult.replace(/<sub>.*?<\/sub>/g, "~");
  //   const replaceX = supresult.replace(/`/g, "_");
  //   const finalHeaderReplace = replaceX.replace(/\+/g, "*");

  //   const bodyresult = bodyPayloadDatawithVar.replace(/\*\*/g, "+");
  //   const bodysubresult = bodyresult.replace(/\*/g, "`");
  //   const bodysupresult = bodysubresult.replace(/<sub>.*?<\/sub>/g, "~");
  //   const bodyreplaceX = bodysupresult.replace(/`/g, "_");
  //   const bodyfinalReplace = bodyreplaceX.replace(/\+/g, "*");

  //   const requestBody = {
  //     clientId: localStorage.getItem("clientId"),
  //     name: values.templateName,
  //     Id: Template_Id,
  //     transactionType: 1,
  //     category: "marketing",
  //     language: "en",
  //     senderNameId: selectedSenderId,
  //     status: "Pending",
  //     subCategory: "marketing",
  //     isApproved: false,
  //     mediaId: selectedMediaId,
  //     templateType: 1,
  //     actionBy: localStorage.getItem("userId"),
  //     header: {
  //       format: values.headerType,
  //       text: finalHeaderReplace,
  //       textCount: headerTextCount,
  //       values: headerVariable.map((value, index) => ({
  //         value: value,
  //         defaultValue: value,
  //         index: index + 1,
  //       })),
  //     },
  //     body: {
  //       // text: trimmedBodyContent,
  //       text: bodyfinalReplace,
  //       textCount: bodyTextCount,
  //       values: variables.map((value, index) => ({
  //         value: value,
  //         defaultValue: value,
  //         index: index + 1,
  //       })),
  //     },
  //     footer: {
  //       //text: messagePreview.footer,
  //       text: messagePreview.footer,
  //     },
  //     buttons: messagePreview.buttons.map((button, index) => ({
  //       type: button.type,
  //       text: button.text,
  //       phoneNumber: button.phoneNumber,
  //       textCount: button.textCount,
  //       index: index,
  //       url: button.websiteUrl,
  //       values: urlvariables.map((value, index) => ({
  //         value: value,
  //         defaultValue: value,
  //         index: index + 1,
  //       })),
  //       actionId: button.actionId,
  //       actionType: button.actionType,
  //       buttonId: button.buttonValue,
  //     })),
  //   };

  //   //console.log("TimingData", requestBody)

  //   try {
  //     const response = await dispatch(updateTemplates(requestBody)).unwrap();
  //     if (response.success) {
  //       clearTemplateCreateState();
  //       showSweetAlert({
  //         title: "Updated Successfully",
  //         text: "",
  //         icon: "success",
  //       });
  //       router.push("/Templates/Templateslist");
  //     } else {
  //       showSweetAlert({
  //         title: "Failed",
  //         text: response.message || "",
  //         icon: "error",
  //       });

  //       //window.location.reload();
  //     }
  //   } catch (err) {
  //     console.error("Failed to update Template", err);
  //     showSweetAlert({
  //       title: "Failed",
  //       text: err.message || "",
  //       icon: "error",
  //     });
  //     //window.location.reload();
  //   }
  // };

 
//function to add veriable in header
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
 //function to add body variable
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


 //function to add url veriable
  const addURLVariable = (index,veriablename) => {
    debugger
    const newIndex = 1;

    const updatedButtons = [...messagePreview.buttons];
   if(updatedButtons.length>0){
    if (updatedButtons[index].url?.includes(veriablename)) {
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

   }
   
  };

  // const loadurlVariables = (index) => {
  //   seturlerror("");
  //   const updatedButtons = [...messagePreview.buttons];
  //   const variablePattern = /{{(.*?)}}/g;
  //   const matches=updatedButtons[index].websiteUrl.match(variablePattern);
  //   if (matches && matches.length === 1) {
  //     matches.forEach((variable) => {
  //       //const variableName = variable.replace(/{{|}}/g, '');
  //       addURLVariable(index,variable);
  //     });
  //   } else {
  //     seturlerror("Please enter only one variable in header");
  //   }
  // };


 
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

  // const removeVariable = (index) => {
  //   const updatedVariables = variables.filter((_, i) => i !== index);
  //   const updatedBodyContent = bodyPayloadDatawithVar
  //     .replace(`{{${index + 1}}}`, "")
  //     .replace(/\s\s+/g, " ");
  //   var value = bodyTextCount;
  //   setbodyTextCount(value - 1);
  //   setVariables(updatedVariables);
  //   setupdatedvercontent(updatedBodyContent);
  // };

  //function to handle header variable change
  const handleheaderVariableChange = (variableName, newValue) => {
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
  
 //function to handle body variable change
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

//function to handle url variable change
  const handleurlVariableChange = (index, value) => {
    const updatedButtons = [...messagePreview.buttons];
    if(updatedButtons.length>0){
      updatedButtons[index].urlveriablevalue = value; // Update the variable value
      setMessagePreview({ ...messagePreview, buttons: updatedButtons });
      
    }
    else{
      return
    }
   
  };

  // const addheaderVariable = () => {
  //   if (headerVariable.length < 1) {
  //     const newIndex = headerVariable.length + 1;
  //     if (!headContent.includes(`{{${newIndex}}}`)) {
  //       setHeadContent((prev) => {
  //         const newHeadContent = prev + `{{${newIndex}}}`;
  //         return newHeadContent;
  //       });
  //       var value = headerTextCount;
  //       setheaderTextCount(value + 1);
  //       setHeaderVariable((prev) => [...prev, ""]); // Update the state correctly
  //       setErrorMessage("");
  //       setRemoveHeaderButtonEnabled(true); // Enable the remove button
  //     } else {
  //       setErrorMessage(`Variable {${newIndex}} already exists in the header.`);
  //     }
  //   } else {
  //     setErrorMessage("You can only add one header variable.");
  //   }
  // };
  // const handleBodyChange = (value) => {
  //   const placeholders = variables.map((_, index) => `{{${index + 1}}}`);
  //   const isValid = placeholders.every((placeholder) => value.includes(placeholder));

  //   if (isValid) {
  //     setBodyContent(value.replace(/\s\s+/g, " "));
  //     //setBodyContent(replaceClosingPTagsWithNewline(value));
  //     setErrorMessage("");
  //   } else {
  //     setErrorMessage("You cannot change the variable placeholders in the body.");
  //   }
  // };

  // Additional Sam New Change

  // const addheaderVariable = (position) => {
  //   if (headerVariable.length < 1) {
  //     const newIndex = headerVariable.length + 1;
  //     if (!headContent.includes(`{{${newIndex}}}`)) {
  //       setHeadContent((prev) => {
  //         const newHeadContent = prev + `{{${newIndex}}}`;
  //         return newHeadContent;
  //       });

  //       setHeaderVariable((prev) => [
  //         ...prev.slice(0, position),
  //         `{{${newIndex}}}`,
  //         ...prev.slice(position),
  //       ]);
  //       setErrorMessage("");
  //       setRemoveHeaderButtonEnabled(true);
  //     } else {
  //       setErrorMessage(`Variable {${newIndex}} already exists in the header.`);
  //     }
  //   } else {
  //     setErrorMessage("You can only add one header variable.");
  //   }
  // };

  

 //function to handle body change
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

  // const handleHeadChange = (value) => {
  //   const placeholders = headerVariable.map((_, index) => `{{${index + 1}}}`);
  //   const isValid = placeholders.every((placeholder) =>
  //     value.includes(placeholder)
  //   );

  //   if (isValid) {
  //     setHeadContent(value.replace(/\s\s+/g, " "));
  //     setErrorMessage("");
  //   } else {
  //     setErrorMessage(
  //       "You cannot change the variable placeholders in the header."
  //     );
  //   }
  // };



  

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
        type: buttonType,
        text: buttonText || buttonType,
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

  // const removeHeaderVariable = (index) => {
  //   if (headerVariable.length > 1) {
  //     setHeaderVariable((prev) => prev.filter((_, i) => i !== index));
  //     setRemoveHeaderButtonEnabled(true); // Enable the remove button
  //     var value = headerTextCount;
  //     setheaderTextCount(value - 1);
  //   } else {
  //     setRemoveHeaderButtonEnabled(false); // Disable the remove button
  //   }
  // };

  // const removeButtonFromPreview = (index) => {
  //   var totalcount = TotalButtonCount;
  //   setTotalButtonCount(totalcount - 1);
  //   setMessagePreview((prev) => ({
  //     ...prev,
  //     buttons: prev.buttons.filter((_, i) => i !== index),
  //   }));

  //   if (messagePreview.buttons[index].type === "2") {
  //     setCallPhoneNumberButtonCount(callPhoneNumberButtonCount - 1);
  //   }
  // };

  const handleSenderChange = (e) => {
    const role = e.target.value;
    setSelectedSenderId(role);
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

  // useEffect(() => {
  //   if (bodyFinalContent) {
  //     let formattedContentBody = bodyFinalContent?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  //     formattedContentBody = formattedContentBody.replace(/\*(.*?)\*/g, '<em>$1</em>');
  //     formattedContentBody = formattedContentBody.replace(/~(.*?)~/g, '<sub>$1</sub>');
  //     setMessagePreview((prev) => ({
  //       ...prev,
  //       body: formattedContentBody,
  //     }));
  //   }
  // }, [bodyFinalContent]);
  
  useEffect(() => {
    let updatedBody = bodyFinalContent;

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
  }, [bodyFinalContent]);

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
            md={6}
            lg={7}
            className=" Updatetemplete-leftsection"
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

            <label className="block mb-1 mt-1">Template type</label>
            <TemplateCategoryDropdown
              name="templatetype"
              value={Templatetype}
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
                templateName: template.templateName,
                headerType: template.headerType,
                headerContent: template.headerText,
                headerMedia: null,
                body: "",
                footer: template.footerText,
                senderId: template.senderId,
                buttons: [],
                variables: [],
                headerVariable: [],
                bodyValues: [],
                buttonValues: [],
              }}
              //onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                
                return (
                  <Form>
                    <div style={{ background: "#fff" }}>
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
                    <div style={{ background: "#fff" }}>
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
                              body={false}
                              existingContent={updatedheadvercontent}
                              showaddvarbutton={false}
                            />
                            {/* <ReactQuill
                              value={headContent}
                              onChange={handleHeadChange}
                              modules={{
                                toolbar: [
                                  ['bold', 'underline'],
                                  ['clean'],
                                ],
                              }}
                              placeholder="Message body"

                            />
                            <Button onClick={addheaderVariable} className="mt-0 uniform_btn">
                              + Add Variable
                            </Button> */}
                          </FormGroup>
                        )}
                        {/* {console.log("Value Mania", ["2", "3", "4"].includes(values.headerType))} */}
                        {["2", "3", "4"].includes(values.headerType) && (
                          <>
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
                            {/* New Button for Changing Media */}
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
                                <Media
                                  isPopup={true}
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
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <FormGroup>
                        <Label for="body" className="text-sm font-semibold">
                          Body
                        </Label>
                        <div style={{ position: "relative" }}>
                          {/* <ReactQuill
                          value={bodyContent}
                          onChange={handleBodyChange}
                          modules={{
                            toolbar: [
                              ['bold', 'underline'],
                              ['clean'],
                            ],
                          }}
                          formats={['bold', 'underline', 'clean']} // Limit formats to avoid block tags
                          placeholder="Message body"
                        /> */}
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
                            showaddvarbutton={false}
                          />
                        </div>
                        {errorMessage && (
                          <Alert color="danger" className="mt-2">
                            {errorMessage}
                          </Alert>
                        )}
                      </FormGroup>
                      {/* <Button onClick={addVariable} className="mt-0 uniform_btn">
                      + Add Variable
                    </Button> */}
                    </div>
                    {/* {variables.map((variable, index) => (
                      <FormGroup key={index}>
                        <Label>{`Sample Value for {${index + 1}}`}</Label>
                        <Row>
                          <Col>
                            <Input
                              className="w-90"
                              type="text"
                              value={variable}
                              onChange={(e) => handleVariableChange(index, e.target.value)}
                              placeholder={`Enter sample  value for {${index + 1}}`}
                            />
                          </Col>
                          <Col>
                            <FaTimes
                              key={index}
                              onClick={() => removeVariable(index)} // Pass the correct index
                              style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
                            />
                          </Col>
                        </Row>
                      </FormGroup>
                    ))} */}

                    <div>
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
                      {/* <Dropdown
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
                      </Dropdown> */}
                    </div>
                    <Label for="footer" className="text-sm font-semibold">
                          Buttons
                        </Label>
                    {messagePreview.buttons.map((button, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center my-3"
                      >
                        {/* Button Text Input */}
                        <Input
                          type="text"
                          value={button.text }
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
                        {button.type === "1" ||
                          (button.type === 1 && (
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
                          ))}

                        {/* Type 2: Phone Number Input */}
                        {button.type === "2" ||
                          (button.type === 2 && (
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
                          ))}

                        {/* Type 3: Website URL Input */}
                        {button.type === "3" ||
                          (button.type === 3 && (
                            <>
                              <div className="d-flex flex-column me-2">
                                {/* Website URL Input */}
                                <div className="d-flex">
                                  <Input
                                    type="text"
                                    value={button.url}
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
                                  {/* <Button
                                    onClick={() => loadurlVariables(index)}
                                    className="mt-0 mr-2 bg-transparent border-0"
                                    style={{ minWidth: "max-content" }}
                                  >
                                    <span className="text-primary">
                                      + Load Variable
                                    </span>
                                  </Button> */}
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
                                      {/* <Col xs="auto">
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
                                      </Col> */}
                                    </Row>
                                  </div>
                                )}
                              </div>
                            </>
                          ))}

                        {/* Remove Button */}
                        {/* <Button
                          onClick={() => removeButtonFromPreview(index)}
                          color="danger"
                          className="h-10 w-10 ml-1"
                        >
                          <FaRegTrashCan />
                        </Button> */}
                      </div>
                    ))}

                    <div className="w-full flex justify-end gap-3">
                      <Button
                        className="uniform_btn_Cancel "
                        onClick={handelCancel}
                      >
                        Cancel
                      </Button>
                      {/* <Button
                        className="uniform_btn  "
                        onClick={() => handleSubmit(values)}
                      >
                        Submit
                      </Button> */}
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
            className="h-screen right-10 Updatetemplete_chatSection "
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
                className="mb-1 p-3 "
                style={{ maxWidth: "600px", margin: "auto" }}
              >
                Template Preview
              </h4>
            </div>
            <div
              className="border p-3 rounded"
              style={{
                // maxHeight: "700px",
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

export default TemplateUpdatePage;
