'use client'; // Mark as client-side component

import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Table,
  Badge,
  Alert,
  Nav,
  NavItem,
} from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dummy data
const agentStatusData = [
  { status: 'Online', count: 25, color: '#4caf50', icon: 'bi-headset' }, // Green
  { status: 'Not Ready to Chat', count: 8, color: '#2196f3', icon: 'bi-pause' }, // Blue
  { status: 'Offline', count: 12, color: '#f44336', icon: 'bi-person' }, // Red
  { status: 'On Training', count: 5, color: '#ff9800', icon: 'bi-book' }, // Yellow
];

const chatStatusData = [
  { id: 'C001', customer: 'John Doe', status: 'Waiting for Agent', waitTime: '5 min', icon: 'bi-hourglass-split' },
  { id: 'C002', customer: 'Jane Smith', status: 'Assigned', agent: 'Agent A', waitTime: '2 min', icon: 'bi-person-check' },
  { id: 'C003', customer: 'Mike Johnson', status: 'In Progress', agent: 'Agent B', waitTime: '8 min', icon: 'bi-chat-dots' },
  { id: 'C004', customer: 'Sara Lee', status: 'Resolved', agent: 'Agent C', waitTime: '1 min', icon: 'bi-check-circle' },
  { id: 'C005', customer: 'Tom Brown', status: 'Waiting for Agent', waitTime: '10 min', icon: 'bi-hourglass-split' },
];

const alertsData = [
  { message: 'Chat C005 looking for agent for 10 minutes', severity: 'danger', time: 'Now' },
  { message: 'Agent D offline for last 1 hour', severity: 'warning', time: '1 hr ago' },
  { message: 'High chat volume detected', severity: 'info', time: '15 min ago' },
  { message: 'Chat C003 escalated to supervisor', severity: 'warning', time: '5 min ago' },
];

const agentDetailsData = [
  { name: 'Agent A', status: 'Online', since: '2 hr ago', color: '#4caf50' },
  { name: 'Agent B', status: 'Online', since: '1 hr ago', color: '#4caf50' },
  { name: 'Agent C', status: 'Offline', since: '30 min ago', color: '#f44336' },
  { name: 'Agent D', status: 'Offline', since: '1 hr ago', color: '#f44336' },
  { name: 'Agent E', status: 'Not Ready to Chat', since: '45 min ago', color: '#2196f3' },
  { name: 'Agent F', status: 'On Training', since: '3 hr ago', color: '#ff9800' },
];

// Chart data preparation
const chatsReceivedVsAssigned = {
  labels: ['Chats Received', 'Agents Assigned'],
  datasets: [
    {
      label: 'Count',
      data: [chatStatusData.length, chatStatusData.filter(chat => chat.agent).length],
      backgroundColor: ['#36A2EB', '#FF6384'],
    },
  ],
};

const chatsPerAgent = () => {
  const agentChatCount = chatStatusData.reduce((acc, chat) => {
    if (chat.agent) {
      acc[chat.agent] = (acc[chat.agent] || 0) + 1;
    }
    return acc;
  }, {});
  const agents = Object.keys(agentChatCount);
  return {
    labels: agents,
    datasets: [
      {
        label: 'Chats Handled',
        data: agents.map(agent => agentChatCount[agent]),
        backgroundColor: agents.map(() => '#FFCE56'),
      },
    ],
  };
};

const agentStatusDistribution = {
  labels: agentStatusData.map(status => status.status),
  datasets: [
    {
      label: 'Agents',
      data: agentStatusData.map(status => status.count),
      backgroundColor: agentStatusData.map(status => status.color),
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: '' }, // Set dynamically in component
  },
};

const DashboardPage = () => {
  const agentChatCount = chatStatusData.reduce((acc, chat) => {
    if (chat.agent) {
      acc[chat.agent] = (acc[chat.agent] || 0) + 1;
    }
    return acc;
  }, {});
  const leastChatsAgent = Object.entries(agentChatCount).reduce(
    (min, [agent, count]) => (count < min.count ? { agent, count } : min),
    { agent: Object.keys(agentChatCount)[0], count: agentChatCount[Object.keys(agentChatCount)[0]] }
  );

  return (
    <Container fluid className="py-4 d-flex">
      {/* Side Panel (Always Open) */}
      <div className="bg-light border-right" style={{ width: '250px', minWidth: '250px' }}>
        <Nav vertical className="w-100">
          <NavItem className="w-100">
            <h5 className="p-3 border-bottom">Agent Details</h5>
            {agentDetailsData.map((agent) => (
              <div key={agent.name} className="p-2 border-bottom">
                <div className="d-flex align-items-center">
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: agent.color,
                      borderRadius: '50%',
                      marginRight: '10px',
                    }}
                  ></span>
                  <div>
                    <strong>{agent.name}</strong>
                    <p className="mb-0 text-muted">
                      {agent.status} ({agent.since})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </NavItem>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Row>
          <Col xs={12} className="mb-3">
            <h1 className="font-weight-bold">Call Center Dashboard</h1>
          </Col>
        </Row>

        {/* Section 1: Agent Status */}
        <Row className="mb-4">
          <Col xs={12}>
            <h4 className="mb-3">Agent Status</h4>
            <div className="d-flex flex-wrap">
              {agentStatusData.map((status) => (
                <Card
                  key={status.status}
                  className="mb-2 mr-2"
                  style={{ borderLeft: `5px solid ${status.color}`, minWidth: '200px' }}
                >
                  <CardBody className="d-flex align-items-center">
                    <i
                      className={`${status.icon} mr-3`}
                      style={{ color: status.color, fontSize: '2rem' }}
                    ></i>
                    <div>
                      <CardTitle tag="h6" className="mb-0">
                        {status.status}
                      </CardTitle>
                      <h3>{status.count}</h3>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Col>
        </Row>

        {/* Section 2: Chat Status Table and Charts */}
        <Row className="mb-4">
          <Col xs={12}>
            <h4 className="mb-3">Chat Status</h4>
            <Table bordered responsive>
              <thead className="thead-dark">
                <tr>
                  <th>Chat ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Agent</th>
                  <th>Wait Time</th>
                </tr>
              </thead>
              <tbody>
                {chatStatusData.map((chat) => (
                  <tr key={chat.id}>
                    <td>{chat.id}</td>
                    <td>{chat.customer}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i
                          className={`${chat.icon} mr-2`}
                          style={{
                            color:
                              chat.status === 'Waiting for Agent'
                                ? '#ffc107'
                                : chat.status === 'Assigned'
                                ? '#007bff'
                                : chat.status === 'In Progress'
                                ? '#17a2b8'
                                : '#28a745',
                            fontSize: '1.2rem',
                          }}
                        ></i>
                        <Badge
                          color={
                            chat.status === 'Waiting for Agent'
                              ? 'warning'
                              : chat.status === 'Assigned'
                              ? 'primary'
                              : chat.status === 'In Progress'
                              ? 'info'
                              : 'success'
                          }
                        >
                          {chat.status}
                        </Badge>
                      </div>
                    </td>
                    <td>{chat.agent || 'N/A'}</td>
                    <td>{chat.waitTime}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          {/* Chart 1: Chats Received vs. Agents Assigned */}
          <Col xs={12} md={6} className="mt-4">
            <Card>
              <CardBody>
                <Bar
                  data={chatsReceivedVsAssigned}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Chats Received vs. Agents Assigned' } } }}
                />
              </CardBody>
            </Card>
          </Col>
          {/* Chart 2: Chats per Agent */}
          <Col xs={12} md={6} className="mt-4">
            <Card>
              <CardBody>
                <Bar
                  data={chatsPerAgent()}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: `Chats per Agent (Least: ${leastChatsAgent.agent} - ${leastChatsAgent.count})` } } }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Section 3: Alerts and Additional Chart */}
        <Row className="mb-4">
          <Col xs={12} md={6}>
            <h4 className="mb-3">Alerts</h4>
            {alertsData.map((alert, index) => (
              <Alert key={index} color={alert.severity} className="mb-2">
                <div className="d-flex align-items-center">
                  <i
                    className="bi-exclamation-triangle-fill mr-2"
                    style={{
                      color:
                        alert.severity === 'danger'
                          ? '#dc3545'
                          : alert.severity === 'warning'
                          ? '#ffc107'
                          : '#17a2b8',
                      fontSize: '1.2rem',
                    }}
                  ></i>
                  <div>
                    <p className="mb-0">{alert.message}</p>
                    <small>{alert.time}</small>
                  </div>
                </div>
              </Alert>
            ))}
          </Col>
          {/* Chart 3: Agent Status Distribution */}
          <Col xs={12} md={6}>
            <Card>
              <CardBody>
                <Bar
                  data={agentStatusDistribution}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Agent Status Distribution' } } }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default DashboardPage;