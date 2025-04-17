import React, { useState, useEffect } from "react";
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

const TemplateVisualisation = ({Id, type, onclose}) => {
  
  const dispatch = useDispatch();
  const [showUpdateFlow, setShowUpdateFlow] = useState(false);
  const [showUpdateTemplate, setShowUpdateTemplate] = useState(false);
  const [isInteractiveTemplate, setIsInteractiveTemplate] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [templateType, setTemplateType] = useState("");
  const [initialData, setInitialData] = useState(null);
   const { templateVisualizationData, loading, error } = useSelector(
      (state) => state.templateVisualization
    );
  const handleNodeClick = (_, node) => {
    
    
    const templateId = node.id; // Node ID from React Flow
    const template = initialData.find(
      (t) => t.id.toString() === templateId
    );
  
    if (!template) return;
  
    setSelectedId(template.id);
    
    if (template.type === 3) {
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
    return (
      <div
        style={{
          padding: "10px",
          border: "1px solid #777",
          borderRadius: "5px",
          background: "#fff",
          width: "300px",
          textAlign: "left",
          position: "relative",
        }}
      >
        <Handle type="target" position={Position.Top} id="top" />
        <strong>{data.templateName}</strong>
        {data.isFlow ? (
          // For flow nodes, only show the flowName
          <div style={{ marginTop: "10px", fontSize: "1em" }}>
            {data.flowName}
            <hr />
            <div
                style={{ marginBottom: "10px", fontSize: "1em", textAlign: "center" }}
                dangerouslySetInnerHTML={{ __html: data.bodyText }}
              />
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
                        top: `${((index + 0.5) * 100) / data.buttons.length}%`,
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
      // Step 1: Build a graph representation to determine levels
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
              // For actionId 8, connect to flow (type 3) with matching flowId
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

      // Step 2: Assign levels to nodes using topological sorting
      const levels = {};
      const queue = [];
      const visited = new Set();

      // Start with nodes that have no incoming edges (root nodes)
      Object.keys(inDegree).forEach((nodeId) => {
        if (inDegree[nodeId] === 0) {
          queue.push(nodeId);
          levels[nodeId] = 0;
        }
      });

      // Process nodes level by level
      while (queue.length > 0) {
        const currentId = queue.shift();
        visited.add(currentId);

        graph[currentId].forEach((neighborId) => {
          if (!visited.has(neighborId)) {
            inDegree[neighborId]--;
            if (inDegree[neighborId] === 0) {
              queue.push(neighborId);
              levels[neighborId] = (levels[currentId] || 0) + 1;
            }
          }
        });
      }

      // Step 3: Create nodes with hierarchical positioning
      const nodesPerLevel = {};
      initialData?.forEach((template) => {
        const level = levels[template.id.toString()] || 0;
        if (!nodesPerLevel[level]) nodesPerLevel[level] = [];
        nodesPerLevel[level].push(template);
      });

      const newNodes = [];
      const xSpacing = 400; // Horizontal spacing between nodes
      const ySpacing = 400; // Vertical spacing between levels

      Object.keys(nodesPerLevel).forEach((level) => {
        const templates = nodesPerLevel[level];
        templates.forEach((template, index) => {
          if (template.type === 3) {
            // Flow node
            newNodes.push({
              id: template.id.toString(),
              type: "custom",
              position: {
                x: index * xSpacing,
                y: level * ySpacing,
              },
              data: {
                templateId: template.details.id,
                templateName: template.details.flowName,
                headerText: null,
                bodyText: "FLow Screen",
                mediaPath: null,
                buttons: [],
                headerType: null,
                isFlow: true,
              },
            });
          } else {
            // Template node
            newNodes.push({
              id: template.id.toString(),
              type: "custom",
              position: {
                x: index * xSpacing,
                y: level * ySpacing,
              },
              data: {
                templateId: template.details.id,
                templateName: template.details.templateName,
                headerText: template.details.headerText,
                bodyText: template.details.bodyText,
                mediaPath: template.details.mediaPath,
                buttons: template.details.buttons,
                headerType: template.details.headerType,
                isFlow: false,
              },
            });
          }
        });
      });

      // Step 4: Create action nodes and edges
      const actionNodes = [];
      const newEdges = [];
      let actionNodeCounter = 0;

      initialData?.forEach((template) => {
        const sourceNode = newNodes.find(
          (n) => n.id === template.id.toString()
        );
        if (!sourceNode) return;

        // Group buttons by action type to avoid duplicate action nodes
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
            (button.buttonType === 1 || button.buttonType === 2 || button.buttonType === 3)
          ) {
            // Group buttons by action type
            if (!actionTypeToButtons[actionTypeLabel]) {
              actionTypeToButtons[actionTypeLabel] = [];
            }
            actionTypeToButtons[actionTypeLabel].push(button);
          } else if (
            button.actionId &&
            initialData.some((t) => t.id === button.actionId)
          ) {
            targetId = button.actionId.toString();
            newEdges.push({
              id: `e${template.id}-${targetId}-${button.buttonId}`,
              source: template.id.toString(),
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
        });

        // Create one action node per action type
        Object.keys(actionTypeToButtons).forEach((actionTypeLabel) => {
          const buttons = actionTypeToButtons[actionTypeLabel];
          const firstButton = buttons[0]; // Use the first button for node details
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
            actionContent = `Call: ${firstButton.buttonValue || "Not provided"}`;
          } else if (actionTypeLabel.startsWith("url_")) {
            actionTitle = firstButton.buttonText;
            actionContent = `Visit: ${firstButton.buttonValue || "Not provided"}`;
          } else {
            actionTitle = "Action";
            actionContent = actionTypeLabel;
          }

          // Create a single action node for this action type
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

          // Create edges from each button to the single action node
          buttons.forEach((button) => {
            newEdges.push({
              id: `e${template.id}-${actionNodeId}-${button.buttonId}`,
              source: template.id.toString(),
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
  }, [setNodes, setEdges, initialData]);

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
            <h1>WhatsApp Flow Integration</h1>
          </div>
          
        <div style={{  height: "75vh", textAlign: "center", border: "1px solid black" }}>
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
             <Background bgColor="#f0f0f0" color="black" variant="dots" gap={20} size={1} />
              <Controls />
            </ReactFlow>
          
        </div>
        <div className="w-full flex justify-end">
        <button type="button"
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
