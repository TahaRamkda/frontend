import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import {
  Container,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "@/components/Layout/Loader";
import { BASE_URL } from "@/utils/apiConstants";
import {
  fetchTemplateVisualization,
  clearTemplateVisualization,
} from "@/slices/TemplateVisualizationSlice";
import InteractiveTemplateUpdate from "@/pages/InteractiveTemplates/UpdateTemplate";
import UpdateTemplate from "@/pages/Templates/UpdateTemplate";
import UpdateFlowPage from "@/pages/Flows/FlowDetails";
// Action type mappings (unchanged)
import { dropdownOptions } from "@/utils/constants";
import InteractiveTemplateDropdown from "@/components/Dropdowns/InteractiveTemplateDropdown";
import TemplateDropdown from "@/components/Dropdowns/TemplateDropdown";
import App from "@/components/Layout/App";
import showSweetAlert from "@/components/Sweetalert";
import { set } from "date-fns";
// Simulated API data with updated IDs and actionIds
// const fetchTemplateData = async () => {
//   return {
//     flowsVisualization: [
//       // Template 1: Starting template
//       {
//         "id": 22,
//         "clientId": 1,
//         "clientName": "Babji Consult Techies",
//         "senderId": 1,
//         "senderName": "Babji Consult Techies",
//         "templateName": "fl_vs_maintemplate",
//         "category": "MARKETING",
//         "subCategory": null,
//         "language": "en",
//         "status": "PENDING",
//         "isApproved": false,
//         "templateId": "",
//         "headerType": 2,
//         "headerText": "",
//         "headerParamCount": 0,
//         "mediaId": 425,
//         "mediaPath": "/Media/images_(2)_1.jpg",
//         "contentType": "image/jpeg",
//         "fileExtension": ".jpg",
//         "fileName": "images_(2)_1.jpg",
//         "bodyText": "burger King burger\nIndulge in the mouthwatering goodness of Burger King's iconic flame-grilled burgers! Each bite delivers a perfect blend of savory flavors, starting with high-quality beef that’s grilled to perfection for that unmistakable smoky taste. Whether you're craving the classic Whopper stacked high with fresh lettuce, juicy tomatoes, and creamy mayonnaise, or one of their delicious specialty burgers",
//         "bodyParamCount": 0,
//         "footerText": "do it quickly",
//         "buttons": [
//             {
//                 "buttonId": 27,
//                 "buttonText": "Template 1",
//                 "buttonValue": "",
//                 "buttonType": 1,
//                 "sequence": 0,
//                 "actionId": 73,
//                 "actionType": 1,
//                 "systemActionId": null
//             },
//             {
//                 "buttonId": 28,
//                 "buttonText": "Tempalte 2",
//                 "buttonValue": "",
//                 "buttonType": 1,
//                 "sequence": 1,
//                 "actionId": 74,
//                 "actionType": 1,
//                 "systemActionId": null
//             },
//             {
//                 "buttonId": 29,
//                 "buttonText": "Call Phone Number",
//                 "buttonValue": "+91-7297005253",
//                 "buttonType": 2,
//                 "sequence": 2,
//                 "actionId": 0,
//                 "actionType": 0,
//                 "systemActionId": null
//             },

//         ],
//         "parameters": [],
//         "createdBy": 2,
//         "createdDate": "25-Mar-2025 04:58:40 PM",
//         "updatedBy": 2,
//         "updatedDate": "25-Mar-2025 04:58:40 PM"
//     },

//       // Template 2
//       {
//         "interactiveTemplateId": 73,
//         "clientId": 1,
//         "senderId": 1,
//         "templateName": "fl_vs_test_1",
//         "language": "en",
//         "transactionType": 2,
//         "status": 1,
//         "usedByAgent": false,
//         "headerType": 0,
//         "headerParamCount": 0,
//         "headerText": "",
//         "bodyParamCount": 0,
//         "bodyText": "wanna try our new order??",
//         "footerText": "",
//         "mediaId": 0,
//         "mediaPath": null,
//         "contentType": null,
//         "fileName": null,
//         "buttonsJson": "[{\"ButtonId\":150,\"ButtonText\":\"Clicke me\",\"ButtonValue\":\"\",\"ButtonType\":1,\"Sequence\":0,\"ActionId\":77,\"ActionType\":1},{\"ButtonId\":151,\"ButtonText\":\"Unsubscribe\",\"ButtonValue\":\"\",\"ButtonType\":1,\"Sequence\":0,\"ActionId\":0,\"ActionType\":3},{\"ButtonId\":152,\"ButtonText\":\"Block\",\"ButtonValue\":\"\",\"ButtonType\":1,\"Sequence\":0,\"ActionId\":0,\"ActionType\":4}]",
//         "parametersJson": null,
//         "buttons": [
//             {
//                 "buttonId": 150,
//                 "buttonText": "Clicke me",
//                 "buttonValue": "",
//                 "buttonType": 1,
//                 "sequence": 0,
//                 "actionId": 77,
//                 "actionType": 1
//             },
//             {
//                 "buttonId": 151,
//                 "buttonText": "Unsubscribe",
//                 "buttonValue": "",
//                 "buttonType": 1,
//                 "sequence": 0,
//                 "actionId": 0,
//                 "actionType": 3
//             },
//             {
//                 "buttonId": 152,
//                 "buttonText": "Block",
//                 "buttonValue": "",
//                 "buttonType": 1,
//                 "sequence": 0,
//                 "actionId": 0,
//                 "actionType": 4
//             }
//         ],
//         "parameters": [],
//         "createdBy": 2,
//         "createdDate": "25-Mar-2025 04:34:51 PM",
//         "updatedBy": 2,
//         "updatedDate": "25-Mar-2025 04:54:35 PM"
//     },

//       // Template 3: Template connecting to flow
//       {
//         "interactiveTemplateId": 74,
//         "clientId": 1,
//         "senderId": 1,
//         "templateName": "fl_vs_test_2",
//         "language": "en",
//         "transactionType": 2,
//         "status": 1,
//         "usedByAgent": false,
//         "headerType": 0,
//         "headerParamCount": 0,
//         "headerText": "",
//         "bodyParamCount": 0,
//         "bodyText": "We kindly request that you submit your valuable feedback. Thank you!",
//         "footerText": "",
//         "mediaId": 0,
//         "mediaPath": null,
//         "contentType": null,
//         "fileName": null,
//         "buttonsJson": "[{\"ButtonId\":147,\"ButtonText\":\"Submit\",\"ButtonValue\":\"\",\"ButtonType\":1,\"Sequence\":0,\"ActionId\":23,\"ActionType\":8}]",
//         "parametersJson": null,
//         "buttons": [
//           {
//             "buttonId": 147,
//             "buttonText": "Submit",
//             "buttonValue": "",
//             "buttonType": 1,
//             "sequence": 0,
//             "actionId": 23,
//             "actionType": 8
//           },
//         ],
//         "parameters": [],
//         "createdBy": 2,
//         "createdDate": "25-Mar-2025 04:37:15 PM",
//         "updatedBy": 2,
//         "updatedDate": "25-Mar-2025 04:44:07 PM"
//     },
//       // Template 4: Flow template
//       {
//         "senderId": 1,
//         "moduleId": 0,
//         "parentId": 0,
//         "flowName": "website_recommendation_flow",
//         "flowLanguage": "en",
//         "publishToFB": false,
//         "flowId": 23,
//         "actionId": 5,
//         "actionId": 5,
//         "actionType": 0,
//         "flowScreens": [
//             {
//                 "name": "screen_One",
//                 "title": "Share feedback",
//                 "screenButtonText": "Next",
//                 "flowChildren": [
//                     {
//                         "text": "Would you recommend the website to your friend?",
//                         "type": 3,
//                         "required": true,
//                         "flowOptions": [
//                             {
//                                 "optionId": "Yes",
//                                 "optionText": "Yes"
//                             },
//                             {
//                                 "optionId": "No",
//                                 "optionText": "No"
//                             }
//                         ]
//                     },
//                     {
//                         "text": "Rate our delivery experience",
//                         "type": 3,
//                         "required": true,
//                         "flowOptions": [
//                             {
//                                 "optionId": "*",
//                                 "optionText": "*"
//                             },
//                             {
//                                 "optionId": "**",
//                                 "optionText": "**"
//                             },
//                             {
//                                 "optionId": "***",
//                                 "optionText": "***"
//                             },
//                             {
//                                 "optionId": "****",
//                                 "optionText": "****"
//                             },
//                             {
//                                 "optionId": "*****",
//                                 "optionText": "*****"
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "name": "screen_Two",
//                 "title": "Overall experience",
//                 "screenButtonText": "Complete",
//                 "flowChildren": [
//                     {
//                         "text": "Comments",
//                         "type": 2,
//                         "required": false,
//                         "flowOptions": []
//                     }
//                 ]
//             },
//             {
//                 "name": "screen_Two",
//                 "title": "Overall experience",
//                 "screenButtonText": "Complete",
//                 "flowChildren": [
//                     {
//                         "text": "Comments",
//                         "type": 2,
//                         "required": false,
//                         "flowOptions": []
//                     }
//                 ]
//             },

//             {
//                 "name": "screen_Two",
//                 "title": "Overall experience",
//                 "screenButtonText": "Complete",
//                 "flowChildren": [
//                     {
//                         "text": "Comments",
//                         "type": 2,
//                         "required": false,
//                         "flowOptions": []
//                     }
//                 ]
//             },
//         ]
//     },
//       // Template that is connected to template 2
//       {
//         "interactiveTemplateId": 77,
//         "clientId": 1,
//         "senderId": 1,
//         "templateName": "fl_vs_test_item",
//         "language": "en",
//         "transactionType": 2,
//         "status": 1,
//         "usedByAgent": false,
//         "headerType": 2,
//         "headerParamCount": 0,
//         "headerText": "",
//         "bodyParamCount": 0,
//         "bodyText": " Treat yourself to this classic pairing today and savor the satisf",
//         "footerText": "do it quickly",
//         "mediaId": 425,
//         "mediaPath": "/Media/images_(2)_1.jpg",
//         "contentType": "image/jpeg",
//         "fileName": "images_(2)_1.jpg",
//         "buttonsJson": "[{\"ButtonId\":149,\"ButtonText\":\"Visit Website\",\"ButtonValue\":\"https:\\/\\/qawaba.consulttechies.com\\/\",\"ButtonType\":3,\"Sequence\":1,\"ActionId\":0,\"ActionType\":0}]",
//         "parametersJson": null,
//         "buttons": [
//             {
//                 "buttonId": 149,
//                 "buttonText": "Visit Website",
//                 "buttonValue": "https://qawaba.consulttechies.com/",
//                 "buttonType": 3,
//                 "sequence": 1,
//                 "actionId": 0,
//                 "actionType": 0
//             },

//         ],
//         "parameters": [],
//         "createdBy": 2,
//         "createdDate": "25-Mar-2025 04:48:19 PM",
//         "updatedBy": null,
//         "updatedDate": ""
//     },
//     ],
//   };
// };

// Render a single box (fixed id assignment)
// Render a single box with a Meta-style template preview
const renderBox = (
  id,
  //type,
  title,
  content,
  buttons = [],
  actionDetails = {},
  onCardClick,
  template // Full template object for headerType, imageUrl, etc.
) => {
  const isFlow = template?.type === 3;
  const headerType = template?.details.headerType || 3; // Default to text header
  const imageUrl = template?.details.mediaPath || "";
  const headerText = template?.details.headerText || "";
  const bodyText = template?.details.bodyText || content || "No content";
  const footerText = template?.details.footerText || "";
  return (
    <Col xs="auto" key={id}>
      <Card
        id={id}
        className="mb-3 position-relative"
        style={{ width: "300px", cursor: "pointer" }}
        onClick={onCardClick}
      >
        <CardBody style={{ padding: "10px" }}>
          {/* Chat Bubble Container */}
          <div
            style={{
              position: "relative",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              padding: "15px 10px",
              wordWrap: "break-word",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header */}
            {!isFlow && (
              <>
                {headerType === 1 && imageUrl && (
                  <video
                    src={imageUrl}
                    controls
                    muted
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                )}
                {headerType === 2 && imageUrl && (
                  <img
                    src={`${BASE_URL}${imageUrl}`}
                    alt="Header Image"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                )}
                {headerType === 3 && headerText && (
                  <h6
                    style={{
                      marginBottom: "10px",
                      fontWeight: "bold",
                      fontSize: "1.1em",
                    }}
                    dangerouslySetInnerHTML={{ __html: headerText }}
                  />
                )}
              </>
            )}

            {/* Body */}
            {isFlow && template?.flowScreens ? (
              <div>
                {template.flowScreens.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <div
                      key={buttons[0].buttonId}
                      id={`btn_${buttons[0].buttonId}`}
                      className="mb-1"
                      data-action={dropdownOptions
                        .find((opt) => opt.value === buttons[0].actionType)
                        ?.label.toLowerCase()}
                      data-target={
                        buttons[0].actionType === 8 &&
                        buttons[0].buttonType === 1
                          ? `${buttons[0].actionId}`
                          : `action_${buttons[0].buttonId}`
                      }
                    >
                      <Button
                        color="link"
                        block
                        disabled
                        style={{
                          color: "#00a9ee",
                          backgroundColor: "#ffffff",
                          border: "1px solid #808080",
                          borderRadius: "4px",
                          padding: "8px",
                          textAlign: "center",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "none",
                          marginBottom: "4px",
                        }}
                      >
                        <span style={{ color: "#00a9ee" }}>
                          <i className="fa fa-arrow-right me-2"></i>
                          {buttons[0].buttonText || "Button"}
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{ marginBottom: "10px", fontSize: "1em" }}
                dangerouslySetInnerHTML={{ __html: bodyText }}
              />
            )}

            {/* Footer */}
            {!isFlow && footerText && (
              <p
                style={{
                  marginTop: "5px",
                  fontSize: "0.85em",
                  color: "#666",
                  fontStyle: "italic",
                }}
              >
                {footerText}
              </p>
            )}

            {/* Template Buttons */}
            {!isFlow &&
              buttons.map((button) => (
                <div
                  key={button.buttonId}
                  id={`btn_${button.buttonId}`}
                  className="mb-1"
                  data-action={dropdownOptions
                    .find((opt) => opt.value === button.actionType)
                    ?.label.toLowerCase()}
                  data-target={
                    (button.actionType === 1 || button.actionType === 8) &&
                    button.buttonType === 1
                      ? `${button.actionId}`
                      : `action_${button.buttonId}`
                  }
                >
                  <Button
                    color="link"
                    block
                    disabled
                    style={{
                      color: "#00a9ee",
                      backgroundColor: "#ffffff",
                      border: "1px solid #808080",
                      borderRadius: "4px",
                      padding: "8px",
                      textAlign: "center",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "none",
                      marginBottom: "4px",
                    }}
                  >
                    {button.buttonType === 1 && (
                      <span style={{ color: "#00a9ee" }}>
                        <i className="fa fa-share fa-flip-horizontal me-2"></i>
                        {button.buttonText || "Button"}
                      </span>
                    )}
                    {button.buttonType === 2 && (
                      <span style={{ color: "#00a9ee" }}>
                        <i className="fa fa-phone me-2"></i>
                        {button.buttonText || "Call"}
                      </span>
                    )}
                    {button.buttonType === 3 && (
                      <span style={{ color: "#00a9ee" }}>
                        <i className="fa fa-external-link me-2"></i>
                        {button.buttonText || "Visit"}
                      </span>
                    )}
                  </Button>
                </div>
              ))}

            {/* Action Details for Non-Button Nodes */}
            {!buttons.length && actionDetails.actionType !== undefined && (
              <CardText
                className="text-muted"
                style={{ fontSize: "0.9em", textAlign: "center" }}
              >
                {actionDetails.actionType === 0
                  ? "No Action"
                  : dropdownOptions.find(
                      (opt) => opt.value === actionDetails.actionType
                    )?.label || "Unknown Action"}
              </CardText>
            )}
          </div>

          {/* Template/Flow Name */}
          <CardTitle
            tag="h6"
            style={{
              marginTop: "10px",
              fontSize: "0.9em",
              textAlign: "center",
              color: "#555",
            }}
          >
            {title ? title.replace(/_/g, " ").toUpperCase() : "Unnamed"}
          </CardTitle>
        </CardBody>
      </Card>
    </Col>
  );
};
// Collect nodes by level (fixed targetId assignment)
const collectNodesByLevel = (
  template,
  templateMap,
  level = 0,
  levels = {},
  buttonMap = {},
  visited = new Set()
) => {
  // Guard clause: Return if template is invalid or missing required IDs
  if (
    !template ||
    (!template.id && !template.interactiveTemplateId && !template.flowId)
  ) {
    return { levels, buttonMap };
  }

  // Determine the unique ID for the template (id, interactiveTemplateId, or flowId)
  const id = template.id || template.interactiveTemplateId || template.flowId;

  // Prevent infinite loops by checking if this template has been visited
  if (visited.has(id)) {
    return { levels, buttonMap };
  }
  visited.add(id);

  // Use stringified ID for consistency
  const templateId = `${id}`;
  if (!levels[level]) levels[level] = [];

  let title,
    buttons = [],
    content;

  // Handle Flow Templates
  if (template.type === 3) {
    title = template.details.flowName || "Unnamed Flow";
    // Define the button using the flow's own actionId instead of the last screen's
    buttons =
      template.flowScreens && template.flowScreens.length > 0
        ? [
            {
              buttonId: `${template.flowId}_screen_${
                template.flowScreens.length - 1
              }`,
              buttonText:
                template.flowScreens[template.flowScreens.length - 1]
                  .screenButtonText || "Submit",
              buttonType: 1,
              sequence: template.flowScreens.length - 1,
              actionId: template.actionId || 0, // 5
              actionType: template.actionType || 0, // 1
            },
          ]
        : [];
    content = "Flow Screen";

    // Process the flow's actionId for the button
    if (template.details.actionId && template.details.actionType) {
      let targetId;
      if (template.details.actionType === 1) {
        // TEMPLATE
        const nextTemplate = templateMap[template.details.actionId];
        targetId = nextTemplate
          ? nextTemplate.id !== undefined
            ? `${nextTemplate.id}`
            : `${nextTemplate.id}`
          : null;
        if (nextTemplate) {
          collectNodesByLevel(
            nextTemplate,
            templateMap,
            level + 1,
            levels,
            buttonMap,
            visited
          );
          buttonMap[
            `btn_${template.id}_screen_${template.flowScreens.length - 1}`
          ] = targetId;
        }
      } else if (template.details.actionType === 8) {
        // FLOWS
        const nextFlow = templateMap[template.details.actionId];
        targetId = nextFlow ? `${nextFlow.id}` : null;
        if (nextFlow) {
          collectNodesByLevel(
            nextFlow,
            templateMap,
            level + 1,
            levels,
            buttonMap,
            visited
          );
          buttonMap[
            `btn_${template.flowId}_screen_${template.flowScreens.length - 1}`
          ] = targetId;
        }
      } else {
        // Handle other action types (e.g., ORDER, CHAT, etc.)
        targetId = `action_${template.flowId}_screen_${
          template.flowScreens.length - 1
        }`;
        const actionTypeLabel = dropdownOptions
          .find((opt) => opt.value === template.actionType)
          ?.label.toLowerCase();
        const actionTitle =
          actionTypeLabel === "chat"
            ? "Chat With Agent"
            : actionTypeLabel === "order"
            ? "Order"
            : actionTypeLabel === "close chat"
            ? "Close Chat"
            : actionTypeLabel === "unsubscribe"
            ? "Unsubscribe User"
            : actionTypeLabel === "block"
            ? "Block User"
            : "Action";
        const actionContent =
          actionTypeLabel === "chat"
            ? "Start Chat"
            : actionTypeLabel === "order"
            ? "Place Order"
            : actionTypeLabel === "close chat"
            ? "End Chat"
            : actionTypeLabel === "unsubscribe"
            ? "Unsubscribed"
            : actionTypeLabel === "block"
            ? "Blocked"
            : actionTypeLabel;
        if (!levels[level + 1]) levels[level + 1] = [];
        levels[level + 1].push({
          id: targetId,
          title: actionTitle,
          content: actionContent,
          buttons: [],
          actionDetails: {
            actionId: template.actionId,
            actionType: template.actionType,
          },
        });
        buttonMap[
          `btn_${template.flowId}_screen_${template.flowScreens.length - 1}`
        ] = targetId;
      }
    }
  }
  // Handle Regular Templates
  else {
    title = template.details.templateName || "Unnamed Template";
    content = `${template.details.headerText || ""}\n\n${
      template.details.bodyText || ""
    }\n\n${template.details.footerText || ""}`;
    buttons = template.details.buttons || [];
  }

  // Add the current node to the level
  levels[level].push({
    id: templateId,
    title,
    content,
    buttons,
  });

  // Process Buttons (for both flows and flowsVisualization)
  buttons?.forEach((button) => {
    let targetId;
    let actionTypeLabel;

    if (button.buttonType === 1) {
      // Quick Reply Button
      actionTypeLabel = dropdownOptions
        .find((opt) => opt.value === button.actionType)
        ?.label.toLowerCase();
      if (button.actionType === 1) {
        // TEMPLATE
        const nextTemplate = templateMap[button.actionId];
        targetId = nextTemplate
          ? nextTemplate.id !== undefined
            ? `${nextTemplate.id}`
            : `${nextTemplate.interactiveTemplateId}`
          : null;
        if (nextTemplate) {
          collectNodesByLevel(
            nextTemplate,
            templateMap,
            level + 1,
            levels,
            buttonMap,
            visited
          );
        }
      } else if (button.actionType === 8) {
        // debugger
        // FLOWS
        const nextFlow = templateMap[button.actionId];
        targetId = nextFlow ? `${nextFlow.id}` : null;
        if (nextFlow) {
          collectNodesByLevel(
            nextFlow,
            templateMap,
            level + 1,
            levels,
            buttonMap,
            visited
          );
        }
      } else {
        // Other actions (e.g., CHAT, ORDER, etc.)
        targetId = `action_${button.buttonId}`;
        const actionTitle =
          actionTypeLabel === "chat"
            ? "Chat With Agent"
            : actionTypeLabel === "order"
            ? "Order"
            : actionTypeLabel === "close chat"
            ? "Close Chat"
            : actionTypeLabel === "flows"
            ? "Flow Action"
            : actionTypeLabel === "unsubscribe"
            ? "Unsubscribe User"
            : actionTypeLabel === "block"
            ? "Block User"
            : "Action";
        const actionContent =
          actionTypeLabel === "chat"
            ? "Start Chat"
            : actionTypeLabel === "order"
            ? "Place Order"
            : actionTypeLabel === "close chat"
            ? "End Chat"
            : actionTypeLabel === "flows"
            ? "Start Flow"
            : actionTypeLabel === "unsubscribe"
            ? "Unsubscribed"
            : actionTypeLabel === "block"
            ? "Blocked"
            : actionTypeLabel;
        if (!levels[level + 1]) levels[level + 1] = [];
        levels[level + 1].push({
          id: targetId,
          title: actionTitle,
          content: actionContent,
          buttons: [],
          actionDetails: button,
        });
      }
    } else if (button.buttonType === 2) {
      // Call/Phone Number (mapped to CHAT)
      actionTypeLabel = "chat";
      targetId = `action_${button.buttonId}`;
      const actionTitle = button.buttonText;
      const actionContent = `Call: ${button.buttonValue || "Not provided"}`;
      if (!levels[level + 1]) levels[level + 1] = [];
      levels[level + 1].push({
        id: targetId,
        title: actionTitle,
        content: actionContent,
        buttons: [],
        actionDetails: { ...button, actionType: 5 }, // CHAT action type
      });
    } else if (button.buttonType === 3) {
      // URL/Visit Website (mapped to CHAT)
      actionTypeLabel = "chat";
      targetId = `action_${button.buttonId}`;
      const actionTitle = button.buttonText;
      const actionContent = `Visit: ${button.buttonValue || "Not provided"}`;
      if (!levels[level + 1]) levels[level + 1] = [];
      levels[level + 1].push({
        id: targetId,
        title: actionTitle,
        content: actionContent,
        buttons: [],
        actionDetails: { ...button, actionType: 5 }, // CHAT action type
      });
    }

    // Update buttonMap with the target ID
    if (targetId) {
      buttonMap[`btn_${button.buttonId}`] = targetId;
    }
  });

  return { levels, buttonMap };
};

//Use getServerSideProps for server-side data fetching in Next.js
// export async function getServerSideProps() {
//   debugger
//   const data = await fetchTemplateVisualization({templateId: 26, templatetype: 1});
//   console.log(data);
//   const initialData = data.result.templatevisualization;

//   return {
//     props: {
//       initialData: initialData,
//     },
//   };
// }

const TemplateTypeDropdown = ({ onTemplateTypeChange, selectedType }) => {
  return (
    <div className="mb-3" style={{ maxWidth: "300px", margin: "0 auto" }}>
      <select
        className="form-select"
        value={selectedType}
        onChange={(e) => onTemplateTypeChange(e.target.value)}
      >
        <option value="">Select Template</option>
        <option value="2">Interactive Template</option>
        <option value="1">Marketing Template</option>
      </select>
    </div>
  );
};

export default function FlowVisualization() {
  const dispatch = useDispatch();
  const [lines, setLines] = useState([]);
  const svgContainerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showUpdateFlow, setShowUpdateFlow] = useState(false);
  const [showUpdateTemplate, setShowUpdateTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isInteractiveTemplate, setIsInteractiveTemplate] = useState(false);
  const [templateType, setTemplateType] = useState("");
  const [templateId, setTemplateId] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [interactiveTemplateId, setInteractiveTemplateId] = useState(null);
  const { templateVisualizationData, loading, error } = useSelector(
    (state) => state.templateVisualization
  );
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCardClick = (templateId) => {
    const template = initialData.find(
      (t) => t.id && t.id.toString() === templateId
    );

    if (template) {
      if (template.type === 3) {
        setSelectedTemplate(template.id);
        setShowUpdateFlow(true);
        return;
      } else if (template.type === 2) {
        setSelectedTemplate(template.id);
        setIsInteractiveTemplate(true);
        setShowUpdateTemplate(true);
        return;
      } else if (template.type === 1) {
        setSelectedTemplate(template.id);
        setIsInteractiveTemplate(false);
        setShowUpdateTemplate(true);
        return;
      }
    }
  };

  const handleTemplateClick = (e) => {
    setTemplateId(e.target.value);
  };

  const handleTemplateTypeChange = (type) => {
    setTemplateType(type);
    if (!type) {
      setTemplateId(null); // Reset templateId
      setInitialData(null); // Reset initialData to hide visualization
    }
  };
  const handleInteractiveTemplateClick = (e) => {
    setTemplateId(e.target.value);
  };
  const handleCloseModal = () => {
    setShowUpdateTemplate(false);
    setShowUpdateFlow(false);
    setSelectedTemplate(null);
  };

  useEffect(() => {
    if (!isMounted || !initialData || !svgContainerRef.current) return;

    const calculateLines = () => {
      const templateMap = initialData.reduce((map, template) => {
        if (template.id !== undefined) map[template.id] = template;
        // if (template.interactiveTemplateId !== undefined)
        //   map[template.interactiveTemplateId] = template;
        // if (template.flowId !== undefined) map[template.flowId] = template;
        return map;
      }, {});

      const rootTemplate = initialData[0];
      const { buttonMap } = collectNodesByLevel(rootTemplate, templateMap);
      const newLines = [];

      const drawLines = () => {
        newLines.length = 0;
        Object.entries(buttonMap).forEach(([buttonId, targetId], index) => {
          const buttonElement = document.getElementById(buttonId);
          const targetElement = document.getElementById(targetId);

          if (!buttonElement || !targetElement) {
            console.warn(`Missing elements: ${buttonId} or ${targetId}`);
            return;
          }

          const buttonRect = buttonElement.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();
          const svgRect = svgContainerRef.current.getBoundingClientRect();

          if (
            buttonRect.width === 0 ||
            buttonRect.height === 0 ||
            targetRect.width === 0 ||
            targetRect.height === 0
          ) {
            console.warn(
              `Invalid bounding rect for ${buttonId} or ${targetId}`
            );
            return;
          }

          const action = buttonElement.dataset.action;
          let strokeColor = "#007bff";
          switch (action) {
            case "template":
              strokeColor = "#007bff";
              break;
            case "chat":
              strokeColor = "#ffc107";
              break;
            case "order":
              strokeColor = "#6f42c1";
              break;
            case "close chat":
              strokeColor = "#fd7e14";
              break;
            case "flows":
              strokeColor = "#20c997";
              break;
            case "block":
            case "unsubscribe":
              strokeColor = "#dc3545";
              break;
            default:
              strokeColor = "#6c757d";
          }

          // Calculate start and end points
          const buttonCenterX = buttonRect.left + buttonRect.width / 2;
          const targetCenterX = targetRect.left + targetRect.width / 2;
          const isTargetLeft = targetCenterX < buttonCenterX;

          // Start from the button's border
          const startX = isTargetLeft
            ? buttonRect.left - svgRect.left // Left border
            : buttonRect.right - svgRect.left; // Right border
          const startY = buttonRect.top + buttonRect.height / 2 - svgRect.top;

          const endX = targetRect.left + targetRect.width / 2 - svgRect.left;
          const endY = targetRect.top - svgRect.top - 10;

          // Define a straight segment length (e.g., 20px) before the curve
          const straightLength = 20; // Adjust this value for the straight segment length
          const straightEndX = isTargetLeft
            ? startX - straightLength
            : startX + straightLength;
          const straightEndY = startY; // Keep Y constant for a horizontal straight line

          // Calculate distances for the curve
          const verticalDistance = Math.abs(endY - straightEndY);
          const horizontalDistance = Math.abs(endX - straightEndX);

          // Control points for the Bézier curve after the straight segment
          const controlPointOffsetX = horizontalDistance * 0.3; // Adjusted for smoother tilt
          const controlPointOffsetY = verticalDistance * 0.5; // Adjusted for tilt

          const controlPoint1X = isTargetLeft
            ? straightEndX - controlPointOffsetX * 0.5
            : straightEndX + controlPointOffsetX * 0.5;
          const controlPoint1Y = straightEndY + controlPointOffsetY * 0.7;

          const controlPoint2X = isTargetLeft
            ? endX + controlPointOffsetX * 0.3
            : endX - controlPointOffsetX * 0.3;
          const controlPoint2Y = endY - controlPointOffsetY * 0.3;

          // Path: Move to start, straight line, then cubic Bézier curve
          const pathD = `M ${startX},${startY} L ${straightEndX},${straightEndY} C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${endX},${endY}`;

          newLines.push({
            pathD,
            stroke: strokeColor,
            key: `${buttonId}-${targetId}`,
            strokeWidth: "1.5",
          });
        });

        setLines(newLines);
      };

      const checkElementsVisibility = (callback) => {
        const elementsToCheck = [];
        Object.entries(buttonMap).forEach(([buttonId, targetId]) => {
          const buttonElement = document.getElementById(buttonId);
          const targetElement = document.getElementById(targetId);
          if (buttonElement && targetElement) {
            elementsToCheck.push(buttonElement);
            elementsToCheck.push(targetElement);
          } else {
            console.warn(`Element not found: ${buttonId} or ${targetId}`);
          }
        });

        if (elementsToCheck.length === 0) {
          console.warn("No elements to observe for visibility");
          callback();
          return;
        }

        const observer = new IntersectionObserver(
          (entries, observer) => {
            const allVisible = entries.every((entry) => entry.isIntersecting);
            if (allVisible) {
              entries.forEach((entry) => observer.unobserve(entry.target));
              callback();
            }
          },
          { threshold: 0.1 }
        );

        elementsToCheck.forEach((element) => {
          if (element) observer.observe(element);
        });

        setTimeout(() => {
          elementsToCheck.forEach((element) => {
            if (element) observer.unobserve(element);
          });
          callback();
        }, 1000);
      };

      checkElementsVisibility(drawLines);
    };

    calculateLines();
    window.addEventListener("resize", calculateLines);
    return () => {
      window.removeEventListener("resize", calculateLines);
    };
  }, [isMounted, initialData]);

  useEffect(() => {
    if (!templateId || !templateType || templateId <= 0) {
      setInitialData(null); // Reset initialData when either is unselected
      return;
    }

    const fetchData = async () => {
      setInitialData(null);
      setLines([]);

      try {
        dispatch(
          fetchTemplateVisualization({
            templateId: templateId,
            templatetype: templateType,
          })
        );
        //console.log("Fetch response:", response);
        //setInitialData(templateVisualizationData);
      } catch (error) {
        console.error("Error fetching data:", error);
        showSweetAlert({
          title: "Error",
          text: "Failed to fetch data",
          icon: "error",
        });
        setInitialData(null); // Reset on error
      }
    };
    fetchData();
  }, [templateId, dispatch]);

  useEffect(() => {
    if (templateVisualizationData && templateVisualizationData.data) {
      setInitialData(templateVisualizationData.data);
    }
  }, [templateVisualizationData]);

  let templateMap = {};
  let rootTemplate = null;
  let levels = {};

  if (initialData) {
    templateMap = initialData.reduce((map, template) => {
      if (template.type === 1) {
        map[template.id] = template;
      } else if (template.type === 2) {
        map[template.id] = template;
      } else if (template.type === 3) {
        map[template.id] = template;
      }
      return map;
    }, {});
    rootTemplate = initialData[0];
    ({ levels } = collectNodesByLevel(rootTemplate, templateMap));
  }

  return (
    <App>
      {loading && <Loader />}
      {showUpdateFlow ? (
        <UpdateFlowPage Flow_Id={selectedTemplate} onclose={handleCloseModal} />
      ) : showUpdateTemplate ? (
        isInteractiveTemplate ? (
          <InteractiveTemplateUpdate
            Template_Id={selectedTemplate}
            onclose={handleCloseModal}
          />
        ) : (
          <UpdateTemplate
            Template_Id={selectedTemplate}
            onclose={handleCloseModal}
          />
        )
      ) : (
        <div
          className=""
          style={{
            overflow: "scroll",
            height: "86vh",
            width: "80vw",
            position: "relative",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div className="d-flex justify-content-center align-items-end mb-4 gap-3 flex-wrap">
            <div className="col-md-3 col-sm-12">
              <label className="form-label">Template Type:</label>
              <TemplateTypeDropdown
                onTemplateTypeChange={handleTemplateTypeChange}
                selectedType={templateType}
              />
            </div>
            <div
              className={`col-md-3 col-sm-12 ${
                templateType === "2" ? "d-block" : "d-none"
              }`}
            >
              <label className="form-label">Interactive Template:</label>
              <InteractiveTemplateDropdown
                value={templateId}
                onChange={handleInteractiveTemplateClick}
              />
            </div>
            <div
              className={`col-md-3 col-sm-12 ${
                templateType === "1" ? "d-block" : "d-none"
              }`}
            >
              <label className="form-label">Marketing Template:</label>
              <TemplateDropdown
                value={templateId}
                onChange={handleTemplateClick}
              />
            </div>
          </div>
          {initialData && templateId ? (
            <Container
              style={{
                overflow: "auto",
                padding: "40px 20px",
                position: "relative",
                minWidth: `${20}px`,
                minHeight: "100%",
              }}
            >
              <h2 className="text-center mb-5">
                WhatsApp Template Flow Visualization
              </h2>
              <div ref={svgContainerRef} style={{ position: "relative" }}>
                <svg
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                >
                  {lines.map((line) => (
                    <path
                      key={line.key}
                      d={line.pathD}
                      stroke={line.stroke}
                      strokeWidth={line.strokeWidth || "2"}
                      fill="none"
                      markerEnd="url(#arrow)"
                    />
                  ))}
                  <defs>
                    <marker
                      id="arrow"
                      markerWidth="8"
                      markerHeight="8"
                      refX="7"
                      refY="4"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path d="M0,0 L0,8 L8,4 z" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {Object.keys(levels).map((level) => (
                    <div
                      key={level}
                      className="mb-5"
                      style={{ position: "relative", zIndex: 0 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "nowrap",
                          justifyContent: "center",
                          gap: "20px",
                          width: `${levels[level].length * 320}px`,
                          margin: "0 auto",
                        }}
                      >
                        {levels[level].map((node) =>
                          renderBox(
                            node.id,
                            //node.type,
                            node.title,
                            node.content,
                            node.buttons,
                            node.actionDetails || {},
                            () => handleCardClick(node.id),
                            templateMap[node.id]
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          ) : (
            <div className="text-center mt-4">
              <p>Please select a template to see the visualization.</p>
            </div>
          )}
        </div>
      )}
    </App>
  );
}
