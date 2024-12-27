import React, { useMemo, useState, useEffect} from "react";
import {
  Card, CardBody, CardHeader, Col, Input, Label, Alert, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Row,
} from "reactstrap";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import Loading from "@/components/Loader";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { fetchAgents, cleaAgentState, deleteAgent, fetchAgentsById, updateAgent, setCurrentPage, setPageSize } from "@/slices/AgentSlice";
import showSweetAlert from "@/components/Sweetalert";
import { HiPencilAlt, HiTrash, HiLightningBolt, HiClock  } from "react-icons/hi";
import Sendernames from "@/components/Dropdowns/SendernameDropdown";
import AgentsForm from "../CreateAgents";
import App from '@/components/App';
//import AgentTiming from "../AgentsTiming/index";
const AgentTiming = dynamic(() => import("../AgentsTiming"), { ssr: false });
const AgentsList = () => {
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { agents = [], loading, error,pageSize, totalRecords, currentPage  } = useSelector((state) => state.agents);
  const { agent = [], loading:DetailLoading, error:DetailError } = useSelector((state) => state.agents);
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentForm, setagentForm] = useState();
  const [SenderId, setSenderId] = useState(0);
  const [AgentId, setAgentId] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [showagenttiming, setshowagenttiming] = useState("");
  const [CreateModalOpen, setCreateModalOpen] = useState("")

  const agentColumn = [
    
    
    { name: "First Name", selector: (row) => row.agentFName, sortable: true },
    { name: "Last Name", selector: (row) => row.agentLName, sortable: true },
    { name: "Status", selector: (row) => row.statusName, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <>
           <div className="flex gap-2">
      <button onClick={() => handleDetailClick(row.id)} className="uniform_icon_btn ">
      <HiPencilAlt style={{fontSize: "15px"}} />
      </button>
      <button onClick={() => handleTime(row.id)} className="uniform_icon_btn">
      <HiClock style={{fontSize: "15px"}} />
      </button>
      <button onClick={() => handleDeleteClick(row.id)} className="uniform_icon_btn">
      <HiTrash style={{fontSize: "15px"}} />
      </button>
    </div>        </>
      ),
    },
  ];
  useEffect(() => {
 if(agent)
 {
  setagentForm(agent)
 }
  }, [agent]);


  const handleDetailClick = async (agentId) => {
    
    try {
      // Dispatch the action to fetch agent by ID
       await dispatch(fetchAgentsById(agentId)).unwrap();
       
        setAgentId(agentId);
        setIsModalOpen(true); // Open the modal
        
      } 
      
    catch (error) {
      showSweetAlert("Failed to fetch details: " + error.message);
    }
  };
  
  const handleCancel = () => {
    setCreateModalOpen(false);
    
  };
  const handleDeleteClick = (agentId) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAgent({ agentId:agentId })).then(() => {
            showSweetAlert({
              title: "Deleted Successfully",
              text: "",
              icon: "success",
            });
            refreshAgentList();
          })
          .catch((error) => {
            alert("An unexpected error occurred: " + error.message);
          });
      }
    });
  };
  
  const handleTime = (agentId) => {
  setAgentId(agentId);
  setshowagenttiming(true);
  };
  

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setagentForm({ ...agentForm, [name]: value });
  };

 const handleChange = (e) => {
    const senderId = e.target.value;
    setSenderId(senderId)
    dispatch(fetchAgents({clientId: localStorage.getItem("clientId"),senderId: senderId,pageNo: currentPage, pageSize,}))
  };
  const handleClose = () => {
    setshowagenttiming(false);
    
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        id:AgentId || 0,
        client_Id: localStorage.getItem('clientId')|| 0,
        userName: agentForm.userName || "",
        password: agentForm.password || "",
        agentFName: agentForm.agentFname || "",    
        agentLName: agentForm.agentLname || "", 
        senderIds:  agentForm.senderIds || "",
        actionBy: localStorage.getItem('userId'),
      };

      const response = await dispatch(updateAgent(requestBody)).unwrap();
      if (response) {
        showSweetAlert({
          title: "Updated Successfully",
          text: "",
          icon: "success",
        });
        setIsModalOpen(false);
        refreshAgentList();
      } else {
        showSweetAlert({ title: "Failed", text: response.message, icon: "error" });
      }
    } catch (error) {
      alert("Failed to update: " + error.message);
    }
  };

  const refreshAgentList = () => {
    dispatch(fetchAgents({ clientId: localStorage.getItem("clientId"),senderId: SenderId, pageNo: currentPage, pageSize }));
  };

  useEffect(() => {
    dispatch(fetchAgents({ clientId: localStorage.getItem("clientId"),senderId: SenderId, pageNo: currentPage, pageSize  }));
    return () => {
      dispatch(cleaAgentState());
    };
  }, [dispatch]);

  const filteredAgents = useMemo(
    () =>
      (agents || []).filter(
        (agent) =>
          agent.agentFName.toLowerCase().includes(filterText.toLowerCase()) ||
          agent.agentLName.toLowerCase().includes(filterText.toLowerCase())
      ),
    [agents, filterText]
  );

  const subHeaderComponentMemo = useMemo(
    () => (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
         <div className="flex flex-col mb-1  text-start ">
         <label className="font-medium text-gray-700 text-sm">Search</label>
         <input
          type="search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder=""
          className="border rounded py-1 px-2 w-full mt-1 text-sm"
        />
        </div>
        <div className="flex flex-col mb-1 text-start">
        <label className="font-medium text-gray-700 text-sm">Sender Names</label>
        <Sendernames name="senderId"  onChange={handleChange} />
        </div>
        </div>
        
      </div>
      
    ),
    [filterText]
  );
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  return (
    <App>

<div className="flex items-center">
  {loading && <Loading />}
  <div className=''>
  <h4 className="font-bold ">Agents List</h4>
  </div>
  <div className="ml-auto mb-1">
  <button className="uniform_btn"  onClick={() => setCreateModalOpen(true)}>
       Create Agent
     </button>
  </div>
</div>
   
        <div className="overflow-auto">
        <DataTable
              data={filteredAgents}
              columns={agentColumn}
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
                    borderBottom: '1px solid #ddd', // Grid line at the bottom of the header
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
              }} />
            
          </div>
     {isModalOpen &&(
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
        {/* Close button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-800"
          >
          &times;
          </button>
      <h4 className="text-xl mb-4"> Edit Agents </h4>
    <form  onSubmit={handleUpdateSubmit}>
     
        <div>
            <label className="font-medium text-gray-700 text-sm">Sender Name</label>
            <Sendernames
              name="senderIds"
              value={agentForm.senderIds || ""} // Bind value from agentForm
              onChange={handleFormChange}
              className="border rounded py-1 px-2 w-full text-sm"
            />
        </div>
        <div>
            <label className="font-medium text-gray-700 text-sm">First Name</label>
            <input
              type="text"
              id="agentFname"
              name="agentFname"
              value={agentForm.agentFname || ""} // Bind value from agentForm
              onChange={handleFormChange}
              className="border rounded py-1 px-2 w-full mt-1 text-sm"
            />
        </div>
        <div md={6}>
          
            <label className="font-medium text-gray-700 text-sm">Last Name</label>
            <input
              type="text"
              id="agentLname"
              name="agentLname"
              value={agentForm.agentLname || ""} // Bind value from agentForm
              onChange={handleFormChange}
              className="border rounded py-1 px-2 w-full mt-1 text-sm"
            />
         
        </div>
        <div className="flex mt-6 justify-end">
      <button className="uniform_btn" type="submit">
        Save
      </button>
      </div>
      
      </form>
    </div>
  </div>
 
 

)}
{showagenttiming && (
    <AgentTiming
      agentId={AgentId}
      isVisible={true}
      onClose={handleClose}
    />
  )
}

{CreateModalOpen &&(
  <AgentsForm 
      onsuccess={refreshAgentList}
      isVisible={true}
      onClose={handleCancel}
  />
)}
    </App>
  );
};

export default AgentsList;
