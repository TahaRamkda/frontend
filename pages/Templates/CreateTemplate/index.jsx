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
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  createTemplates,
  clearTemplateCreateState,
} from "@/slices/TemplateSlice";
import showSweetAlert from "@/components/Sweetalert";
import defaultimage from "@/public/images/12.jpg";
import bagroundimage from "@/public/images/baground.jpg";
import Media from "@/pages/Media/MediaList";
import Sendernames from "@/components/Dropdowns/SendernameDropdown";
import App from "@/components/App";
import ButtonAction from "../ButtonAction";
import moment from "moment";
import CustomMagicEditor from "@/components/CustomMagicEditor";
import { BASE_URL } from "@/utils/apiConstants";
import ClientDropdown from "@/components/Dropdowns/ClientDropdown";
import { set } from "date-fns";
import Loader from "@/components/Loader";
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

  const { loading, error } = useSelector((state) => state.templates);
  const [bodyContent, setBodyContent] = useState("");
  const [variables, setVariables] = useState([]);
  const [urlvariables, seturlvariables] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [buttonType, setButtonType] = useState(null);
  const [buttonText, setButtonText] = useState("");
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

  // useEffect(() => {
  //   const result = headerPayloadDatawithVar.replace(/\*\*/g, "+");
  //   const subresult = result.replace(/\*/g, "`");
  //   const supresult = subresult.replace(/<sub>.*?<\/sub>/g, "~");
  //   const replaceX = supresult.replace(/`/g, "_");
  //   const finalHeaderReplace = replaceX.replace(/\+/g, "*");

  //   console.log("UseEffectResult", finalReplace);
  // }, [headerPayloadDatawithVar]);

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
      transactionType: 1,
      category: Templatetype,
      language: language,
      senderNameId: selectedSenderId,
      status: "PENDING",
      subCategory: Templatetype,
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
        phoneNumber: `${button.countryCode}${button.phoneNumber}`,
        textCount: button.textCount,
        index: index,
        url: button.websiteUrl,
        values: {
          value: button.urlveriablevalue,
          defaultValue: button.urlveriablevalue,
          index: button.urlverindex,
        },
        actionId: button.actionId,
        actionType: button.actiontype,
        buttonId: button.buttonValue,
      })),
    };

    //console.log("TimingData", requestBody)

    try {
      const isValid = variables.every((value, index) => {
        // Check both conditions for variables and headerVariable
        if (
          (value.includes(`{{${index + 1}}}`) && value.trim() === "") || // Check condition for variable
          (headerVariable[index] &&
            headerVariable[index].includes(`{{${index + 1}}}`) &&
            headerVariable[index].trim() === "") // Check condition for headerVariable
        ) {
          return false; // Break validation for this item
        }
        return true; // Validation passed for this item
      });

      if (!isValid) {
        alert(`Value is required for placeholder {{${index + 1}}}`);
        return null;
      } else {
      }
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

  const addURLVariable = (index) => {
   
    const newIndex = 1;

    const updatedButtons = [...messagePreview.buttons];

    if (!updatedButtons[index].websiteUrl.includes(`{{1}}`)) {
      const html = updatedButtons[index].websiteUrl;
      //.replace(/<p[^>]*>/g, '') // Remove opening <p> tags
      // .replace(/<\/p>/g, '<br />'); // Replace closing </p> tags with <br />
      //.replace(/<br\s*\/?>/g, ''); // Remove existing <br /> tag
      var a = `${html}{{${newIndex}}}`;
      var value = bodyTextCount;
      //setbodyTextCount(value+1);
      updatedButtons[index].websiteUrl = a;
      updatedButtons[index].urlveriable = "";
      updatedButtons[index].urlveriablevalue = "";
      updatedButtons[index].urlverindex = newIndex;
      //setwebsiteUrl(e.target.value)
      setMessagePreview({ ...messagePreview, buttons: updatedButtons });
      //setwebsiteUrl(a);
      // alert(websiteUrl);
      //seturlvariables((prev) => [...prev, ""]);
      setErrorMessage("");
    } else {
      setErrorMessage(`Variable {${newIndex}} already exists in the body.`);
    }
  };

  const removeWebsiteVariable = (index) => {
    const updatedButtons = [...messagePreview.buttons];

    // Check if the variable exists in the URL
    if (
      updatedButtons[index].websiteUrl.includes(
        `{{${updatedButtons[index].urlverindex}}}`
      )
    ) {
      // Remove the variable from the website URL
      updatedButtons[index].websiteUrl = updatedButtons[
        index
      ].websiteUrl.replace(`{{${updatedButtons[index].urlverindex}}}`, "");
      delete updatedButtons[index].urlveriable;
      delete updatedButtons[index].urlveriablevalue;
      delete updatedButtons[index].urlverind;

      // Update the state
      setMessagePreview({ ...messagePreview, buttons: updatedButtons });
      setErrorMessage(""); // Clear any existing error messages
    } else {
      setErrorMessage(
        `Variable {${updatedButtons[index].urlverindex}} does not exist in the URL.`
      );
    }
  };

  useEffect(() => {
    setMessagePreview((prev) => ({
      ...prev,
      header: headContent
        .replace(/\{{(\d+)\}}/g, (match, index) => headerVariable[index - 1])
        .replace(/\n/g, "<br />"),
    }));
  }, [headContent, headerVariable]);

  const removeVariable = (indexToRemove) => {
    // Remove the variable at the specified index
    const updatedVariables = variables.filter((_, i) => i !== indexToRemove);

    // Update the body content by renumbering the remaining variables
    let updatedBodyContent = bodyPayloadDatawithVar;

    // Replace each old variable index with its new index in the body content
    updatedVariables.forEach((variable, i) => {
      const oldIndex = parseInt(variable.match(/\d+/)[0], 10); // Extract old index
      const newVariable = `{{${i + 1}}}`;
      updatedBodyContent = updatedBodyContent.replace(
        `{{${oldIndex}}}`,
        newVariable
      );
    });

    // Remove the variable being deleted from the body content
    const variableToRemove = `{{${indexToRemove + 1}}}`;
    updatedBodyContent = updatedBodyContent
      .replace(variableToRemove, "")
      .replace(/\s\s+/g, " ");

    // Update state
    setVariables(updatedVariables.map((_, i) => `{{${i + 1}}}`)); // Adjust indices in variables
    setupdatedvercontent(updatedBodyContent.trim());
    setbodyTextCount(updatedVariables.length); // Update text count
  };

  const removeHeaderVariable = (index) => {
    debugger
    //alert(bodyPayloadDatawithVar)
    const updatedVariables = headerVariable.filter((_, i) => i !== index);
    const updatedHeadContent = headerPayloadDatawithVar
      .replace(`{{${index + 1}}}`, "")
      .replace(/\s\s+/g, " ");
    var value = headerTextCount;
    setheaderTextCount(value - 1);
    setHeaderVariable(updatedVariables);
    setupdatedheadvercontent(updatedHeadContent);
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
          setheaderTextCount(headerTextCount + 1);
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
  const addVariable = (mineIndex) => {
    // const newIndex = variables.length + 1;
    console.log("MineIndex", mineIndex);
    if (!bodyFinalContent.includes(`{{${mineIndex}}}`)) {
      const html = bodyFinalContent;
      //.replace(/<p[^>]*>/g, '') // Remove opening <p> tags
      // .replace(/<\/p>/g, '<br />'); // Replace closing </p> tags with <br />
      //.replace(/<br\s*\/?>/g, ''); // Remove existing <br /> tag
      var a = `${html}{{${mineIndex}}}`;
      console.log(a);
      var value = bodyTextCount;
      setbodyTextCount(value + 1);
      setBodyContent(a);
      setVariables((prev) => [...prev, `{{${mineIndex}}}`]);
      setErrorMessage("");
    } else {
      setErrorMessage(`Variable {${mineIndex}} already exists in the body.`);
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
  const handelCancel = () => {
    router.push("/Templates/TemplatesList");
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
        {loading && <Loader />}
        <Row style={{ height: "100vh" }}>
          <Col
            md={7}
            className="border-end overflow-auto shadow-lg"
            style={{ padding: "20px", background: "#fffff" }}
          >
            <h4 className="mb-4">Create Template</h4>
            <label className="block mb-1 mt-1">Sender Names</label>
            <Sendernames
              name="senderId"
              value={selectedSenderId}
              onChange={handleSenderChange}
            />

            <label className="block mb-1 mt-1">Template type</label>
            <TemplateCategoryDropdown
              name="templatetype"
              value={Templatetype}
              onChange={HandleTemplatetypechange}
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
              }}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => {
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
                          }}
                        />
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
                              variables={variables}
                              setheaderPayloaddatawithVar={
                                setheaderPayloaddatawithVar
                              }
                              onFunction={addheaderVariable}
                              headerVariable={headerVariable}
                              handleheaderVariableChange={
                                handleheaderVariableChange
                              }
                              removeHeaderVariable={removeHeaderVariable}
                              setHeaderVariable={setHeaderVariable}
                              headContent={headContent}
                              setFinalContent={setFinalContent}
                              existingContent={updatedheadvercontent}
                              body={false}
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
                            removeVariable={removeVariable}
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
                            onClick={() => handlebuttonaction(index)}
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
                                <Button
                                  onClick={() => addURLVariable(index)}
                                  className="mt-0 mr-2 bg-transparent border-0"
                                  style={{ minWidth: "max-content" }}
                                >
                                  <span className="text-primary">
                                    + Add Variable
                                  </span>
                                </Button>
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
                          className="h-10 w-10"
                        >
                          
                          <FaRegTrashCan />
                        </Button>
                        
                      </div>
                      
                    ))}

                    <div className="w-full flex justify-end gap-3">
                      <Button
                        className="uniform_btn_Cancel mt-4"
                        onClick={handelCancel}
                      >
                        Cancel
                      </Button>
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
            md={4}
            className="overflow-hidden h-screen fixed right-10"
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
      />
    </App>
  );
};

export default TemplateCreationPage;
