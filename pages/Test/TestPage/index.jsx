// pages/dashboard.jsx
import React, { useState } from 'react';
import { HiCheckCircle, HiClock, HiUserCircle, HiX } from 'react-icons/hi';

const Dashboard = () => {
  // State for interactivity
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [alerts, setAlerts] = useState([
    { id: 1, message: "John Doe hasn't replied to Customer A's chat in 15 minutes" },
    { id: 2, message: "Customer D's chat is waiting for an agent assignment" },
    { id: 3, message: "Jane Smith hasn't replied to Customer B's chat in 10 minutes" },
  ]);

  // Sample data
  const agents = [
    { id: 1, name: 'John Doe', status: 'Online', callsHandled: 15 },
    { id: 2, name: 'Jane Smith', status: 'Busy', callsHandled: 12 },
    { id: 3, name: 'Mike Johnson', status: 'Offline', callsHandled: 8 },
    { id: 4, name: 'Sarah Williams', status: 'Online', callsHandled: 20 },
  ];

  const chats = [
    { id: 1, customer: 'Customer A', agent: 'John Doe', status: 'Active', lastMessage: '5 min ago' },
    { id: 2, customer: 'Customer B', agent: 'Jane Smith', status: 'Active', lastMessage: '2 min ago' },
    { id: 3, customer: 'Customer C', agent: 'Sarah Williams', status: 'Active', lastMessage: '1 min ago' },
    { id: 4, customer: 'Customer D', agent: null, status: 'Pending', lastMessage: 'Waiting' },
  ];

  // Status icons with color and size
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Online': return <HiCheckCircle className="h-6 w-6 text-green-500" />;
      case 'Busy': return <HiClock className="h-6 w-6 text-yellow-500" />;
      case 'Offline': return <HiUserCircle className="h-6 w-6 text-red-500" />;
      default: return null;
    }
  };

  // Summary stats
  const totalAgents = agents.length;
  const onlineAgents = agents.filter(a => a.status === 'Online').length;
  const activeChats = chats.filter(c => c.status === 'Active').length;
  const pendingChats = chats.filter(c => c.status === 'Pending').length;

  // Filtered chats
  const filteredChats = chats.filter(chat => {
    const matchesSearch =
      chat.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chat.agent && chat.agent.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || chat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Call Center Dashboard</h1>

      {/* Agent Status Section */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-blue-200">
        <h1 className="text-lg font-semibold text-gray-800 p-3 border-b border-gray-200">
          Agent Status
        </h1>
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {agents.map(agent => (
            <div
              key={agent.id}
              className={`flex items-center space-x-2 p-2 rounded border-l-2 ${
                agent.status === 'Online'
                  ? 'border-green-500'
                  : agent.status === 'Busy'
                  ? 'border-yellow-500'
                  : 'border-red-500'
              }`}
            >
              {getStatusIcon(agent.status)}
              <div>
                <p className="text-xs font-medium text-gray-900">{agent.name}</p>
                <p className={`text-xs ${
                  agent.status === 'Online' ? 'text-green-600' : agent.status === 'Busy' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {agent.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Assignments Section */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-800 mb-2">Chat Assignments</h1>
        <div className="bg-white rounded-lg shadow-sm border border-blue-200">
          <div className="p-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              placeholder="Search chats..."
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-3 py-2 text-left font-medium border border-blue-600">Customer</th>
                  <th className="px-3 py-2 text-left font-medium border border-blue-600">Agent</th>
                  <th className="px-3 py-2 text-left font-medium border border-blue-600">Status</th>
                  <th className="px-3 py-2 text-left font-medium border border-blue-600">Last Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredChats.map((chat, index) => (
                  <tr key={chat.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="px-3 py-2 border border-gray-200">{chat.customer}</td>
                    <td className="px-3 py-2 border border-gray-200">
                      {chat.agent ? chat.agent : <span className="text-gray-500">Unassigned</span>}
                    </td>
                    <td className={`px-3 py-2 border border-gray-200 ${
                      chat.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {chat.status}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-gray-500">{chat.lastMessage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800 mb-2">Alerts</h1>
        <div className="space-y-2">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className="bg-white p-2 rounded border-l-4 border-yellow-500 flex items-center justify-between"
            >
              <p className="text-xs text-gray-700">{alert.message}</p>
              <button
                onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                className="text-gray-400 hover:text-red-500"
              >
                <HiX className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;