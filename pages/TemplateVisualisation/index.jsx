import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  getStraightPath,
  Edge,
} from "@xyflow/react";
import {
  Container,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import "@xyflow/react/dist/style.css";
import { BASE_URL } from "@/utils/apiConstants";
import InteractiveTemplateDropdown from "@/components/Dropdowns/InteractiveTemplateDropdown";
import TemplateDropdown from "@/components/Dropdowns/TemplateDropdown";
import InteractiveTemplateUpdate from "@/pages/InteractiveTemplates/UpdateTemplate";
import UpdateTemplate from "@/pages/Templates/UpdateTemplate";
import UpdateFlowPage from "@/pages/Flows/FlowDetails";
import {
  fetchTemplateVisualization,
  clearTemplateVisualization,
} from "@/slices/TemplateVisualizationSlice";
import App from "@/components/Layout/App";
import showSweetAlert from "@/components/Sweetalert";
import Loader from "@/components/Layout/Loader";

const TemplateVisualisation = ({ Id, type, onclose }) => {
  const dispatch = useDispatch();
  const [showUpdateFlow, setShowUpdateFlow] = useState(false);
  const [showUpdateTemplate, setShowUpdateTemplate] = useState(false);
  const [isInteractiveTemplate, setIsInteractiveTemplate] = useState(false);
  const [parentNodeId, setParentNodeId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [isParent, setIsParent] = useState(false);
  const [templateType, setTemplateType] = useState("");
  const [initialData, setInitialData] = useState(null);
  const { templateVisualizationData, loading, error } = useSelector(
    (state) => state.templateVisualization
  );
  const handleNodeClick = (event, node) => {
    debugger;
    // Check if the click originated from the blue header or its contents
    const isHeaderClick =
      event.target.closest(".Nodeheader") ||
      event.target.closest(".dropdownMenu") ||
      event.target.parentElement.classList.contains("Nodeheader");

    // If the click is on the blue header, do nothing
    if (isHeaderClick) {
      return;
    }

    const templateId = node.id; // Node ID from React Flow
    const template = initialData.find((t) => t.id.toString() === templateId);

    if (!template) return;

    setSelectedId(template.id);

    if (template.type === 3) {
      debugger;
      // Flow node
      setShowUpdateFlow(true);
      setShowUpdateTemplate(false);
    } else if (template.type === 2) {
      // Interactive template
      setIsInteractiveTemplate(true);
      setShowUpdateTemplate(true);
      setShowUpdateFlow(false);
    } else if (template.type === 1) {
      // Non-interactive template
      setIsInteractiveTemplate(false);
      setShowUpdateTemplate(true);
      setShowUpdateFlow(false);
    }
  };
  const closeModals = () => {
    setShowUpdateFlow(false);
    setShowUpdateTemplate(false);
    setSelectedId(null);
  };
  const handleTemplateClick = (e) => {
    setTemplateId(e.target.value);
  };
  const handleTemplateTypeChange = (type) => {
    setTemplateType(type);
    if (!type) {
      setTemplateId(null); // Reset templateId
    }
  };
  const handleInteractiveTemplateClick = (e) => {
    setTemplateId(e.target.value);
  };
  const CustomNode = ({ data }) => {
    const imageUrl = `${BASE_URL}${data.mediaPath}`;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleParentTemplateClick = () => {
      debugger;
      setParentNodeId(data.templateId.toString());
      setIsParent(true);
      setIsDropdownOpen(false);
    };
    const handleRevertClick = () => {
      setParentNodeId(null);
      setIsParent(false);
      setIsDropdownOpen(false);
    };
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const toggleDropdown = (e) => {
      e.stopPropagation(); // Prevent node click events from firing
      setIsDropdownOpen(!isDropdownOpen);
    };
    return (
      <div>
        <Handle type="target" position={Position.Top} id="top" />
        <div style={{ position: "relative" }}>
          {/* Header with three dots */}
          {(data.templateType === 3 ||
            data.templateType === 2 ||
            data.templateType === 1) &&
          data.buttons.length > 0 ? (
            <div
              className="w-full h-5 bg-blue-600 Nodeheader flex items-center justify-end"
              onClick={toggleDropdown}
              style={{ cursor: "pointer" }}
            >
              <div className="p-2">
                <i
                  className="fa fa-ellipsis-v"
                  aria-hidden="true"
                  style={{ color: "white" }}
                ></i>
              </div>
            </div>
          ) : (
            <div className="w-full h-5 bg-gray-600 Nodeheader flex items-center justify-end"></div>
          )}
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="dropdownMenu"
              style={{
                position: "absolute",
                top: (isParent && parentNodeId === data.templateId.toString()) ? "-75px" : "-45px", // Position above the header (adjust based on dropdown height)
                right: "0",
                backgroundColor: "#333", // Dark background like MS Teams
                border: "1px solid #444",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                zIndex: 1000,
                width: "140px",
              }}
            >
              <div
                style={{
                  padding: "6px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={handleParentTemplateClick}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3a3a3a")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Set start node
              </div>
              {(isParent && parentNodeId === data.templateId.toString()) &&  (
                <div
                style={{
                  padding: "6px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={handleRevertClick}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3a3a3a")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Revert
              </div>
              )}
              
            </div>
          )}
        </div>
        <div
          style={{
            padding: "10px",
            border: "1px solid #777",
            background: "#fff",
            width: "300px",
            textAlign: "left",
            position: "relative",
          }}
        >
          <strong>{data.templateName}</strong>
          {data.isFlow ? (
            <div style={{ marginTop: "10px", fontSize: "1em" }}>
              {data.flowName}
            </div>
          ) : (
            <>
              {data.headerType === 3 && imageUrl && (
                <video
                  src={imageUrl}
                  controls
                  muted
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "10px",
                    borderRadius: "3px",
                  }}
                />
              )}
              {data.headerType === 2 && imageUrl && (
                <img
                  src={imageUrl}
                  alt={data.templateName}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "10px",
                    borderRadius: "3px",
                  }}
                />
              )}
              {data.headerType === 1 && data.headerText && (
                <h6
                  style={{
                    marginBottom: "10px",
                    fontWeight: "bold",
                    fontSize: "1.1em",
                  }}
                  dangerouslySetInnerHTML={{ __html: data.headerText }}
                />
              )}
              {data.bodyText && (
                <div
                  style={{ marginBottom: "10px", fontSize: "1em" }}
                  dangerouslySetInnerHTML={{ __html: data.bodyText }}
                />
              )}
              {data.buttons?.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  {data.buttons.map((button, index) => (
                    <div
                      key={button.buttonId}
                      style={{ position: "relative", marginBottom: "4px" }}
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
                        }}
                      >
                        {button.buttonType === 1 && (
                          <span style={{ color: "#00a9ee" }}>
                            <i className="fa fa-share fa-flip-horizontal me-2"></i>
                            {button.buttonText.trim() || "Button"}
                          </span>
                        )}
                        {button.buttonType === 2 && (
                          <span style={{ color: "#00a9ee" }}>
                            <i className="fa fa-phone me-2"></i>
                            {button.buttonText.trim() || "Call"}
                          </span>
                        )}
                        {button.buttonType === 3 && (
                          <span style={{ color: "#00a9ee" }}>
                            <i className="fa fa-external-link me-2"></i>
                            {button.buttonText.trim() || "Visit"}
                          </span>
                        )}
                      </Button>
                      <Handle
                        type="source"
                        position={Position.Right}
                        id={`button-${button.buttonId}`}
                        style={{
                          top: `${
                            ((index + 0.5) * 100) / data.buttons.length
                          }%`,
                          transform: "translateX(50%)",
                          position: "absolute",
                          right: "0",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const TemplateTypeDropdown = ({ onTemplateTypeChange, selectedType }) => {
    return (
      <div className="mb-3">
        <select
          className="form-select border border-gray-300 rounded-md w-full py-1 px-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

  const nodeTypes = {
    custom: CustomNode,
  };
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setTimeout(() => {
      // Step 1: Build a graph representation
      const graph = {};
      const inDegree = {};
      initialData?.forEach((template) => {
        const templateId = template.id.toString();
        graph[templateId] = [];
        inDegree[templateId] = inDegree[templateId] || 0;
        if (template.type === 2) {
          template.details.buttons?.forEach((button) => {
            let targetId;
            if (button.actionId === 8) {
              const flow = initialData.find(
                (t) => t.type === 3 && t.details.actionId === 8
              );
              if (flow) {
                targetId = flow.id.toString();
              }
            } else if (
              button.actionId &&
              initialData.some((t) => t.id === button.actionId)
            ) {
              targetId = button.actionId.toString();
            }
            if (targetId) {
              graph[templateId].push(targetId);
              inDegree[targetId] = (inDegree[targetId] || 0) + 1;
            }
          });
        }
      });

      // Step 2: Find reachable nodes from parentNodeId (if set)
      let reachableNodes = new Set();
      if (parentNodeId) {
        debugger
        const queue = [parentNodeId];
        reachableNodes.add(parentNodeId);
        while (queue.length > 0) {
          const currentId = queue.shift();
          graph[currentId]?.forEach((neighborId) => {
            if (!reachableNodes.has(neighborId)) {
              reachableNodes.add(neighborId);
              queue.push(neighborId);
            }
          });
        }
      } else {
        // If no parent, include all nodes
        initialData?.forEach((template) => {
          reachableNodes.add(template.id.toString());
        });
      }

      // Step 3: Assign levels to nodes using topological sorting
      const levels = {};
      const queue = [];
      const visited = new Set();

      Object.keys(inDegree).forEach((nodeId) => {
        if (inDegree[nodeId] === 0 && reachableNodes.has(nodeId)) {
          queue.push(nodeId);
          levels[nodeId] = 0;
        }
      });

      while (queue.length > 0) {
        const currentId = queue.shift();
        visited.add(currentId);

        graph[currentId].forEach((neighborId) => {
          if (!visited.has(neighborId) && reachableNodes.has(neighborId)) {
            inDegree[neighborId]--;
            if (inDegree[neighborId] === 0) {
              queue.push(neighborId);
              levels[neighborId] = (levels[currentId] || 0) + 1;
            }
          }
        });
      }

      // Step 4: Create nodes with hierarchical positioning
      const nodesPerLevel = {};
      initialData?.forEach((template) => {
        const templateId = template.id.toString();
        if (reachableNodes.has(templateId)) {
          const level = levels[templateId] || 0;
          if (!nodesPerLevel[level]) nodesPerLevel[level] = [];
          nodesPerLevel[level].push(template);
        }
      });

      const newNodes = [];
      const xSpacing = 400;
      const ySpacing = 400;
      const viewportWidth = 1200; 


      Object.keys(nodesPerLevel).forEach((level) => {
        const templates = nodesPerLevel[level];
        const totalNodes = templates.length;
        // Calculate starting x position to center the nodes
        const totalWidth = (totalNodes - 1) * xSpacing;
        const startX = (viewportWidth - totalWidth) / 2; // Center the group of nodes
        templates.forEach((template, index) => {
          if (template.type === 3) {
            debugger
            newNodes.push({
              id: template.id.toString(),
              type: "custom",
              position: {
                x: startX + index * xSpacing, // Use startX to center
                y: level * ySpacing,
              },
              data: {
                templateId: template.details.id,
                templateName: template.details.flowName,
                templateType: template.type,
                headerText: null,
                bodyText: "Flow Screen",
                mediaPath: null,
                buttons: [],
                headerType: null,
                isFlow: true,
              },
            });
          } else {
            debugger
            newNodes.push({
              id: template.id.toString(),
              type: "custom",
              position: {
                x: startX + index * xSpacing, // Use startX to center
                y: level * ySpacing,
              },
              data: {
                templateId: template.details.id,
                templateName: template.details.templateName,
                templateType: template.type,
                headerText: template.details.headerText,
                bodyText: template.details.bodyText,
                footerText: template.details.footerText,
                mediaPath: template.details.mediaPath,
                buttons: template.details.buttons,
                headerType: template.details.headerType,
                isFlow: false,
              },
            });
          }
        });
      });

      // Step 5: Create action nodes and edges
      const actionNodes = [];
      const newEdges = [];
      let actionNodeCounter = 0;

      initialData?.forEach((template) => {
        const templateId = template.id.toString();
        if (!reachableNodes.has(templateId)) return;

        const sourceNode = newNodes.find((n) => n.id === templateId);
        if (!sourceNode) return;

        const actionTypeToButtons = {};
        template.details.buttons?.forEach((button) => {
          let targetId = null;
          const actionTypeLabel =
            button.actionType === 3
              ? "unsubscribe"
              : button.actionType === 5
              ? "chat"
              : button.actionType === 6
              ? "order"
              : button.actionType === 7
              ? "close chat"
              : button.actionType === 9
              ? "block"
              : button.buttonType === 2
              ? `phone_${button.buttonValue || button.buttonId}`
              : button.buttonType === 3
              ? `url_${button.buttonValue || button.buttonId}`
              : "action";

          if (
            button.actionType !== 1 &&
            button.actionType !== 8 &&
            (button.buttonType === 1 ||
              button.buttonType === 2 ||
              button.buttonType === 3)
          ) {
            if (!actionTypeToButtons[actionTypeLabel]) {
              actionTypeToButtons[actionTypeLabel] = [];
            }
            actionTypeToButtons[actionTypeLabel].push(button);
          } else if (
            button.actionId &&
            initialData.some((t) => t.id === button.actionId)
          ) {
            targetId = button.actionId.toString();
            if (reachableNodes.has(targetId)) {
              newEdges.push({
                id: `e${template.id}-${targetId}-${button.buttonId}`,
                source: templateId,
                sourceHandle: `button-${button.buttonId}`,
                target: targetId,
                targetHandle: "top",
                style: {
                  stroke: "black",
                  strokeWidth: 2,
                  strokeDasharray: "5,5",
                },
              });
            }
          }
        });

        Object.keys(actionTypeToButtons).forEach((actionTypeLabel) => {
          const buttons = actionTypeToButtons[actionTypeLabel];
          const firstButton = buttons[0];
          let actionNodeId = `action_${template.id}_${actionTypeLabel}`;
          let actionTitle, actionContent;

          if (actionTypeLabel === "chat") {
            actionTitle = "Chat With Agent";
            actionContent = "Start Chat";
          } else if (actionTypeLabel === "order") {
            actionTitle = "Order";
            actionContent = "Place Order";
          } else if (actionTypeLabel === "close chat") {
            actionTitle = "Close Chat";
            actionContent = "End Chat";
          } else if (actionTypeLabel === "unsubscribe") {
            actionTitle = "Unsubscribe User";
            actionContent = "Unsubscribed";
          } else if (actionTypeLabel === "block") {
            actionTitle = "Block User";
            actionContent = "Blocked";
          } else if (actionTypeLabel.startsWith("phone_")) {
            actionTitle = firstButton.buttonText;
            actionContent = `Call: ${
              firstButton.buttonValue || "Not provided"
            }`;
          } else if (actionTypeLabel.startsWith("url_")) {
            actionTitle = firstButton.buttonText;
            actionContent = `Visit: ${
              firstButton.buttonValue || "Not provided"
            }`;
          } else {
            actionTitle = "Action";
            actionContent = actionTypeLabel;
          }

          actionNodes.push({
            id: actionNodeId,
            type: "custom",
            position: {
              x: sourceNode.position.x,
              y: sourceNode.position.y + ySpacing,
            },
            data: {
              templateName: actionTitle,
              bodyText: actionContent,
              mediaPath: null,
              buttons: [],
              headerType: 1,
            },
          });

          buttons.forEach((button) => {
            newEdges.push({
              id: `e${template.id}-${actionNodeId}-${button.buttonId}`,
              source: templateId,
              sourceHandle: `button-${button.buttonId}`,
              target: actionNodeId,
              targetHandle: "top",
              style: {
                stroke: "black",
                strokeWidth: 2,
                strokeDasharray: "5,5",
              },
            });
          });

          actionNodeCounter++;
        });
      });

      setNodes([...newNodes, ...actionNodes]);
      setEdges(newEdges);
    }, 1000);
  }, [setNodes, setEdges, initialData, parentNodeId]);


  useEffect(() => {
    const fetchData = async () => {
      setInitialData(null);

      try {
        dispatch(
          fetchTemplateVisualization({
            templateId: Id,
            templatetype: type,
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

  return (
    <>
      {!showUpdateFlow && !showUpdateTemplate ? (
        <div>
          <div>
            <h1>Template Visualisation</h1>
          </div>

          <div
            style={{
              height: "75vh",
              textAlign: "center",
              border: "1px solid black",
            }}
          >
            {(!initialData || loading) && <Loader />}
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onNodeClick={handleNodeClick}
              fitView
            >
              <Background
                bgColor="#f0f0f0"
                color="black"
                variant="dots"
                gap={20}
                size={1}
              />
              <Controls />
            </ReactFlow>
          </div>
          <div className="w-full flex justify-end">
            <button
              type="button"
              className="flex items-center gap-2 text-gray-700 hover:text-whie font-medium transition-all Btn-Regular-1 mt-2"
              onClick={onclose}
            >
              Back
            </button>
          </div>
        </div>
      ) : null}
      {showUpdateFlow && (
        <UpdateFlowPage Flow_Id={selectedId} onclose={closeModals} />
      )}
      {showUpdateTemplate && isInteractiveTemplate && (
        <InteractiveTemplateUpdate
          Template_Id={selectedId}
          onclose={closeModals}
        />
      )}
      {showUpdateTemplate && !isInteractiveTemplate && (
        <UpdateTemplate Template_Id={selectedId} onclose={closeModals} />
      )}
    </>
  );
};

export default TemplateVisualisation;
