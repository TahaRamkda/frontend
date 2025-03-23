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
import updateIntTemplate from "@/pages/InteractiveTemplates/UpdateTemplate"
import UpdateTemplate from "@/pages/Templates/UpdateTemplate"
// Action type mappings (unchanged)
export const dropdownOptions = [
  { label: "NONE", value: 0 },
  { label: "TEMPLATE", value: 1 },
  { label: "UNSUBSCRIBE", value: 3 },
  { label: "BLOCK", value: 4 },
  { label: "CHAT", value: 5 },
  { label: "ORDER", value: 6 },
  { label: "CLOSE CHAT", value: 7 },
  { label: "FLOWS", value: 8 },
];

// Simulated API data with updated IDs and actionIds
const fetchTemplateData = async () => {
  return {
    templates: [
      // Template 1: Starting template
      {
        id: 1,
        clientId: 1,
        clientName: "Burger King",
        senderId: 1,
        senderName: "Burger King",
        templateName: "burgerking_offer",
        category: "MARKETING",
        language: "en",
        status: "APPROVED",
        isApproved: true,
        headerType: 1,
        headerText: "🍔 Burger King Offer!",
        headerParamCount: 0,
        bodyText:
          "Get 30% off your next meal, {{customername}}! Choose your favorite offer below.",
        bodyParamCount: 1,
        footerText: "Limited time offer",
        buttons: [
          {
            buttonId: 1,
            buttonText: "Chicken",
            buttonValue: "",
            buttonType: 1,
            sequence: 0,
            actionId: 2,
            actionType: 1,
          }, // Leads to template id: 2
          {
            buttonId: 2,
            buttonText: "Beef",
            buttonValue: "",
            buttonType: 1,
            sequence: 1,
            actionId: 3,
            actionType: 1,
          }, // Leads to template id: 3
          {
            buttonId: 3,
            buttonText: "Unsubscribe",
            buttonValue: "",
            buttonType: 1,
            sequence: 2,
            actionId: 0,
            actionType: 3,
          }, // Unsubscribe action
        ],
        parameters: [
          {
            paramId: 1,
            paramName: "{{customername}}",
            paramType: 1,
            paramDefaultValue: "Alex",
            sequence: 0,
          },
        ],
      },
      // Template 2: Chicken offers
      {
        id: 2,
        clientId: 1,
        clientName: "Burger King",
        senderId: 1,
        senderName: "Burger King",
        templateName: "chicken_offer",
        category: "MARKETING",
        language: "en",
        status: "APPROVED",
        isApproved: true,
        headerType: 1,
        headerText: "Chicken Offers",
        headerParamCount: 0,
        bodyText: "Explore our delicious chicken meals!",
        bodyParamCount: 0,
        footerText: "Taste the difference",
        buttons: [
          {
            buttonId: 4,
            buttonText: "Mega Chicken Meal",
            buttonValue: "",
            buttonType: 1,
            sequence: 0,
            actionId: 4,
            actionType: 1,
          }, // Leads to template id: 4
          {
            buttonId: 5,
            buttonText: "Whopper Meal",
            buttonValue: "",
            buttonType: 1,
            sequence: 1,
            actionId: 5,
            actionType: 1,
          }, // Leads to template id: 5
          {
            buttonId: 6,
            buttonText: "Visit Website",
            buttonValue: "https://burgerking.com",
            buttonType: 3,
            sequence: 2,
            actionId: 0,
            actionType: 5,
          }, // URL action (mapped to CHAT)
        ],
      },
      // Template 3: Beef offers
      {
        id: 3,
        clientId: 1,
        clientName: "Burger King",
        senderId: 1,
        senderName: "Burger King",
        templateName: "beef_offer",
        category: "MARKETING",
        language: "en",
        status: "APPROVED",
        isApproved: true,
        headerType: 1,
        headerText: "Beef Offers",
        headerParamCount: 0,
        bodyText: "Savor our beefy delights!",
        bodyParamCount: 0,
        footerText: "Indulge today",
        buttons: [
          {
            buttonId: 7,
            buttonText: "Mega Beef Meal",
            buttonValue: "",
            buttonType: 1,
            sequence: 0,
            actionId: 4,
            actionType: 1,
          }, // Leads to template id: 4
          {
            buttonId: 8,
            buttonText: "Ramadan Offer",
            buttonValue: "",
            buttonType: 1,
            sequence: 1,
            actionId: 6,
            actionType: 1,
          }, // Leads to template id: 6
          {
            buttonId: 9,
            buttonText: "Call Support",
            buttonValue: "+1234567890",
            buttonType: 2,
            sequence: 2,
            actionId: 0,
            actionType: 5,
          }, // Call action (mapped to CHAT)
        ],
      },
      // Template 4: Meal details (used for Mega Chicken Meal and Mega Beef Meal)
      {
        id: 4,
        clientId: 1,
        clientName: "Burger King",
        senderId: 1,
        senderName: "Burger King",
        templateName: "meal_details",
        category: "MARKETING",
        language: "en",
        status: "APPROVED",
        isApproved: true,
        headerType: 1,
        headerText: "{{mealname}} Details",
        headerParamCount: 1,
        bodyText: "Enjoy your {{mealname}} for only {{price}}!",
        bodyParamCount: 2,
        footerText: "Order now and save",
        buttons: [
          {
            buttonId: 10,
            buttonText: "Order Now",
            buttonValue: "",
            buttonType: 1,
            sequence: 0,
            actionId: 0,
            actionType: 6,
          }, // Order action
          {
            buttonId: 11,
            buttonText: "Chat Support",
            buttonValue: "",
            buttonType: 1,
            sequence: 1,
            actionId: 0,
            actionType: 5,
          }, // Chat action
        ],
        parameters: [
          {
            paramId: 2,
            paramName: "{{mealname}}",
            paramType: 1,
            paramDefaultValue: "Meal",
            sequence: 0,
          },
          {
            paramId: 3,
            paramName: "{{price}}",
            paramType: 2,
            paramDefaultValue: "$10",
            sequence: 1,
          },
        ],
      },
      // Template 5: Meal details (used for Whopper Meal)
      {
        id: 5,
        clientId: 1,
        clientName: "Burger King",
        senderId: 1,
        senderName: "Burger King",
        templateName: "meal_details",
        category: "MARKETING",
        language: "en",
        status: "APPROVED",
        isApproved: true,
        headerType: 1,
        headerText: "{{mealname}} Details",
        headerParamCount: 1,
        bodyText: "Enjoy your {{mealname}} for only {{price}}!",
        bodyParamCount: 2,
        footerText: "Order now and save",
        buttons: [
          {
            buttonId: 12,
            buttonText: "Order Now",
            buttonValue: "",
            buttonType: 1,
            sequence: 0,
            actionId: 0,
            actionType: 6,
          },
          {
            buttonId: 13,
            buttonText: "Chat Support",
            buttonValue: "",
            buttonType: 1,
            sequence: 1,
            actionId: 0,
            actionType: 5,
          },
        ],
        parameters: [
          {
            paramId: 2,
            paramName: "{{mealname}}",
            paramType: 1,
            paramDefaultValue: "Meal",
            sequence: 0,
          },
          {
            paramId: 3,
            paramName: "{{price}}",
            paramType: 2,
            paramDefaultValue: "$10",
            sequence: 1,
          },
        ],
      },
      // Template 6: Meal details (used for Ramadan Offer)
      {
        id: 6,
        clientId: 1,
        clientName: "Burger King",
        senderId: 1,
        senderName: "Burger King",
        templateName: "meal_details",
        category: "MARKETING",
        language: "en",
        status: "APPROVED",
        isApproved: true,
        headerType: 1,
        headerText: "{{mealname}} Details",
        headerParamCount: 1,
        bodyText: "Enjoy your {{mealname}} for only {{price}}!",
        bodyParamCount: 2,
        footerText: "Order now and save",
        buttons: [
          {
            buttonId: 14,
            buttonText: "Order Now",
            buttonValue: "",
            buttonType: 1,
            sequence: 0,
            actionId: 0,
            actionType: 6,
          },
          {
            buttonId: 15,
            buttonText: "Chat Support",
            buttonValue: "",
            buttonType: 1,
            sequence: 1,
            actionId: 0,
            actionType: 5,
          },
        ],
        parameters: [
          {
            paramId: 2,
            paramName: "{{mealname}}",
            paramType: 1,
            paramDefaultValue: "Meal",
            sequence: 0,
          },
          {
            paramId: 3,
            paramName: "{{price}}",
            paramType: 2,
            paramDefaultValue: "$10",
            sequence: 1,
          },
        ],
      },
    ],
  };
};

// Render a single box (fixed id assignment)
const renderBox = (id, title, content, buttons = [], actionDetails = {},onCardClick) => (
  <Col xs="auto" key={id}>
    <Card
      id={id}
      className="mb-3 position-relative"
      style={{ width: "300px" }}
      onClick={onCardClick}
    >
      <CardBody>
        <CardTitle tag="h5">
          {title ? title.replace(/_/g, " ").toUpperCase() : "Unnamed"}
        </CardTitle>
        <CardText>{content || "No content"}</CardText>
        {buttons.map((button) => (
          <div
            key={button.buttonId}
            id={`btn_${button.buttonId}`}
            className="mb-2"
            data-action={dropdownOptions
              .find((opt) => opt.value === button.actionType)
              ?.label.toLowerCase()}
            data-target={
              button.actionType === 1 && button.buttonType === 1
                ? `template_${button.actionId}`
                : `action_${button.buttonId}`
            }
          >
            <Button color="primary" block disabled>
              {button.buttonText || "Unnamed Button"}
            </Button>
          </div>
        ))}
        {!buttons.length && actionDetails.actionType !== undefined && (
          <CardText className="text-muted">
            {actionDetails.actionType === 0
              ? "No Action"
              : dropdownOptions.find(
                  (opt) => opt.value === actionDetails.actionType
                )?.label || "Unknown Action"}
          </CardText>
        )}
      </CardBody>
    </Card>
  </Col>
);


// Collect nodes by level (fixed targetId assignment)
const collectNodesByLevel = (
  template,
  templateMap,
  level = 0,
  levels = {},
  buttonMap = {},
  visited = new Set()
) => {
  if (!template || !template.id) return { levels, buttonMap };

  // Prevent infinite loops by tracking visited templates
  if (visited.has(template.id)) return { levels, buttonMap };
  visited.add(template.id);

  const templateId = `template_${template.id}`;
  if (!levels[level]) levels[level] = [];
  const content = `${template.headerText || ""}\n\n${
    template.bodyText || ""
  }\n\n${template.footerText || ""}`;
  levels[level].push({
    id: templateId,
    title: template.templateName,
    content,
    buttons: template.buttons || [],
  });

  template.buttons?.forEach((button) => {
    let targetId;
    let actionTypeLabel;

    // Determine the action based on buttonType
    if (button.buttonType === 1) {
      // Button Type 1: Use actionType from dropdownOptions
      actionTypeLabel = dropdownOptions
        .find((opt) => opt.value === button.actionType)
        ?.label.toLowerCase();
      if (button.actionType === 1) {
        // If actionType is TEMPLATE, actionId contains the target template id
        const nextTemplate = templateMap[button.actionId];
        targetId = `template_${button.actionId}`;
        if (nextTemplate) {
          // Dynamically set parameters for the meal_details templates
          // if ([4, 5, 6].includes(nextTemplate.id)) {
          //   let mealName, price;
          //   switch (button.buttonText) {
          //     case "Mega Chicken Meal":
          //       mealName = "Mega Chicken Meal";
          //       price = "$10";
          //       break;
          //     case "Whopper Meal":
          //       mealName = "Whopper Meal";
          //       price = "$12";
          //       break;
          //     case "Mega Beef Meal":
          //       mealName = "Mega Beef Meal";
          //       price = "$15";
          //       break;
          //     case "Ramadan Offer":
          //       mealName = "Ramadan Special Beef Meal";
          //       price = "$13";
          //       break;
          //     default:
          //       mealName = "Meal";
          //       price = "$10";
          //   }
          //   nextTemplate.parameters = [
          //     { paramId: 2, paramName: "{{mealname}}", paramType: 1, paramDefaultValue: mealName, sequence: 0 },
          //     { paramId: 3, paramName: "{{price}}", paramType: 2, paramDefaultValue: price, sequence: 1 }
          //   ];
          //   nextTemplate.headerText = `${mealName} Details`;
          //   nextTemplate.bodyText = `Enjoy your ${mealName} for only ${price}!`;
          // }
          collectNodesByLevel(
            nextTemplate,
            templateMap,
            level + 1,
            levels,
            buttonMap,
            visited
          );
        }
      } else {
        // Other action types (BLOCK, CHAT, ORDER, etc.)
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
      // Button Type 2: Call/Phone Number (mapped to CHAT)
      actionTypeLabel = "chat"; // Since CALL is not allowed, map to CHAT
      targetId = `action_${button.buttonId}`;
      const actionTitle = button.buttonText; // Use buttonText as the heading
      const actionContent = `Call: ${button.buttonValue || "Not provided"}`;
      if (!levels[level + 1]) levels[level + 1] = [];
      levels[level + 1].push({
        id: targetId,
        title: actionTitle,
        content: actionContent,
        buttons: [],
        actionDetails: { ...button, actionType: 5 }, // Set actionType to CHAT
      });
    } else if (button.buttonType === 3) {
      // Button Type 3: URL/Visit Website (mapped to CHAT)
      actionTypeLabel = "chat"; // Since VISIT is not allowed, map to CHAT
      targetId = `action_${button.buttonId}`;
      const actionTitle = button.buttonText; // Use buttonText as the heading
      const actionContent = `Visit: ${button.buttonValue || "Not provided"}`;
      if (!levels[level + 1]) levels[level + 1] = [];
      levels[level + 1].push({
        id: targetId,
        title: actionTitle,
        content: actionContent,
        buttons: [],
        actionDetails: { ...button, actionType: 5 }, // Set actionType to CHAT
      });
    }

    buttonMap[`btn_${button.buttonId}`] = targetId;
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
  const [showUpdateTemplate, setShowUpdateTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null); 
  const [isInteractiveTemplate, setIsInteractiveTemplate] = useState(false); 
  // Ensure component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCardClick = (templateId) => {
    debugger
    const template = initialData.templates.find((t) => t.id === templateId);
    setSelectedTemplate(template);
    if (template && template.interactiveTemplateId) {
      setIsInteractiveTemplate(true);
    } else {
      setIsInteractiveTemplate(false);
    }
    setShowUpdateTemplate(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowUpdateTemplate(false);
    setSelectedTemplate(null);
  };

  useEffect(() => {
    if (!isMounted || !initialData || !svgContainerRef.current) return;

    const calculateLines = () => {
      // Map templates by id for easy lookup
      const templateMap = initialData.templates.reduce((map, template) => {
        map[template.id] = template;
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

          const cardElement = buttonElement.closest(".card");
          if (!cardElement) {
            console.warn(`Parent card not found for button: ${buttonId}`);
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

          const startX = isTargetLeft
            ? buttonRect.left - svgRect.left + 5
            : buttonRect.right - svgRect.left - 5;
          const startY = buttonRect.top + buttonRect.height / 2 - svgRect.top;

          const endX = targetRect.left + targetRect.width / 2 - svgRect.left;
          const endY = targetRect.top - svgRect.top - 10;

          // Define control points for a cubic Bézier curve
          const controlPointOffsetX = Math.abs(endX - startX) * 0.3;
          const controlPointOffsetY = Math.abs(endY - startY) * 0.5;

          const controlPoint1X =
            startX +
            (isTargetLeft ? -controlPointOffsetX : controlPointOffsetX);
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
    map[template.id] = template;
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
      {showUpdateTemplate ? (
        // Conditionally render the appropriate modal based on template type
        isInteractiveTemplate ? (
          <updateIntTemplate
            interactiveTemplateId={selectedTemplate?.interactiveTemplateId} // Pass interactiveTemplateId
            onclose={handleCloseModal}
          />
        ) : (
          <UpdateTemplate
          Template_Id={selectedTemplate} // Pass regular template id
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
                          () => handleCardClick(node.id)
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