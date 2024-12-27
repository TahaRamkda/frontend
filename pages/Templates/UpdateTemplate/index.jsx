import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Formik, Field,useFormikContext } from "formik";
import { Form, FormGroup, Label, Input, Container, Row, Col, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert } from "reactstrap";
//import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaTimes } from 'react-icons/fa';
import { FaRegTrashCan } from "react-icons/fa6";
import { createTemplates, clearTemplateCreateState } from "@/slices/TemplateSlice";
import { updateTemplates ,fetchTemplatesById,clearTemplateDetailState} from "@/slices/TemplateSlice";
import showSweetAlert from "@/components/Sweetalert";
import defaultimage from '@/public/images/12.jpg';
import bagroundimage from '@/public/images/baground.jpg';
import Media from "@/pages/Media/MediaList";
import Sendernames from "@/components/Dropdowns/SendernameDropdown"
import App from "@/components/App";
import ButtonAction from "../ButtonAction";
import moment from "moment";
import CustomMagicEditor from "@/components/CustomMagicEditor";
import { BASE_URL } from "@/utils/apiConstants";
import Loader from "@/components/Loader";
import { useRecoilValue } from 'recoil';
import { TemplateState } from '@/components/recoil';
import MonitorFormikContext from "@/components/monitorformikcontext";
// import CustomEditor from "@/components/CustomEditor/CustomEditor";
const CustomEditor = dynamic(() => import('../../../components/CustomEditor/CustomEditor'), { ssr: false });
const TemplateUpdatePage = () => {
  
    const Template_Id = useRecoilValue(TemplateState);
  const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
  const router = useRouter();
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(true);
  
  const { template, loading, error } = useSelector((state) => state.templates);
  const stripHtml = (input) => input.replace(/<[^>]*>/g, '');
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
  const [actionType, setActionType] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [buttonindex, setbuttonindex] = useState(0);
  const [headerPayloadDatawithVar, setheaderPayloaddatawithVar] = useState("");
  const [bodyPayloadDatawithVar, setBodyPayloadDatawithVar] = useState("");
  const [removeHeaderButtonEnabled, setRemoveHeaderButtonEnabled] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [updatedvercontent, setupdatedvercontent] = useState("");
  const [updatedheadvercontent, setupdatedheadvercontent] = useState("");
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const replaceClosingPTagsWithNewline = (content) => {
    return content?.replace(/<\/p>/gi, '\n ').replace(/<p.*?>/gi, '').replace(/\n /g, '\n  ');
  };

  const togglePopup = () => setshowaction(!showaction);

  console.log("!@#$%^&", bodyFinalContent)


  useEffect(() => {
    if (Template_Id) {
      setLoading(true);
      dispatch(fetchTemplatesById({
        ClientId: localStorage.getItem("clientId"),
        templateId: Template_Id,
      }))
        .then(response => {
          setTemplate(response); // Assuming response is the template object
        })
        .catch(error => {
          console.error("Error fetching template:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, Template_Id]);

  // Handle template updates once it has been fetched (Second useEffect)
  useEffect(() => {
    if (Loading || !template) return; // Wait for the data to be loaded
    
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
      setupdatedheadvercontent(template.headerText);
      setheaderTextCount(template.headerParamCount);

      if (template.headerValue) {
        setHeaderVariable([template.headerValue]);
        template.headerValue.forEach((variable, i) => {
          if (variable?.defaultValue !== undefined) {
            handleheaderVariableChange(i, variable.defaultValue);
          }
        });
      }
    } else {
      setSelectedMediaId(template.mediaId);
      setSelectedMediaPath(template.mediaURL);
      setSelectedMediaType(template.contentType);
    }

    // Update Body
    setupdatedvercontent(template.bodyText);
    setbodyTextCount(template.bodyParamCount);

    if (template.bodyValues) {
      setVariables(template.bodyValues);
      template.bodyValues.forEach((variable, i) => {
        if (variable?.defaultValue !== undefined) {
          handleVariableChange(i, variable.defaultValue);
        }
      });
    }

    setSelectedSenderId(template.senderId);
    setTotalButtonCount(updatedMessagePreview.buttons.length);

    setMessagePreview(updatedMessagePreview);

    // Clear Template Detail State
    clearTemplateDetailState();
    
  }, [Loading, template]); 
  

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
        ...data,  // Update the button with the new data
      };

      return {
        ...prev,
        buttons: updatedButtons
      };
    });
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

      clientId: localStorage.getItem("clientId"),
      name: values.templateName,
      Id: Template_Id,
      transactionType: 1,
      category: "marketing",
      language: "en",
      senderNameId: selectedSenderId,
      status: "Pending",
      subCategory: "marketing",
      isApproved: false,
      mediaId: selectedMediaId,
      templateType: 1,
      actionBy: localStorage.getItem("userId"),
      header: {
        format: values.headerType,
        text: finalHeaderReplace,
        textCount: headerTextCount,
        values: headerVariable.map((value, index) => ({
          value: value,
          defaultValue: value,
          index: index + 1,
        })),
      },
      body: {
        // text: trimmedBodyContent,
        text: bodyfinalReplace,
        textCount: bodyTextCount,
        values: variables.map((value, index) => ({
          value: value,
          defaultValue: value,
          index: index + 1,
        })),
      },
      footer: {
        //text: messagePreview.footer,
        text: messagePreview.footer,
      },
      buttons: messagePreview.buttons.map((button, index) => ({
        type: button.type,
        text: button.text,
        phoneNumber: button.phoneNumber,
        textCount: button.textCount,
        index: index,
        url: button.websiteUrl,
        values: urlvariables.map((value, index) => ({
          value: value,
          defaultValue: value,
          index: index + 1,
        })),
        actionId: button.actionId,
        actionType: button.actiontype,
        buttonId: button.buttonValue,

      })),

    };

    //console.log("TimingData", requestBody)

    try {
      const response = await dispatch(updateTemplates(requestBody)).unwrap();
      if (response.success) {
        debugger
        clearTemplateCreateState();
        showSweetAlert({
          title: "Updated Successfully",
          text:  "",
          icon: "success",
        });
        router.push('/Templates/Templateslist');
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
    updatedBody = updatedBody?.replace(/\n/g, '<br/>'); // Convert newlines to <br/> tags for HTML rendering

    // Replace <p> tags only if necessary, and ensure newlines are handled correctly
    updatedBody = updatedBody?.replace(/<\/p>/gi, '<br/>').replace(/<p.*?>/gi, '');

    // Update the message preview body content
    setMessagePreview((prev) => ({
      ...prev,
      body: updatedBody, // HTML safe body with <br/> tags and replaced variables
    }));
  }, [bodyFinalContent, variables]);


  const addVariable = (mineIndex) => {
    // const newIndex = variables.length + 1;
    console.log("MineIndex", mineIndex);
    if (!bodyFinalContent.includes(`{{${mineIndex}}}`)) {
      const html = bodyFinalContent
      //.replace(/<p[^>]*>/g, '') // Remove opening <p> tags
      // .replace(/<\/p>/g, '<br />'); // Replace closing </p> tags with <br />
      //.replace(/<br\s*\/?>/g, ''); // Remove existing <br /> tag
      var a = `${html}{{${mineIndex}}}`;
      console.log(a);
      var value = bodyTextCount;
      setbodyTextCount(value + 1);
      setBodyContent(a);
      setVariables((prev) => [...prev, ""]);
      setErrorMessage("");
    } else {
      setErrorMessage(`Variable {${mineIndex}} already exists in the body.`);
    }
  };


  const addURLVariable = () => {
    const newIndex = urlvariables.length + 1;
    if (!websiteUrl.includes(`{{${newIndex}}}`)) {
      const html = websiteUrl
      //.replace(/<p[^>]*>/g, '') // Remove opening <p> tags
      // .replace(/<\/p>/g, '<br />'); // Replace closing </p> tags with <br />
      //.replace(/<br\s*\/?>/g, ''); // Remove existing <br /> tag
      var a = `${html}{{${newIndex}}}`;
      var value = bodyTextCount;
      //setbodyTextCount(value+1);
      setwebsiteUrl(a);
      // alert(websiteUrl);
      seturlvariables((prev) => [...prev, ""]);
      setErrorMessage("");
    } else {
      setErrorMessage(`Variable {${newIndex}} already exists in the body.`);
    }
  };
  useEffect(() => {
    setMessagePreview((prev) => ({
      ...prev,
      header: headContent.replace(/\{{(\d+)\}}/g, (match, index) => headerVariable[index - 1]).replace(/\n/g, "<br />"),
    }));
  }, [headContent, headerVariable]);

  const removeVariable = (index) => {
   
    const updatedVariables = variables.filter((_, i) => i !== index);
    const updatedBodyContent = bodyPayloadDatawithVar.replace(`{{${index + 1}}}`, "").replace(/\s\s+/g, " ");
    var value = bodyTextCount;
    setbodyTextCount(value - 1);
    setVariables(updatedVariables);
    setupdatedvercontent(updatedBodyContent);
  };

  const handleVariableChange = (index, value) => {
    setVariables((prev) => {
      const newVariables = [...prev];
      newVariables[index] = value;
      return newVariables;
    });
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


  const addheaderVariable = (position) => {
    if (headerVariable.length < 1) {
      const newIndex = headerVariable.length + 1;
      if (!headContent.includes(`{{${newIndex}}}`)) {
        setHeadContent((prev) => {
          const newHeadContent = prev + `{{${newIndex}}}`;
          return newHeadContent;
        });

        setHeaderVariable((prev) => [
          ...prev.slice(0, position),
          `{{${newIndex}}}`,
          ...prev.slice(position),
        ]);
        setErrorMessage("");
        setRemoveHeaderButtonEnabled(true);
      } else {
        setErrorMessage(`Variable {${newIndex}} already exists in the header.`);
      }
    } else {
      setErrorMessage("You can only add one header variable.");
    }
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
    const isValid = placeholders.every((placeholder) => value.includes(placeholder));

    if (!isValid) {
      setErrorMessage('You cannot change the variable placeholders in the body.');
    } else {
      setErrorMessage('');
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
    const isValid = placeholders.every((placeholder) => value.includes(placeholder));

    if (isValid) {
      setHeadContent(value.replace(/\s\s+/g, " "));
      setErrorMessage("");
    } else {
      setErrorMessage("You cannot change the variable placeholders in the header.");
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
    seturlvariables((prev) => {
      const newurlVariable = [...prev];
      newurlVariable[index] = value;
      return newurlVariable;
    });
  };

  const handleButtonSelect = (type) => {
    if (type === "2" && callPhoneNumberButtonCount >= 1) {
      setButtonType(null);
      setPhoneNumber("");
      setCountryCode("KW +965");
      setwebsiteUrl("");
    } else if (type === "3" && messagePreview.buttons.filter((button) => button.type === "3").length >= 2) {
      setButtonType(null);
      setButtonText("");
      setwebsiteUrl("");

    } else {
      setButtonType(type);
      setButtonText("");
      setPhoneNumber("");
      setCountryCode("KWD +965");
      setwebsiteUrl("");
      setActionId(" ");
      setActionType(" ");
      if (type === "1") {
        setButtonText(" ");
        setMarketingOptOutAdded(true);
        var totalcount = TotalButtonCount;
        setTotalButtonCount(totalcount + 1);
      } else if (type === "2") {
        setButtonText("Call Phone Number");
        setCallPhoneNumberButtonCount(callPhoneNumberButtonCount + 1);
        var totalcount = TotalButtonCount;
        setTotalButtonCount(totalcount + 1);
      } else if (type === "3") {
        setButtonText("Visit Website");
        setVisitWebsiteButtonCount(messagePreview.buttons.filter((button) => button.type === "3").length + 1);
        var totalcount = TotalButtonCount;
        setTotalButtonCount(totalcount + 1);
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
        phoneNumber: buttonType === "2" ? phoneNumber : null,
        countryCode: buttonType === "2" ? countryCode : null,
        websiteUrl: buttonType === "3" ? websiteUrl : null,
      };

      setMessagePreview((prev) => ({
        ...prev,
        buttons: [...prev.buttons, newButton],
      }));

      // Reset button details
      setButtonType(null);
      setButtonText("");
      setPhoneNumber("");
      setCountryCode("KW +965");
      setwebsiteUrl("");
    }
  }, [buttonType, buttonText]);
  const removeHeaderVariable = (index) => {
    if (headerVariable.length > 1) {
      setHeaderVariable((prev) => prev.filter((_, i) => i !== index));
      setRemoveHeaderButtonEnabled(true); // Enable the remove button
      var value = headerTextCount;
      setheaderTextCount(value - 1);
    } else {
      setRemoveHeaderButtonEnabled(false); // Disable the remove button
    }
  };

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

  const handlebuttonaction = (index) => {
    setbuttonindex(index);
    setshowaction(true);
  };

  useEffect(() => {
    if (finalContent) {
      console.log("MineFinalContent", finalContent);
      let formattedContent = finalContent?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
      formattedContent = formattedContent.replace(/~(.*?)~/g, '<sub>$1</sub>');
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
    variables.forEach((variable, index) => {
      updatedBody = updatedBody.replace(`{{${index + 1}}}`, variable);
    });
    updatedBody = updatedBody.replace(/\n/g, '<br/>'); // Convert newlines to <br/> tags for HTML rendering
  
    // Replace <p> tags only if necessary, and ensure newlines are handled correctly
    updatedBody = updatedBody.replace(/<\/p>/gi, '<br/>').replace(/<p.*?>/gi, '');
    updatedBody = updatedBody  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // for **bold** text
    .replace(/_(.*?)_/g, '<strong>$1</strong>'); // for _bold_ text
  
    updatedBody = updatedBody.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
    updatedBody = updatedBody.replace(/~(.*?)~/g, '<sub>$1</sub>');
  
  
    // Update the message preview body content
    setMessagePreview((prev) => ({
      ...prev,
      body: updatedBody, // HTML safe body with <br/> tags and replaced variables
    }));
  }, [bodyFinalContent, variables]);

  console.log("BodyFinalContent12", bodyContent, finalContent)
  if (Loading) return <App><Loader /></App>; 
  return (
    <App>
      <Container fluid className="mt-0">
       
        <Row style={{ height: "100vh" }}>
          <Col md={7} className="border-end overflow-auto shadow-lg" style={{ padding: '20px', background: "#fff" }}>
            <h4 className="mb-4">Update WhatsApp Template</h4>
            {/* <CustomEditor /> */}
            <label className="block mb-1 mt-1">Sender Names</label>
            <Sendernames name="senderId" value={selectedSenderId} onChange={handleSenderChange} />
            <Formik
              initialValues={{
                templateName: template.templateName,
                headerType: template.headerType,
                headerContent:template.headerText,
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
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
                // useEffect(() => {
                //   const headerText = values.headerType === "1" ? values.headerContent : "";
                //   const footer = values.footer || "";
                //   let media = null;

                //   if (["4", "2", "3",2,3,4].includes(values.headerType)) {
                //     media = values.headerMedia || defaultimage.src;
                //   }

                //   setMessagePreview((prev) => ({
                //     ...prev,
                //     header: headerText,
                //     footer: footer,
                //     media: media,
                //   }));
                // }, [values]);

                return (
                  <Form  >
                    <div style={{ background: "#fff" }} className="p-2 px-3 rounded border-1 shadow-sm">
                    <FormGroup>
  <Label for="templateName" className="font-semibold text-sm mb-0">
    Template Name
  </Label>
  <Field
  as={Input}
  type="text"
  name="templateName"
  id="templateName"
  onChange={(e) => {
    const value = e.target.value
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .toLowerCase();
    setFieldValue('templateName', value); // Update Formik's state
  }}
/>

</FormGroup>
                    </div>
                    <div style={{ background: "#fff" }} className="mt-3 p-2 px-3 rounded border-1 shadow-sm">
                      <FormGroup>
                        <Label for="headerType" className="font-semibold text-sm mb-0">Header Type</Label>
                        <Field as={Input} type="select" name="headerType" className="form-control" style={{ height: "46px" }}>
                          {["none", "text", "image", "video", "document"].map((type, index) => (
                            <option key={type} value={index === 0 ? 0 : index}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </Field>
                      </FormGroup>
                      <div>
                      {(values.headerType === 1 || values.headerType === "1") && (
                          <FormGroup>
                            <Label for="headerContent" className="font-semibold text-sm mb-0">Header Content</Label>
                            <CustomMagicEditor errorMessage={errorMessage} variables={variables} setheaderPayloaddatawithVar={setheaderPayloaddatawithVar} onFunction={addheaderVariable} headerVariable={headerVariable} handleheaderVariableChange={handleheaderVariableChange} removeHeaderVariable={removeHeaderVariable} setHeaderVariable={setHeaderVariable} headContent={headContent} setFinalContent={setFinalContent} body={false} existingContent={updatedheadvercontent} />
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
      isPopup={["2", "3", "4"].includes(values.headerType)}
      onSelectMedia={(mediaId, mediaPath, mimeType) => {
        setSelectedMediaId(mediaId);
        setSelectedMediaPath(mediaPath);
        setSelectedMediaType(mimeType);
      }}
    />
  </>
)}
                      </div>
                    </div>


                    <div className="border-1 rounded p-2 px-3 mt-2 shadow-sm">
                      <FormGroup>
                        <Label for="body" className="text-sm font-semibold">Body</Label>
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
                          <CustomMagicEditor errorMessage={errorMessage} variables={variables} setBodyPayloadDatawithVar={setBodyPayloadDatawithVar} setBodyFinalContent={setBodyFinalContent} handleVariableChange={handleVariableChange} addVariable={addVariable} handleBodyChange={handleBodyChange} removeVariable={removeVariable} body={true} existingBodyContent={updatedvercontent}/>
                        </div>
                        {errorMessage && <Alert color="danger" className="mt-2">{errorMessage}</Alert>}
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

                    <div className="border-1 rounded p-2 px-3 mt-3">
                      <FormGroup>
                        <Label for="footer" className="text-sm font-semibold">Footer</Label>
                        <Field as={Input} name="footer" placeholder="Add footer text" className="form-control" />
                      </FormGroup>
                      {/* Button dropdown */}
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="mt-3">
                        <div className="flex">
                          <DropdownToggle caret color="gray" className=" border-1">
                            + Add button
                          </DropdownToggle>
                        </div>
                        <DropdownMenu>
                          <DropdownItem header className="fw-bold">Quick reply buttons</DropdownItem>
                          <DropdownItem onClick={() => handleButtonSelect("1")}>
                            Quick Reply
                            <small className="text-muted d-block">Recommended</small>
                          </DropdownItem>
                          <DropdownItem header className="fw-bold">Call-To-Action buttons</DropdownItem>
                          <DropdownItem onClick={() => handleButtonSelect("2")}>
                            Call Phone Number
                            <small className="text-muted d-block">1 button maximum</small>
                          </DropdownItem>
                          <DropdownItem onClick={() => handleButtonSelect("3")}>
                            Visit website
                            <small className="text-muted d-block">2 button maximum</small>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>


                    {messagePreview.buttons.map((button, index) => (
                      <div key={index} className="d-flex align-items-center my-3">
                        <Input
                          type="text"
                          value={button.text}
                          placeholder="Button Text"
                          onChange={(e) => {
                            const updatedButtons = [...messagePreview.buttons];
                            updatedButtons[index].text = e.target.value;
                            setMessagePreview({ ...messagePreview, buttons: updatedButtons });
                          }}

                          className="me-2"
                        />
                        {(button.type === "1" || button.type === 1) && (
                          <Button
                            style={{ backgroundColor: "grey", borderColor: "green", color: "white" }}
                            className="me-2"
                            onClick={() => handlebuttonaction(index)}
                          >
                            <i className="fa fa-bolt"></i>
                          </Button>
                        )}

                        {button.type === "2" && (
                          <div className="d-flex me-2">
                            <Input
                              type="select"
                              value={button.countryCode}
                              onChange={(e) => {
                                const updatedButtons = [...messagePreview.buttons];
                                updatedButtons[index].countryCode = e.target.value;
                                setMessagePreview({ ...messagePreview, buttons: updatedButtons });
                              }}
                              className="mr-2"
                              style={{ minWidth: "120px" }}
                            >
                              <option value="KW +965">KW +965</option>
                              <option value="US +1">US +1</option>
                              <option value="IN +91">IN +91</option>
                            </Input>
                            <Input
                              type="text"
                              value={button.phoneNumber}
                              placeholder="Phone Number"
                              onChange={(e) => {
                                const updatedButtons = [...messagePreview.buttons];
                                updatedButtons[index].phoneNumber = e.target.value;
                                setMessagePreview({ ...messagePreview, buttons: updatedButtons });
                              }}
                              className="me-2"
                              style={{ minWidth: "220px" }}
                            />

                          </div>
                        )}

                        {button.type === "3" && (
                          <>

                            <Input
                              type="text"
                              value={websiteUrl}
                              placeholder="Website URL"
                              onChange={(e) => {
                                const updatedButtons = [...messagePreview.buttons];
                                updatedButtons[index].websiteUrl = e.target.value;
                                setwebsiteUrl(e.target.value)
                                setMessagePreview({ ...messagePreview, buttons: updatedButtons });
                              }}
                              className="me-2"
                            />
                            <Button onClick={addURLVariable} disabled={urlvariables?.length === 1} className="mt-0 mr-2 bg-transparent border-0" style={{ minWidth: "max-content" }}>
                              <span className="">+ Add Variable</span>
                            </Button>

                          </>
                        )}
                        <Button onClick={() => removeButtonFromPreview(index)} color="danger" className="h-10 w-10">
                          <FaRegTrashCan />
                        </Button>
                      </div>
                    ))}
                    {urlvariables.map((variable, index) => (
                      <FormGroup key={index}>
                        <Label>{`Sample Value for {${index + 1}}`}</Label>
                        <Row>
                          <Col>
                            <Input
                              className="w-90"
                              type="text"
                              value={variable}
                              onChange={(e) => handleurlVariableChange(index, e.target.value)}
                              placeholder={`Enter Sample  value for {${index + 1}}`}
                            />
                          </Col>
                          <Col>
                            <div className="border-1 flex items-center justify-center rounded" style={{ height: "46px", width: "38px", background: "#e1e1e1" }}>
                              <FaTimes
                                key={index}
                                onClick={() => {
                                  removeHeaderVariable(index);
                                  setHeaderVariable(headerVariable.filter((_, i) => i !== index));
                                }}
                                style={{ cursor: "pointer", color: "red" }}
                              />
                            </div>
                          </Col>
                        </Row>
                      </FormGroup>
                    ))}
                    <div className="w-full text-end">
                    <Button className="uniform_btn mt-4 " onClick={() => handleSubmit(values)}>
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

          <Col md={5} className="overflow-auto" style={{ padding: '20px' }}>
            <div>
              <h4 className="mb-1 bg-light p-3 shadow-sm" style={{ maxWidth: "600px", margin: "auto" }}>Template Preview</h4>
            </div>
            <div className="border p-3 rounded" style={{
              height: "auto",
              minHeight: "420px",
              backgroundColor: "#e0e0e0",
              backgroundImage: `url(${bagroundimage.src})`, // Update this path
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              maxWidth: '600px',  // Increased width of preview container
              margin: '0 auto',
              padding: '5px'  // Optional: Adjust padding for more space inside the preview container
            }}>
              <div className="chat_bubble" style={{
                position: "relative",
                backgroundColor: '#f7f7f7',
                borderRadius: '5px',
                padding: '20px 10px',
                wordWrap: 'break-word',
                marginBottom: '10px',
                maxWidth: '400px', // Message body width stays the same
                marginRight: '0',    // Remove any margin from the right side
              }}>
                <span className="time_bubble">{moment(new Date()).format('LT')}</span>
                {messagePreview.media && selectedMediaType.startsWith("image/") && (
                 //alert(selectedMediaPath),
                  <img
                    src={`${BASE_URL}${selectedMediaPath}`}
                    alt="Media"
                    className="img-fluid"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      marginBottom: '5px'
                    }}
                  />
                )}
                {messagePreview.media && selectedMediaType.startsWith("video/") && (
                  <video
                    src={`${BASE_URL}${selectedMediaPath}`}
                    autoPlay
                    muted
                    loop
                    className="img-fluid"
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      marginBottom: '10px'
                    }}
                  />
                )}

                {messagePreview.media && selectedMediaType.startsWith("audio/") && (
                  <audio
                    src={`${BASE_URL}${selectedMediaPath}`}
                    controls
                    controlsList="nodownload"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      marginBottom: '10px'
                    }}
                  />
                )}

                {messagePreview.header && <h6 style={{ marginBottom: '5px' }} dangerouslySetInnerHTML={{ __html: messagePreview.header }} />}
                <div dangerouslySetInnerHTML={{ __html: messagePreview.body }} />
                {messagePreview.footer && <p style={{ marginTop: '5px', fontSize: '0.9em' }}>{messagePreview.footer}</p>}

                {(Showallbutton || TotalButtonCount <= 3) && messagePreview.buttons.map((button, index) => (
                  <Button
                    key={index}
                    className="w-100 mb-2"
                    style={{
                      color: "#00a9ee",
                      backgroundColor: '#ffffff',
                      borderColor: '#ffffff',
                      borderStyle: 'solid',
                      borderWidth: '1px 1px 1px 1px',
                      borderTopWidth: '0.5px',
                      borderTopStyle: 'solid',
                      borderTopColor: '#e1e1e1'
                    }}
                  >
                     {button.type == 1 && (
              <span style={{ color: '#00a9ee' }}>
                <i className="fa fa-share fa-flip-horizontal me-2"></i>

                {button.text || "Button"}
              </span>
            )}
            {button.type == 2 && (
              <span style={{ color: '#00a9ee' }}>
                <i className="fa fa-phone me-2"></i>
                {button.text || "Button"}
              </span>
            )}
            {button.type == 3 && (
              <span style={{ color: '#00a9ee' }}>
                <i className="fa fa-external-link me-2"></i>
                {button.text || "Button"}
              </span>
            )}
                  </Button>
                ))}
                {TotalButtonCount > 3 && (
                  <Button
                    className="w-100 mb-2"
                    style={{
                      color: "#00a9ee",
                      backgroundColor: '#ffffff',
                      borderColor: '#ffffff',
                      borderStyle: 'solid',
                      borderWidth: '1px 1px 1px 1px',
                      borderTopWidth: '0.5px',
                      borderTopStyle: 'solid',
                      borderTopColor: '#e1e1e1'
                    }}
                    onClick={() => setShowallbutton(!Showallbutton)}
                  > <i className="fa fa-list"></i>
                    <span style={{ color: '#00a9ee' }}>See all options</span>
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
      />

    </App>

  );
};

export default TemplateUpdatePage;
