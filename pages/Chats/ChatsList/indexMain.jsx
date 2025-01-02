import React, { use } from 'react'
import App from '@/components/App';
import { useState } from 'react';
import classnames from 'classnames';
import { Card, Col, Input, InputGroup, InputGroupText, Nav, NavItem, NavLink, TabContent, TabPane, CardHeader, Container, Row, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
const ChatPage = () => {
  const [modalOpen, setModalOpen] = useState(false); // View Details Modal
  const [transferModalOpen, setTransferModalOpen] = useState(false); // Transfer Chat Modal
  const [queueModalOpen, setQueueModalOpen] = useState(false); // Add to Queue Modal
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [showIcons, setShowIcons] = useState(false); // State for showing icons

  // Toggle the visibility of the icons
  const toggleIcons = () => setShowIcons((prev) => !prev);

  // Toggle Functions
  const toggleModal = () => setModalOpen((prevState) => !prevState);
  const toggleTransferModal = () => setTransferModalOpen((prevState) => !prevState);
  const toggleQueueModal = () => setQueueModalOpen((prevState) => !prevState);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [searchQuery, setSearchQuery] = useState(""); // State to track search query


  // Hardcoded chat and contacts data
  const contacts = [
    { id: 1, name: 'John Doe', lastMessage: 'Hey! How are you?', status: 'online' },
    { id: 1, name: 'John Doe', lastMessage: 'Hey! How are you?', status: 'online' },
    { id: 1, name: 'John Doe', lastMessage: 'Hey! How are you?', status: 'online' },
    { id: 1, name: 'John Doe', lastMessage: 'Hey! How are you?', status: 'online' },
    { id: 1, name: 'John Doe', lastMessage: 'Hey! How are you?', status: 'online' },
    { id: 1, name: 'John Doe', lastMessage: 'Hey! How are you?', status: 'online' },
    { id: 1, name: 'John Doe', lastMessage: 'Hey! How are you?', status: 'online' },
    { id: 1, name: 'John Doe', lastMessage: 'Hey! How are you?', status: 'online' },
    { id: 1, name: 'John Doe', lastMessage: 'Hey! How are you?', status: 'online' },
    { id: 2, name: 'Jane Smith', lastMessage: 'Let\'s catch up soon!', status: 'offline' },
    { id: 3, name: 'Michael Johnson', lastMessage: 'I\'ll call you later', status: 'online' },
    { id: 3, name: 'Michael Johnson', lastMessage: 'I\'ll call you later', status: 'online' },
    { id: 3, name: 'Michael Johnson', lastMessage: 'I\'ll call you later', status: 'online' },
    { id: 3, name: 'Michael Johnson', lastMessage: 'I\'ll call you later', status: 'online' },

    { id: 3, name: 'Michael Johnson', lastMessage: 'I\'ll call you later', status: 'online' },
    { id: 3, name: 'Michael Johnson', lastMessage: 'I\'ll call you later', status: 'online' },
    { id: 3, name: 'Michael Johnson', lastMessage: 'I\'ll call you later', status: 'online' },
    { id: 3, name: 'Michael Johnson', lastMessage: 'I\'ll call you later', status: 'online' },
    { id: 3, name: 'Michael Johnson', lastMessage: 'I\'ll call you later', status: 'online' },
  ];
  // Hardcoded data for the user
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+123456789',
    lastSeen: '2024-12-02 10:45 AM',
    isOnline: true,
  };


  const chatMessages = [
    { id: 1, from: 'John', message: 'Hey! How are you?', time: '10:10 AM' },
    { id: 2, from: 'You', message: 'I\'m good, thanks! And you?', time: '10:12 AM' },
    { id: 3, from: 'John', message: 'I\'m doing great, thanks for asking!', time: '10:13 AM' },
  ];

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <App>
      <Container fluid>
        <Row className="g-0">
          <Col xxl="3" xl="4" md="5" className="box-col-5">
            <Card className="left-sidebar-wrapper ">
              <div className="left-sidebar-chat">
                <InputGroup>
                  <InputGroupText className='w-full'>
                    <i class="fa fa-search mr-2" aria-hidden="true"></i>
                    <Input
                      type="text"
                      placeholder="Search here"
                      value={searchQuery} // Bind search query to input
                      onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
                    />
                  </InputGroupText>
                </InputGroup>
              </div>
              <div className="advance-options">
                <Nav tabs className="border-tab  bg-white border-b border-gray-200 shadow-sm" id="chat-options-tab">
                  <NavItem className="flex justify-content-center w-full text-xl font-bold text-gray-900">Chats</NavItem>
                </Nav>


                <TabContent id="chat-options-tabContent">
                  <TabPane id="chats" className="text-center">
                    <ul className="divide-y divide-gray-200  chats-user overflow-y-auto  ">
                      {filteredContacts.map((contact) => (
                        <li
                          key={contact.id}
                          className="flex  justify-between  hover:bg-gray-100 cursor-pointer  "
                        >
                          {/* Profile Section */}
                          <div className="grid grid-cols-2 items-center space-x-2 chat-time w-full">
                            {/* Profile Section */}
                            <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full active-profile relative">
                              {/* User Icon */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 text-gray-700"
                              >
                                <path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2c-2.66 0-8 1.34-8 4v1h16v-1c0-2.66-5.34-4-8-4z" />
                              </svg>
                              {/* Status Indicator */}
                              <div
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${contact.status === "online" ? "bg-green-500" : "bg-red-500"
                                  }`}
                              />
                            </div>

                            {/* Name and Message Section */}
                            <div className="flex flex-col  flex-grow text-left">
                              <span className="block font-medium  text-gray-800">{contact.name}</span>
                              <p className="  text-gray-500">{contact.lastMessage}</p>
                            </div>

                            {/* Time and Badge Section */}
                            <div className="flex flex-col items-end justify-end space-y-1">
                              <p className="text-xs text-gray-400">10:00 AM</p>
                              <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                                @15
                              </span>
                            </div>
                          </div>

                          {/* Time and Additional Info */}

                        </li>
                      ))}
                    </ul>

                  </TabPane>
                </TabContent>
              </div>
            </Card>
          </Col>

          {/* <UserGroupChat /> */}
          <Col xxl="9" xl="8" md="7" className="box-col-7">
            <Card className="right-sidebar-chat ">
              <div className="right-sidebar-title border-gray-200">
                <div className="common-space d-flex justify-content-end">
                  <div className="contact-edit chat-alert">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer">
                      <i className="fa fa-info-circle text-gray-600 text-xl" />
                    </div>
                  </div>

                  <div >
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle color="">

                        <i className="fa fa-bars text-gray-600 text-xl"></i>
                      </DropdownToggle>
                      <DropdownMenu >
                        <DropdownItem onClick={toggleModal}>View Details</DropdownItem>
                        <DropdownItem onClick={toggleTransferModal}>Transfer Chat to Agent</DropdownItem>
                        <DropdownItem onClick={toggleQueueModal}>Add to Queue</DropdownItem>
                        <DropdownItem>Close Chat</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    {/* View Details Modal */}
                    <Modal isOpen={modalOpen} toggle={toggleModal} className="modal-xl">

                      <ModalHeader toggle={toggleModal}>Details</ModalHeader>
                      <ModalBody>
                        <Nav tabs>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === '1' })}
                              onClick={() => setActiveTab('1')}
                              style={{ cursor: 'pointer' }}
                            >
                              Contact Info
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === '2' })}
                              onClick={() => setActiveTab('2')}
                              style={{ cursor: 'pointer' }}
                            >
                              Logs
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === '3' })}
                              onClick={() => setActiveTab('3')}
                              style={{ cursor: 'pointer' }}
                            >
                              user
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                          <TabPane tabId="1">
                            <h5 className="mt-3">Contact Information</h5>
                            <p>
                              <strong>Name:</strong> {user.name}
                            </p>
                            <p>
                              <strong>Email:</strong> {user.email}
                            </p>
                            <p>
                              <strong>Phone:</strong> {user.phone}
                            </p>
                          </TabPane>
                          <TabPane tabId="2">
                            <h5 className="mt-3">Logs</h5>
                            <p>
                              <strong>Last Seen:</strong> {user.lastSeen || 'Not available'}
                            </p>
                            <p>
                              <strong>Online:</strong> {user.isOnline ? 'Yes' : 'No'}
                            </p>
                          </TabPane>
                          <TabPane tabId="3">
                            <h5 className='mt-3'>User</h5>
                            <p>user is active</p>
                          </TabPane>
                        </TabContent>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={toggleModal}>
                          Close
                        </Button>
                      </ModalFooter>
                    </Modal>

                    {/* Transfer Chat Modal */}
                    <Modal isOpen={transferModalOpen} toggle={toggleTransferModal}>
                      <ModalHeader toggle={toggleTransferModal}>Transfer Chat to Agent</ModalHeader>
                      <ModalBody>
                        <p>Select an agent to transfer the chat to:</p>
                        {/* Example Dropdown for Agent Selection */}
                        <select className="form-select">
                          <option>Select an Agent</option>
                          <option>Agent 1</option>
                          <option>Agent 2</option>
                          <option>Agent 3</option>
                        </select>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={toggleTransferModal}>
                          Transfer
                        </Button>
                        <Button color="secondary" onClick={toggleTransferModal}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal>

                    {/* Add to Queue Modal */}
                    <Modal isOpen={queueModalOpen} toggle={toggleQueueModal}>
                      <ModalHeader toggle={toggleQueueModal}>Add to Queue</ModalHeader>
                      <ModalBody>
                        <p>Are you sure you want to add this chat to the queue?</p>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={toggleQueueModal}>
                          Add to Queue
                        </Button>
                        <Button color="secondary" onClick={toggleQueueModal}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </div>

                </div>
              </div>

              {/* Chat Section (Right) */}
              <div className="right-sidebar-chat p-6 w-full height-chat-box overflow-y-auto chat-background ">
                <div className="msger flex flex-col h-full ">
                  {/* Chat Messages */}
                  <div className="msger-chat flex-grow overflow-y-auto space-y-4 px-4 py-2">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.from === 'You' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs p-2 rounded-2xl shadow-sm ${message.from === 'You'
                              ? 'bg-green-500 text-white rounded-br-none'
                              : 'bg-gray-200 text-black rounded-bl-none'
                            }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <span className="text-xs text-gray-400 block mt-1">{message.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="msger-inputarea flex items-center justify-between mt-4 border-t border-gray-300 pt-3">
                    {/* "+" Button */}
                    <div className="relative">
                      <Button
                        onClick={toggleIcons}
                        className="rounded-full bg-green-500 text-white  hover:bg-green-600"
                      >
                        +
                      </Button>

                      {/* Additional Icons */}
                      <div
                        className={`absolute -top-24 left-1/2  -translate-x-1/2 flex flex-col items-center space-y-2 duration-300 ease-in-out ${showIcons ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                          }`}
                      >
                        <Button
                          color="dark"
                          className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center"
                        >
                          <i className="fa fa-camera text-white" aria-hidden="true"></i>
                        </Button>
                        <Button
                          color="dark"
                          className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center"
                        >
                          <i className="fa fa-paperclip text-white" aria-hidden="true"></i>
                        </Button>
                      </div>
                    </div>

                    {/* Input Bar */}
                    <InputGroup className="flex-grow mx-3 mt-3">
                      <Input
                        type="text"
                        placeholder="Type a message..."
                        className="rounded-full border border-gray-300 focus:outline-none focus:ring focus:ring-green-200"
                      />
                    </InputGroup>

                    {/* Send Button */}
                    <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600">
                      Send
                    </button>
                  </div>

                </div>
              </div>


            </Card>
          </Col>

        </Row>
      </Container>
    </App>
  );
};

<Col ></Col>

export default ChatPage;