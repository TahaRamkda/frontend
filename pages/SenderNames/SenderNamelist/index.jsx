import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import Loading from "@/components/Loader";
import {
  fetchSendernames,
  clearSendernameState,
  deleteSendername,
  fetchSendernameById,
  updateSendername,
} from "@/slices/SenderNameSlice";
import showSweetAlert from "@/components/Sweetalert";
import App from "@/components/App"

const SendernameList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendernames, loading, error } = useSelector((state) => state.sendernames);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendernameForm, setSendernameForm] = useState({});
  const [filterText, setFilterText] = useState("");

  const sendernameColumns = [   
    { name: "Sender Name", selector: (row) => row.senderName, sortable: true },
    { name: "Client Name", selector: (row) => row.clientName, sortable: true },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Phone Id", selector: (row) => row.phoneNumber, sortable: true },
    { name: "App Id", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Limit", selector: (row) => row.limit, sortable: true },
    { name: "Quality", selector: (row) => row.quality, sortable: true },
    { name: "Created Date", selector: (row) => row.createdDate, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="uniform_icon_btn"
            title="Edit"
            onClick={() => handleDetailClick(row.senderId)}
          >
            <HiPencilAlt style={{fontSize: "20px"}}/>
          </button>
          <button
            className="uniform_icon_btn"
            onClick={() => handleDeleteClick(row.senderId)}
          >
            <HiTrash style={{fontSize: "20px"}}/>
          </button>
        </div>
      ),
    },
  ];

  const handleDetailClick = async (senderId) => {
    try {
      const response = await dispatch(fetchSendernameById(senderId)).unwrap();
      if (response) {
        setSendernameForm(response.result);
        setIsModalOpen(true);
      } else {
        showSweetAlert({ title: "Error", text: "Failed to fetch sender details", icon: "error" });
      }
    } catch (error) {
      alert("Failed to fetch sender details: " + error.message);
    }
  };

  const handleDeleteClick = (senderId) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteSendername({ senderId })).unwrap();
          showSweetAlert({
            title: "Sender Deleted",
            text: "The sender has been deleted successfully",
            icon: "success",
          });
          refreshSendernameList();
        } catch (error) {
          alert("An unexpected error occurred: " + error.message);
        }
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSendernameForm({ ...sendernameForm, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        senderId: sendernameForm.senderId || 0,
        clientId: sendernameForm.clientId || 0,
        senderName: sendernameForm.senderName || "string",
        phoneNumber: sendernameForm.phoneNumber || "string",
        phoneId: sendernameForm.phoneId || "string",
        appId: sendernameForm.appId || "string",
        limit: sendernameForm.limit || 0,
        quality: sendernameForm.quality || 0,
        actionBy: 1,
      };

      const response = await dispatch(updateSendername(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: "Sender Updated",
          text: "Sender details have been updated successfully.",
          icon: "success",
        });
        setIsModalOpen(false);
        refreshSendernameList();
      } else {
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      showSweetAlert({ title: "Error", text: error.message, icon: "error" });
    }
  };

  const refreshSendernameList = () => {
    dispatch(fetchSendernames({ client_Id: localStorage.getItem("clientId") }));
  };

  useEffect(() => {
    dispatch(fetchSendernames({ client_Id: localStorage.getItem("clientId") }));
    return () => {
      dispatch(clearSendernameState());
    };
  }, [dispatch]);

  const filteredSendernames = sendernames.filter((sender) =>
    sender.senderName.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="flex justify-between w-full ">
      <div className="justify-start ">
      <label className="mr-1">Search </label>
      <input 
       type="search" 
       value={filterText} 
       onChange={(e) => setFilterText(e.target.value)} 
       className="border rounded"
      //  placeholder=" "
     />
     </div>
   </div>
    );
  }, [filterText]);

  if (error) {
    return <div className="text-red-500 p-4 bg-red-100 rounded">{error}</div>;
  }

  return (
    <App>
      
      <div className="flex items-center">
  {loading && <Loading />}
  <div className='mb-1'>
  <h4 className="font-bold mb-2">Sender Name List</h4>
  </div>
  <div className="ml-auto mb-2">
  <button className="uniform_btn" onClick={() => router.push("/SenderNames/CreateSenderName")}>
          Create Sender Name
        </button>
  </div>
</div>

          <div className="overflow-auto">
            <DataTable
              data={filteredSendernames}
              columns={sendernameColumns}
              highlightOnHover
              striped
              pagination
              className="w-full border"
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
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
              }}
            />
          </div>
        
       
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
              <h4 className="text-lg font-semibold mb-4">Modify Sender</h4>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      id="senderName"
                      name="senderName"
                      value={sendernameForm.senderName || ""}
                      onChange={handleFormChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label  className="block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={sendernameForm.phoneNumber || ""}
                      onChange={handleFormChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">
                      Limit
                    </label>
                    <input
                      type="number"
                      id="limit"
                      name="limit"
                      value={sendernameForm.limit || ""}
                      onChange={handleFormChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">
                      Quality
                    </label>
                    <input
                      type="text"
                      id="quality"
                      name="quality"
                      value={sendernameForm.quality || ""}
                      onChange={handleFormChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                </div>
                
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-500 text-white rounded ml-4"
                  >
                    Save
                  </button>
                
              </form>
            </div>
          </div>
        )}
      
    </App>
  );
};

export default SendernameList;
