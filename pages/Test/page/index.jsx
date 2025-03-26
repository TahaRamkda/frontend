import { useEffect, useState, useRef } from "react";
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
import InteractiveTemplateUpdate from "@/pages/InteractiveTemplates/UpdateTemplate";
import UpdateTemplate from "@/pages/Templates/UpdateTemplate";
import UpdateFlowPage from "@/pages/Flows/FlowDetails";
// Action type mappings (unchanged)
import { dropdownOptions } from "@/utils/constants";
// Simulated API data with updated IDs and actionIds
const fetchTemplateData = async () => {
  return {
    templates: [
      // Template 1: Starting template
      {
        "id": 22,
        "clientId": 1,
        "clientName": "Babji Consult Techies",
        "senderId": 1,
        "senderName": "Babji Consult Techies",
        "templateName": "fl_vs_maintemplate",
        "category": "MARKETING",
        "subCategory": null,
        "language": "en",
        "status": "PENDING",
        "isApproved": false,
        "templateId": "",
        "headerType": 2,
        "headerText": "",
        "headerParamCount": 0,
        "mediaId": 425,
        "mediaPath": "/Media/images_(2)_1.jpg",
        "contentType": "image/jpeg",
        "fileExtension": ".jpg",
        "fileName": "images_(2)_1.jpg",
        "bodyText": "No matching results, press enter to execute your custom prompt write a para promoting burger King burger\nIndulge in the mouthwatering goodness of Burger King's iconic flame-grilled burgers! Each bite delivers a perfect blend of savory flavors, starting with high-quality beef that’s grilled to perfection for that unmistakable smoky taste. Whether you're craving the classic Whopper stacked high with fresh lettuce, juicy tomatoes, and creamy mayonnaise, or one of their delicious specialty burgers",
        "bodyParamCount": 0,
        "footerText": "do it quickly",
        "buttons": [
            {
                "buttonId": 27,
                "buttonText": "Template 1",
                "buttonValue": "",
                "buttonType": 1,
                "sequence": 0,
                "actionId": 73,
                "actionType": 1,
                "systemActionId": null
            },
            {
                "buttonId": 28,
                "buttonText": "Tempalte 2",
                "buttonValue": "",
                "buttonType": 1,
                "sequence": 1,
                "actionId": 74,
                "actionType": 1,
                "systemActionId": null
            },
            {
                "buttonId": 29,
                "buttonText": "Call Phone Number",
                "buttonValue": "+91-7297005253",
                "buttonType": 2,
                "sequence": 2,
                "actionId": 0,
                "actionType": 0,
                "systemActionId": null
            }
        ],
        "parameters": [],
        "createdBy": 2,
        "createdDate": "25-Mar-2025 04:58:40 PM",
        "updatedBy": 2,
        "updatedDate": "25-Mar-2025 04:58:40 PM"
    },
      
      
      // Template 2
      {
        "id": 73,
        "clientId": 1,
        "senderId": 1,
        "templateName": "fl_vs_test_1",
        "language": "en",
        "transactionType": 2,
        "status": 1,
        "usedByAgent": false,
        "headerType": 0,
        "headerParamCount": 0,
        "headerText": "",
        "bodyParamCount": 0,
        "bodyText": "wanna try our new order??",
        "footerText": "",
        "mediaId": 0,
        "mediaPath": null,
        "contentType": null,
        "fileName": null,
        "buttonsJson": "[{\"ButtonId\":150,\"ButtonText\":\"Clicke me\",\"ButtonValue\":\"\",\"ButtonType\":1,\"Sequence\":0,\"ActionId\":77,\"ActionType\":1},{\"ButtonId\":151,\"ButtonText\":\"Unsubscribe\",\"ButtonValue\":\"\",\"ButtonType\":1,\"Sequence\":0,\"ActionId\":0,\"ActionType\":3},{\"ButtonId\":152,\"ButtonText\":\"Block\",\"ButtonValue\":\"\",\"ButtonType\":1,\"Sequence\":0,\"ActionId\":0,\"ActionType\":4}]",
        "parametersJson": null,
        "buttons": [
            {
                "buttonId": 150,
                "buttonText": "Clicke me",
                "buttonValue": "",
                "buttonType": 1,
                "sequence": 0,
                "actionId": 77,
                "actionType": 1
            },
            {
                "buttonId": 151,
                "buttonText": "Unsubscribe",
                "buttonValue": "",
                "buttonType": 1,
                "sequence": 0,
                "actionId": 0,
                "actionType": 3
            },
            {
                "buttonId": 152,
                "buttonText": "Block",
                "buttonValue": "",
                "buttonType": 1,
                "sequence": 0,
                "actionId": 0,
                "actionType": 4
            }
        ],
        "parameters": [],
        "createdBy": 2,
        "createdDate": "25-Mar-2025 04:34:51 PM",
        "updatedBy": 2,
        "updatedDate": "25-Mar-2025 04:54:35 PM"
    },
      
      // Template 3: Template connecting to flow
      {
        "id": 74,
        "clientId": 1,
        "senderId": 1,
        "templateName": "fl_vs_test_2",
        "language": "en",
        "transactionType": 2,
        "status": 1,
        "usedByAgent": false,
        "headerType": 0,
        "headerParamCount": 0,
        "headerText": "",
        "bodyParamCount": 0,
        "bodyText": "We kindly request that you submit your valuable feedback. Thank you!",
        "footerText": "",
        "mediaId": 0,
        "mediaPath": null,
        "contentType": null,
        "fileName": null,
        "buttonsJson": "[{\"ButtonId\":147,\"ButtonText\":\"Submit\",\"ButtonValue\":\"\",\"ButtonType\":1,\"Sequence\":0,\"ActionId\":23,\"ActionType\":8}]",
        "parametersJson": null,
        "buttons": [
          {
            "buttonId": 147,
            "buttonText": "Submit",
            "buttonValue": "",
            "buttonType": 1,
            "sequence": 0,
            "actionId": 23,
            "actionType": 8
          },
        ],
        "parameters": [],
        "createdBy": 2,
        "createdDate": "25-Mar-2025 04:37:15 PM",
        "updatedBy": 2,
        "updatedDate": "25-Mar-2025 04:44:07 PM"
    },
      // Template 4: Flow template
      {
        "senderId": 1,
        "moduleId": 0,
        "parentId": 0,
        "flowName": "website_recommendation_flow",
        "flowLanguage": "en",
        "publishToFB": false,
        "flowId": 23,
        "actionId": 0,
        "actionType": 0,
        "flowScreens": [
            {
                "name": "screen_One",
                "title": "Share feedback",
                "screenButtonText": "Next",
                "flowChildren": [
                    {
                        "text": "Would you recommend the website to your friend?",
                        "type": 3,
                        "required": true,
                        "flowOptions": [
                            {
                                "optionId": "Yes",
                                "optionText": "Yes"
                            },
                            {
                                "optionId": "No",
                                "optionText": "No"
                            }
                        ]
                    },
                    {
                        "text": "Rate our delivery experience",
                        "type": 3,
                        "required": true,
                        "flowOptions": [
                            {
                                "optionId": "*",
                                "optionText": "*"
                            },
                            {
                                "optionId": "**",
                                "optionText": "**"
                            },
                            {
                                "optionId": "***",
                                "optionText": "***"
                            },
                            {
                                "optionId": "****",
                                "optionText": "****"
                            },
                            {
                                "optionId": "*****",
                                "optionText": "*****"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "screen_Two",
                "title": "Overall experience",
                "screenButtonText": "Complete",
                "flowChildren": [
                    {
                        "text": "Comments",
                        "type": 2,
                        "required": false,
                        "flowOptions": []
                    }
                ]
            }
        ]
    },
      // Template that is connected to template 2
      {
        "id": 77,
        "clientId": 1,
        "senderId": 1,
        "templateName": "fl_vs_test_item",
        "language": "en",
        "transactionType": 2,
        "status": 1,
        "usedByAgent": false,
        "headerType": 2,
        "headerParamCount": 0,
        "headerText": "",
        "bodyParamCount": 0,
        "bodyText": "Sink your teeth into the ultimate flavor experience with our mouthwatering burgers, made from 100% fresh, premium ingredients. Each bite is a delicious symphony of juicy beef, melted cheese, and crisp toppings, all nestled in a soft, toasted bun. And what better way to wash it down than with an ice-cold cola? Its refreshing fizz perfectly complements the savory goodness of our burgers, making it the ideal combo for your next meal. Treat yourself to this classic pairing today and savor the satisf",
        "footerText": "do it quickly",
        "mediaId": 425,
        "mediaPath": "/Media/images_(2)_1.jpg",
        "contentType": "image/jpeg",
        "fileName": "images_(2)_1.jpg",
        "buttonsJson": "[{\"ButtonId\":149,\"ButtonText\":\"Visit Website\",\"ButtonValue\":\"https:\\/\\/qawaba.consulttechies.com\\/\",\"ButtonType\":3,\"Sequence\":1,\"ActionId\":0,\"ActionType\":0}]",
        "parametersJson": null,
        "buttons": [
            {
                "buttonId": 149,
                "buttonText": "Visit Website",
                "buttonValue": "https://qawaba.consulttechies.com/",
                "buttonType": 3,
                "sequence": 1,
                "actionId": 0,
                "actionType": 0
            }
        ],
        "parameters": [],
        "createdBy": 2,
        "createdDate": "25-Mar-2025 04:48:19 PM",
        "updatedBy": null,
        "updatedDate": ""
    },
    ],
  };
};

// Render a single box (fixed id assignment)
// Render a single box with a Meta-style template preview
const renderBox = (
  id,
  title,
  content,
  buttons = [],
  actionDetails = {},
  onCardClick,
  template // Full template object for headerType, imageUrl, etc.
) => {
  const isFlow = title.includes("flow");
  const headerType = template?.headerType || 3; // Default to text header
  const imageUrl = template?.mediaPath || "";
  const headerText = template?.headerText || "";
  const bodyText = template?.bodyText || content.split("\n\n")[1] || "No content";
  const footerText = template?.footerText || content.split("\n\n")[2] || "";

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
              (buttons[0].actionType === 8) &&
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
  if (!template || (!template.id && !template.interactiveTemplateId && !template.flowId)) {
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

  let title, buttons = [], content;

  // Handle Flow Templates
  if (template.flowId) {
    title = template.flowName || "Unnamed Flow";
    // Define the button using the flow's own actionId instead of the last screen's
    buttons = template.flowScreens && template.flowScreens.length > 0
    ? [
        {
          buttonId: `${template.flowId}_screen_${template.flowScreens.length - 1}`,
          buttonText: template.flowScreens[template.flowScreens.length - 1].screenButtonText || "Submit",
          buttonType: 1,
          sequence: template.flowScreens.length - 1,
          actionId: template.actionId || 0, // 5
          actionType: template.actionType || 0, // 1
        }
      ]
    : [];
    content = template.flowScreens
      ? template.flowScreens
          .map((screen) =>
            `Name: ${screen.name || ""} \n\n Title: ${screen.title || ""}\n\n Body: ${screen.bodyText || ""}\n\n Button: ${screen.screenButtonText || ""}`
          )
          .join("\n\n")
      : "No flow screens available";

    // Process the flow's actionId for the button
    if (template.actionId && template.actionType) {
      let targetId;
      if (template.actionType === 1) { // TEMPLATE
        const nextTemplate = templateMap[template.actionId];
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
          buttonMap[`btn_${template.flowId}_screen_${template.flowScreens.length - 1}`] = targetId;
        }
      } else if (template.actionType === 8) { // FLOWS
        const nextFlow = templateMap[template.actionId];
        targetId = nextFlow ? `${nextFlow.flowId}` : null;
        if (nextFlow) {
          collectNodesByLevel(
            nextFlow,
            templateMap,
            level + 1,
            levels,
            buttonMap,
            visited
          );
          buttonMap[`btn_${template.flowId}_screen_${template.flowScreens.length - 1}`] = targetId;
        }
      } else {
        // Handle other action types (e.g., ORDER, CHAT, etc.)
        targetId = `action_${template.flowId}_screen_${template.flowScreens.length - 1}`;
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
          actionDetails: { actionId: template.actionId, actionType: template.actionType },
        });
        buttonMap[`btn_${template.flowId}_screen_${template.flowScreens.length - 1}`] = targetId;
      }
    }
  } 
  // Handle Regular Templates
  else {
    title = template.templateName || "Unnamed Template";
    content = `${template.headerText || ""}\n\n${template.bodyText || ""}\n\n${template.footerText || ""}`;
    buttons = template.buttons || [];
  }

  // Add the current node to the level
  levels[level].push({
    id: templateId,
    title,
    content,
    buttons,
  });

  // Process Buttons (for both flows and templates)
  buttons?.forEach((button) => {
    let targetId;
    let actionTypeLabel;

    if (button.buttonType === 1) { // Quick Reply Button
      actionTypeLabel = dropdownOptions
        .find((opt) => opt.value === button.actionType)
        ?.label.toLowerCase();
      if (button.actionType === 1) { // TEMPLATE
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
      } else if (button.actionType === 8) { // FLOWS
        const nextFlow = templateMap[button.actionId];
        targetId = nextFlow ? `${nextFlow.flowId}` : null;
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
      } else { // Other actions (e.g., CHAT, ORDER, etc.)
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
    } else if (button.buttonType === 2) { // Call/Phone Number (mapped to CHAT)
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
    } else if (button.buttonType === 3) { // URL/Visit Website (mapped to CHAT)
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

// Use getServerSideProps for server-side data fetching in Next.js
export async function getServerSideProps() {
  const data = await fetchTemplateData();
  return {
    props: {
      initialData: data,
    },
  };
}

export default function FlowVisualization({ initialData }) {
  const [lines, setLines] = useState([]);
  const svgContainerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showUpdateFlow, setShowUpdateFlow] = useState(false);
  const [showUpdateTemplate, setShowUpdateTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isInteractiveTemplate, setIsInteractiveTemplate] = useState(false);
  // Ensure component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCardClick = (templateId) => {
    debugger;
    const template = initialData.templates.find(
      (t) =>
        (t.id && t.id.toString() === templateId) ||
        (t.interactiveTemplateId &&
          t.interactiveTemplateId.toString() === templateId) ||
        (t.flowId && t.flowId.toString() === templateId)
    );
  
    if (template) {
      if (template.flowId) {
        debugger;
        setSelectedTemplate(template.flowId);
        setShowUpdateFlow(true);
        return; // Exit after handling flow
      } else if (template.interactiveTemplateId) {
        setSelectedTemplate(template.interactiveTemplateId);
        setIsInteractiveTemplate(true);
        setShowUpdateTemplate(true);
        return; // Exit after handling interactive template
      } else if (template.id) {
        setSelectedTemplate(template.id);
        setIsInteractiveTemplate(false);
        setShowUpdateTemplate(true);
        return; // Exit after handling regular template
      }
    }
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowUpdateTemplate(false);
    setShowUpdateFlow(false);
    setSelectedTemplate(null);
  };

  useEffect(() => {
    if (!isMounted || !initialData || !svgContainerRef.current) return;

    const calculateLines = () => {
      // Map templates by id for easy lookup
      const templateMap = initialData.templates.reduce((map, template) => {
        if (template.id !== undefined) map[template.id] = template;
        if (template.interactiveTemplateId !== undefined) map[template.interactiveTemplateId] = template;
        if (template.flowId !== undefined) map[template.flowId] = template;
        return map;
      }, {});

      // Start with the first template (assumed to be the root)
      const rootTemplate = initialData.templates[0];
      const { buttonMap } = collectNodesByLevel(rootTemplate, templateMap);
      const newLines = [];

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

        // Fallback: If elements don't become visible within 5 seconds, proceed anyway
        setTimeout(() => {
          elementsToCheck.forEach((element) => {
            if (element) observer.unobserve(element);
          });
          callback();
        }, 5000);
      };

      const drawLines = () => {
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
            console.warn(`Invalid bounding rect for ${buttonId} or ${targetId}`);
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
      
          // Start from the edge center of the button border
          const startX = isTargetLeft
            ? buttonRect.left - svgRect.left // Left edge center
            : buttonRect.right - svgRect.left; // Right edge center
          const startY = buttonRect.top + buttonRect.height / 2 - svgRect.top;
      
          const endX = targetRect.left + targetRect.width / 2 - svgRect.left;
          const endY = targetRect.top - svgRect.top - 10;
      
          // Define control points for a cubic Bézier curve
          const controlPointOffsetX = Math.abs(endX - startX) * 0.3;
          const controlPointOffsetY = Math.abs(endY - startY) * 0.5;
      
          const controlPoint1X =
            startX + (isTargetLeft ? -controlPointOffsetX : controlPointOffsetX);
          const controlPoint1Y = startY + controlPointOffsetY;
          const controlPoint2X =
            endX + (isTargetLeft ? controlPointOffsetX : -controlPointOffsetX);
          const controlPoint2Y = endY - controlPointOffsetY;
      
          const pathD = `M ${startX},${startY} C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${endX},${endY}`;
      
          newLines.push({
            pathD,
            stroke: strokeColor,
            key: `${buttonId}-${targetId}`,
          });
        });
      
        setLines(newLines);
      };

      checkElementsVisibility(drawLines);
    };

    calculateLines();
    window.addEventListener("resize", calculateLines);
    return () => {
      window.removeEventListener("resize", calculateLines);
    };
  }, [isMounted, initialData]);

  if (!isMounted || !initialData) return <Loader />;

  // Map templates and build the flow starting from the first template
  const templateMap = initialData.templates.reduce((map, template) => {
    if (template.id !== undefined) {
      map[template.id] = template;
    } else if (template.interactiveTemplateId !== undefined) {
      map[template.interactiveTemplateId] = template;
    } else if (template.flowId !== undefined) {
      map[template.flowId] = template; // Index flows by flowId
    }
    return map;
  }, {});
  const rootTemplate = initialData.templates[0];
  const { levels } = collectNodesByLevel(rootTemplate, templateMap);
  const maxCardsPerLevel = Math.max(
    ...Object.values(levels).map((level) => level.length)
  );
  const minWidthNeeded = maxCardsPerLevel * 320 + 40;

  return (
    <>
      <Head>
        <title>Template Flow Visualization</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {showUpdateFlow ? (
        <UpdateFlowPage
          Flow_Id={selectedTemplate} // Pass flowId to UpdateFlowPage
          onclose={handleCloseModal}
        />
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
        // Render the main content when showUpdateTemplate is false
        <div
          style={{
            overflow: "auto",
            height: "100vh",
            width: "100vw",
            position: "relative",
            backgroundColor: "#f8f9fa",
          }}
        >
          <Container
            fluid
            style={{
              padding: "40px 20px",
              position: "relative",
              minWidth: `${minWidthNeeded}px`,
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
                    strokeWidth="2"
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
    node.title,
    node.content,
    node.buttons,
    node.actionDetails || {},
    () => handleCardClick(node.id),
    templateMap[node.id] // Pass the full template object
  )
)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
