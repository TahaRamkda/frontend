import React, { useState, useMemo } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import SearchBar from "@/components/SearchBar/SearchComponent";
import App from "@/components/Layout/App";
import Loader from "@/components/Layout/Loader";

const Flow = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flowForm, setFlowForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const [flowsList, setFlowsList] = useState([
    {
      id: 1,
      FlowName: "Customer Support",
      agentFName: "John",
      agentLName: "Doe",
      FlowLanguage: "English",
      ScreenName: "Main Menu",
      ScreenButtons: "Help, Chat, Exit",
      statusName: "Active",
      ScreenSequence: 1,
      Optiontext: "Select an option",
    },
    {
      id: 2,
      FlowName: "Sales Inquiry",
      agentFName: "Jane",
      agentLName: "Smith",
      FlowLanguage: "Arabic",
      ScreenName: "Inquiry Form",
      ScreenButtons: "Request Quote, Talk to Agent",
      statusName: "Inactive",
      ScreenSequence: 2,
      Optiontext: "Choose your request",
    },
  ]);

  const flowColumn = [
    { name: "Flow Name", selector: (row) => row.FlowName, sortable: true },
    { name: "Agent Name", selector: (row) => `${row.agentFName} ${row.agentLName}`, sortable: true },
    { name: "Flow Language", selector: (row) => row.FlowLanguage, sortable: true },
    { name: "Screen Name", selector: (row) => row.ScreenName, sortable: true },
    { name: "Screen Buttons", selector: (row) => row.ScreenButtons, sortable: true },
    { name: "Screen Redirections", selector: (row) => row.statusName, sortable: true },
    { name: "Screen Sequence", selector: (row) => row.ScreenSequence, sortable: true },
    { name: "Option Text", selector: (row) => row.Optiontext, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button onClick={() => handleDetailClick(row.id)} title="Edit Flow" className="uniform_icon_btn">
            <HiPencilAlt style={{ fontSize: "15px" }} />
          </button>
          <button onClick={() => handleDeleteClick(row.id)} title="Delete Flow" className="uniform_icon_btn">
            <HiTrash style={{ fontSize: "15px" }} />
          </button>
        </div>
      ),
    },
  ];

  const handleDetailClick = (id) => {
    const selectedFlow = flowsList.find((flow) => flow.id === id);
    if (selectedFlow) {
      setFlowForm(selectedFlow);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setFlowsList(flowsList.filter((flow) => flow.id !== id));
      }
    });
  };

  const handleSearch = (e) => {
    setFilterText(e);
  };

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col space-y-1 text-start mb-1 ">
          <SearchBar
              label="Search"
              value={filterText}
              
            />
          </div>
        </div>

      </div>

    );
  }, [filterText]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlowForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setFlowsList((prevFlows) =>
      prevFlows.map((flow) => (flow.id === flowForm.id ? flowForm : flow))
    );
    setIsModalOpen(false);
  };

  const filteredFlows = flowsList.filter((flow) =>
    flow.FlowName.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <App>
     <div className="flex items-center">
        {/* {loading && <Loader />} */}
        <div className=''>
          <h4 className="font-bold">FLows</h4>
        </div>
        <div className="ml-auto mb-1">
          <button
            className="uniform_btn"
            // onClick={handleCreate}
          >
            Create Flows
          </button>
        </div>
      </div>
      
      <div className="overflow-auto">
        {/* <DataTable
          data={filteredFlows}
          columns={flowColumn}
          highlightOnHover
          striped
          pagination
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          className="w-full border"
          customStyles={{
            table: {
              style: {
                width: '100%',
                borderCollapse: 'collapse', // Ensures borders collapse for proper grid appearance
              },
            },
            headRow: {
              style: {
                borderBottom: '1px solid #ddd', padding: '0px',
              },
            },
            headCells: {
              style: {

                borderRight: '1px solid #ddd', // Grid line between columns
                fontWeight: 'bold',
              },
            },
            rows: {
              style: {
                borderBottom: '1px solid #ddd', // Horizontal grid line between rows
              },
            },
            cells: {
              style: {

                borderRight: '1px solid #ddd', // Vertical grid line between cells
              },
            },
          }}
        /> */}
      </div>
     
      {isModalOpen && (
        <Modal isOpen={true} toggle={() => setIsModalOpen(false)} fade={false}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
              <ModalHeader toggle={() => setIsModalOpen(false)}>Edit Flow</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-gray-700 text-sm">Flow Name</label>
                    <input
                      type="text"
                      name="FlowName"
                      value={flowForm.FlowName || ""}
                      onChange={handleInputChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-700 text-sm">Agent First Name</label>
                    <input
                      type="text"
                      name="agentFName"
                      value={flowForm.agentFName || ""}
                      onChange={handleInputChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-700 text-sm">Agent Last Name</label>
                    <input
                      type="text"
                      name="agentLName"
                      value={flowForm.agentLName || ""}
                      onChange={handleInputChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-700 text-sm">Screen Name</label>
                    <input
                      type="text"
                      name="ScreenName"
                      value={flowForm.ScreenName || ""}
                      onChange={handleInputChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                </div>
                <div className="flex mt-6 justify-end space-x-2">
                  <button className="uniform_btn bg-gray-500" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button className="uniform_btn bg-blue-500" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              </ModalBody>
            </div>
          </div>
        </Modal>
      )}
    </App>
  );
};

export default Flow;
