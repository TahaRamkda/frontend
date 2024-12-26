import React from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

// Long sample data representing the WhatsApp templates and their flows
const flowData = [
  {
    id: '1',
    templateName: 'Welcome Template',
    buttons: [
      { id: '1-1', name: 'Interested', nextTemplateId: '2' },
      { id: '1-2', name: 'Not Interested', action: 'Close Chat' },
      { id: '1-3', name: 'Order Now', nextTemplateId: '3' },
    ],
  },
  {
    id: '2',
    templateName: 'Follow-Up Template',
    buttons: [
      { id: '2-1', name: 'Request Info', nextTemplateId: '4' },
      { id: '2-2', name: 'Schedule Meeting', nextTemplateId: '5' },
    ],
  },
  {
    id: '3',
    templateName: 'Order Template',
    buttons: [
      { id: '3-1', name: 'Confirm Order', action: 'Place Order' },
      { id: '3-2', name: 'Modify Order', nextTemplateId: '6' },
      { id: '3-3', name: 'Cancel Order', action: 'Close Chat' },
    ],
  },
  {
    id: '4',
    templateName: 'Information Template',
    buttons: [
      { id: '4-1', name: 'Provide Feedback', action: 'Feedback Collected' },
    ],
  },
  {
    id: '5',
    templateName: 'Meeting Confirmation Template',
    buttons: [
      { id: '5-1', name: 'Confirm', action: 'Meeting Scheduled' },
      { id: '5-2', name: 'Reschedule', nextTemplateId: '7' },
    ],
  },
  {
    id: '6',
    templateName: 'Modify Order Template',
    buttons: [
      { id: '6-1', name: 'Add Items', nextTemplateId: '8' },
      { id: '6-2', name: 'Remove Items', nextTemplateId: '9' },
    ],
  },
];

// DAGRE Configuration
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 80;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction, ranksep: 150, nodesep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const position = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: position.x - nodeWidth / 2, y: position.y - nodeHeight / 2 },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// Processing flow data into React Flow's node and edge format
const processFlowData = (data) => {
  const nodes = [];
  const edges = [];

  data.forEach((template) => {
    nodes.push({
      id: template.id,
      data: { label: template.templateName },
      style: { width: nodeWidth, height: nodeHeight },
      position: { x: 0, y: 0 },
    });

    template.buttons.forEach((button) => {
      if (button.nextTemplateId) {
        edges.push({
          id: `e${template.id}-${button.nextTemplateId}`,
          source: template.id,
          target: button.nextTemplateId,
          label: button.name,
        });
      } else if (button.action) {
        const actionNodeId = `${template.id}-${button.id}-action`;
        nodes.push({
          id: actionNodeId,
          data: { label: button.action },
          style: { width: nodeWidth, height: nodeHeight },
          position: { x: 0, y: 0 },
        });
        edges.push({
          id: `e${template.id}-${actionNodeId}`,
          source: template.id,
          target: actionNodeId,
          label: button.name,
        });
      }
    });
  });

  return getLayoutedElements(nodes, edges);
};

const FlowChartPage = () => {
  const { nodes, edges } = processFlowData(flowData);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodeTypes={{}}
        edgeTypes={{}}
      >
        <MiniMap />
        <Controls />
        <Background variant="lines" />
      </ReactFlow>
    </div>
  );
};

export default FlowChartPage;
