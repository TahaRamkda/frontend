import React from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
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
  {
    id: '7',
    templateName: 'Reschedule Meeting Template',
    buttons: [
      { id: '7-1', name: 'Select New Time', action: 'Time Selected' },
    ],
  },
  {
    id: '8',
    templateName: 'Add Items Template',
    buttons: [
      { id: '8-1', name: 'Finalize Order', action: 'Order Finalized' },
    ],
  },
  {
    id: '9',
    templateName: 'Remove Items Template',
    buttons: [
      { id: '9-1', name: 'Finalize Order', action: 'Order Finalized' },
    ],
  },
];

// Function to process the data and create nodes and edges for ReactFlow
const processFlowData = (data) => {
  const nodes = [];
  const edges = [];

  data.forEach((template) => {
    // Add a node for the template
    nodes.push({
      id: template.id,
      data: { label: template.templateName },
      position: { x: Math.random() * 600, y: Math.random() * 400 },
    });

    // Add edges for each button in the template
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
          position: { x: Math.random() * 600, y: Math.random() * 400 },
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

  return { nodes, edges };
};

const FlowChartPage = () => {
  const { nodes, edges } = processFlowData(flowData);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background variant="dots" />
      </ReactFlow>
    </div>
  );
};

export default FlowChartPage;
