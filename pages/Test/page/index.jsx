import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Simulated API data for your specific scenario
const fetchTemplateData = async () => {
  return {
    template: {
      id: "main_template",
      message: "Welcome! What would you like to do?",
      buttons: [
        {
          id: "btn_1",
          text: "Explore Options",
          action: "send_template",
          next_template: {
            id: "options_template",
            message: "Choose an option:",
            buttons: [
              {
                id: "btn_o1",
                text: "More Details",
                action: "send_template",
                next_template: {
                  id: "details_template",
                  message: "Select an action:",
                  buttons: [
                    { id: "btn_d1", text: "Visit Website", action: "open_website", url: "https://example.com" },
                    { id: "btn_d2", text: "Call Center", action: "call_center", phone: "+1234567890" },
                  ],
                },
              },
              { id: "btn_o2", text: "Chat with Agent", action: "start_chat", agent_group: "support_team" },
              { id: "btn_o3", text: "Block Me", action: "block_user" },
            ],
          },
        },
        {
          id: "btn_2",
          text: "Get Help",
          action: "send_template",
          next_template: {
            id: "help_template",
            message: "How can we assist you?",
            buttons: [
              {
                id: "btn_h1",
                text: "Learn More",
                action: "send_template",
                next_template: {
                  id: "learn_template",
                  message: "Explore further:",
                  buttons: [
                    { id: "btn_l1", text: "Visit Website", action: "open_website", url: "https://help.com" },
                  ],
                },
              },
              { id: "btn_h2", text: "Chat with Agent", action: "start_chat", agent_group: "help_team" },
              { id: "btn_h3", text: "Unsubscribe", action: "unsubscribe" },
            ],
          },
        },
        { id: "btn_3", text: "Unsubscribe", action: "unsubscribe" },
      ],
    },
  };
};

// Render a single box (template or action) using Reactstrap
const renderBox = (id, title, content, buttons = [], actionDetails = {}) => (
  <Col xs="auto" key={id}>
    <Card id={id} className="mb-3" style={{ width: '300px' }}>
      <CardBody>
        <CardTitle tag="h5">{title ? title.replace(/_/g, ' ').toUpperCase() : 'Unnamed'}</CardTitle>
        <CardText>{content || 'No content'}</CardText>
        {buttons.map((button) => (
          <div key={button.id} id={button.id} className="mb-2">
            <Button color="primary" block disabled>
              {button.text || 'Unnamed Button'}
            </Button>
            <small className="text-muted">Action: {button.action ? button.action.replace(/_/g, ' ') : 'No Action'}</small>
          </div>
        ))}
        {!buttons.length && actionDetails.action && (
          <CardText className="text-muted">
            {actionDetails.action === "open_website" ? `URL: ${actionDetails.url}` :
             actionDetails.action === "call_center" ? `Phone: ${actionDetails.phone}` :
             actionDetails.action === "start_chat" ? `Agent: ${actionDetails.agent_group}` :
             actionDetails.action}
          </CardText>
        )}
      </CardBody>
    </Card>
  </Col>
);

// Collect all nodes by level with button-to-action mapping
const collectNodesByLevel = (template, level = 0, levels = {}, buttonMap = {}) => {
  if (!template || !template.id) return { levels, buttonMap };

  if (!levels[level]) levels[level] = [];
  levels[level].push({ id: template.id, title: template.id, content: template.message, buttons: template.buttons || [] });

  template.buttons?.forEach((button) => {
    let targetId;
    if (button.action === "send_template" && button.next_template) {
      targetId = button.next_template.id;
      collectNodesByLevel(button.next_template, level + 1, levels, buttonMap);
    } else {
      targetId = button.action === "send_flow" ? `${button.flow_id}_action` :
                 button.action === "start_chat" ? `${button.agent_group || 'chat'}_action` :
                 button.action === "open_website" ? `${button.id}_website_action` :
                 button.action === "call_center" ? `${button.id}_call_action` :
                 `${button.action}_action`;
      const actionTitle = button.action === "send_flow" ? button.flow_id :
                          button.action === "start_chat" ? button.agent_group :
                          button.action === "open_website" ? "Website" :
                          button.action === "call_center" ? "Call Center" :
                          button.action;
      const actionContent = button.action === "block_user" ? "User Blocked" :
                            button.action === "unsubscribe" ? "User Unsubscribed" :
                            button.action === "start_chat" ? `Chat with ${button.agent_group || 'Team'}` :
                            button.action === "open_website" ? "Open Website" :
                            button.action === "call_center" ? "Call Center" :
                            `Flow: ${button.flow_id || 'Started'}`;
      if (!levels[level + 1]) levels[level + 1] = [];
      levels[level + 1].push({ id: targetId, title: actionTitle, content: actionContent, buttons: [], actionDetails: button });
    }
    buttonMap[button.id] = targetId; // Map button to its action/template
  });

  return { levels, buttonMap };
};

export default function FlowVisualization() {
  const [data, setData] = useState(null);
  const linesDrawn = useRef(false);

  useEffect(() => {
    fetchTemplateData().then((response) => setData(response));
  }, []);

  useEffect(() => {
    if (!data || linesDrawn.current) return;

    const drawLines = async () => {
      try {
        //const module = await import('leader-line');
        const LeaderLine = module.default;
        document.querySelectorAll('.leader-line').forEach((line) => line.remove());

        const { buttonMap } = collectNodesByLevel(data.template);

        Object.keys(buttonMap).forEach((buttonId) => {
          const targetId = buttonMap[buttonId];
          const buttonElement = document.getElementById(buttonId);
          const targetElement = document.getElementById(targetId);

          if (buttonElement && targetElement) {
            const action = buttonElement.querySelector('small')?.textContent.split(': ')[1]?.toLowerCase().replace(/ /g, '_') || '';
            let color;
            switch (action) {
              case "send_template":
                color = '#007bff'; // Blue for templates
                break;
              case "open_website":
              case "call_center":
              case "start_chat":
                color = '#28a745'; // Green for actions
                break;
              case "block_user":
              case "unsubscribe":
                color = '#dc3545'; // Red for block/unsubscribe
                break;
              default:
                color = '#007bff';
            }

            new LeaderLine(
              buttonElement,
              targetElement,
              {
                size: 2,
                path: 'straight',
                endPlug: 'arrow1',
                color,
                dash: action === "send_template" ? { animation: true } : false
              }
            );
          } else {
            console.warn(`Could not find elements for button ${buttonId} or target ${targetId}`);
          }
        });

        linesDrawn.current = true;
      } catch (error) {
        console.error('Failed to load LeaderLine:', error);
      }
    };

    const timeoutId = setTimeout(drawLines, 100);
    return () => clearTimeout(timeoutId);
  }, [data]);

  if (!data) return <div>Loading...</div>;

  const { levels } = collectNodesByLevel(data.template);

  return (
    <>
      <Head>
        <title>Template Flow Visualization</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Container fluid style={{ height: '100vh', overflow: 'auto', padding: '20px' }}>
        <h2 className="text-center my-4">WhatsApp Template Flow Visualization</h2>
        {Object.keys(levels).map((level) => (
          <div key={level} className="mb-5">
            <h6 className="text-center">Level {level}</h6>
            <Row className="flex-nowrap" style={{ overflowX: 'auto' }}>
              {levels[level].map((node) => renderBox(
                node.id,
                node.title,
                node.content,
                node.buttons,
                node.actionDetails || {}
              ))}
            </Row>
          </div>
        ))}
      </Container>
    </>
  );
}