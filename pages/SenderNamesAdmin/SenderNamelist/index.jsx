import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import Loading from "@/components/Loader";
import {
  fetchSendernames,
  clearSendernameState,
  deleteSendername,
  fetchSendernameById,
  updateSendername,
} from "@/slices/sendernameSlice";
import showSweetAlert from "@/components/Sweetalert";
import App from "@/components/App"
import SenderNameForm from "../CreateSenderName";

const SendernameList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendernames, loading, error } = useSelector((state) => state.sendernames);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendernameForm, setSendernameForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const [CreateModalOPen, setCreateModalOpen] = useState(false);

  const sendernameColumns = [
    { name: "Sender Name", selector: (row) => row.senderName, sortable: true },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Limit", selector: (row) => row.limit, sortable: true },
    { name: "Quality", selector: (row) => row.quality, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="uniform_icon_btn"
            title="Edit"
            onClick={() => handleDetailClick(row.senderId)}
          >
            <HiPencilAlt style={{ fontSize: "15px" }} />
          </button>
          <button
            className="uniform_icon_btn"
            onClick={() => handleDeleteClick(row.senderId)}
          >
            <HiTrash style={{ fontSize: "15px" }} />
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
  const handleCancel = () => {
    setCreateModalOpen(false)
  };

  const handleCreate = () => {
    setCreateModalOpen(true)
  };

  const handleDeleteClick = (senderId) => {
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
        try {
          dispatch(deleteSendername({ senderId })).then(() => {
            showSweetAlert({
              title: "Deleted Successfully",
              text: "",
              icon: "success",
            });
            refreshSendernameList();
          });

        } catch (error) {
          alert("An unexpected error occurred: " + error.message);
        }
      }
    });
  };
  const toggleModal = () => {
    setIsModalOpen(false);
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
          title: "Updated Successfully",
          text: "",
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
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col space-y-1 text-start mb-1">
            <label className="font-medium text-gray-700 text-sm ">Search </label>
            <input
              type="search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="border rounded"
            //  placeholder=" "
            />
          </div>
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
        <div className=''>
          <h4 className="font-bold ">Sender Name </h4>
        </div>
        <div className="ml-auto mb-1">
          <button className="uniform_btn" onClick={handleCreate}>
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
        />
      </div>


      {isModalOpen && (
        <Modal isOpen={true} toggle={() => toggleModal()} fade={false}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
              <ModalHeader toggle={() => toggleModal()}> Edit Sender</ModalHeader>
              <ModalBody>
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  <div>
                    <label className="font-medium text-gray-700 text-sm">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      id="senderName"
                      name="senderName"
                      value={sendernameForm.senderName || ""}
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-700 text-sm">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={sendernameForm.phoneNumber || ""}
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>


                  <div>
                    <label className="font-medium text-gray-700 text-sm">
                      Limit
                    </label>
                    <input
                      type="number"
                      id="limit"
                      name="limit"
                      value={sendernameForm.limit || ""}
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-700 text-sm">
                      Quality
                    </label>
                    <input
                      type="text"
                      id="quality"
                      name="quality"
                      value={sendernameForm.quality || ""}
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>


                  <div className="flex w-full justify-end">
                    <button
                      type="submit"
                      className="uniform_btn"
                    >
                      Save
                    </button>
                  </div>

                </form>
              </ModalBody>
            </div>
          </div>
        </Modal>
      )}
      {CreateModalOPen && (
        <SenderNameForm
          isVisible={true}
          onClose={handleCancel}
          onsuccess={refreshSendernameList}
        />
      )}

    </App>
  );
};

export default SendernameList;
