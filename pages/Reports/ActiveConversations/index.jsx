import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Loading from '@/components/Loader';
import App from '@/components/App';

const ActiveConversations = () => {
  // Hardcoded data
  const [conversations] = useState([
    {
      id: 1,
      customerName: "John Doe",
      phoneNumber: "+1234567890",
      status: "Active",
      agent: "Agent 1",
      startTime: "10:00",
      endTime: "11:00",
      unreadCount: 3,
      chats: "This is a sample chat with John Doe.",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      phoneNumber: "+0987654321",
      status: "Pending",
      agent: "Agent 2",
      startTime: "12:00",
      endTime: "12:30",
      unreadCount: 5,
      chats: "This is a sample chat with Jane Smith.",
    },
    {
      id: 3,
      customerName: "Michael Brown",
      phoneNumber: "+1122334455",
      status: "Completed",
      agent: "Agent 3",
      startTime: "14:00",
      endTime: "14:45",
      unreadCount: 0,
      chats: "This is a sample chat with Michael Brown.",
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle modal opening
  const toggleModal = (chat) => {
    setSelectedChat(chat);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <App>
      <div className="pcoded-inner-content">
        <div className="main-body">
          <div className="page-wrapper">
            <div className="page-body">
              <div className="row">
                <div className="col-xl-12 col-md-12">
                  <div>
                    <section className="general-section">
                      <h1 className="font-semibold pb-3">Message Reports </h1>
                      <div className="card bg-white shadow-md rounded-lg pt-0 p-4">
                        <div className="table-responsive categories_table rounded-lg">
                          <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-sm">
                            <thead>
                              <tr>
                                <th className="text-center border p-2">Phone Number</th>
                                <th className="border border-gray-300 px-4 py-2">Status</th>
                                <th className="border border-gray-300 px-4 py-2">Agent</th>
                                <th className="border border-gray-300 px-4 py-2">Start Time</th>
                                <th className="border border-gray-300 px-4 py-2">End Time</th>
                                <th className="border border-gray-300 px-4 py-2">Unread Count</th>
                                <th className="border border-gray-300 px-4 py-2">Action</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {conversations.length > 0 ? (
                                conversations.map((convo) => (
                                  <tr key={convo.id}>
                                    <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{convo.phoneNumber}</td>
                                    <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{convo.status}</td>
                                    <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{convo.agent}</td>
                                    <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{convo.startTime}</td>
                                    <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{convo.endTime}</td>
                                    <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{convo.unreadCount}</td>
                                    <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">
                                      <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => toggleModal(convo.chats)}
                                      >
                                        View Chat
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr className="text-center">
                                  <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    No reports found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for displaying chat */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>Chat Details</ModalHeader>
        <ModalBody>{selectedChat}</ModalBody>
      </Modal>
    </App>
  );
};

export default ActiveConversations;
