import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSetting,
  clearAppSettingState,
  fetchSettingById,
  clearAppSettingDetailState,
  appSettings,
  clearAppSettingDataState,
  setPageSize,
  setCurrentPage,
  updateAppSettings,
  deleteAppSetting
} from "@/slices/AppSettingSlice";
import showSweetAlert from "@/components/Sweetalert";
import { Logger } from 'next-axiom';
import logChatDetails from '@/components/logger';
import { LogerType } from '@/utils/constants';
import Loading from "@/components/Layout/Loader";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import SettingForm from "@/pages/Settings/CreateAppSetting";
import App from "@/components/Layout/App";
import SearchBar from "@/components/SearchBar/SearchComponent";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import ClientDropdown from "@/components/Dropdowns/ClientDropdown";
const AppSettings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { settingList, loading, error, pageSize, totalRecords, currentPage } =
    useSelector((state) => state.appsetting);
  const [senderId, setSelectedSenderId] = useState(0);
  const logger = new Logger();
  const [clientId, setSelectedClientId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [settingForm, setSettingForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const startTime = Date.now();
  const [showSettingForm, setShowSettingForm] = useState(false)
  const [CreateModalOpen, setCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start as true since we're fetching data
  const settingColumns = [
    { name: "Key Name", selector: (row) => row.keyName, sortable: true },
    { name: "Value", selector: (row) => row.val, sortable: true },
    { name: "Sender Name", selector: (row) => row.senderName, sortable: true },
    { name: "Client Name", selector: (row) => row.clientName, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="flex gap-2 w-full">
            <button
              title="Edit Group"
              className="uniform_icon_btn"
              onClick={() => handleDetailClick(row.id)}
            >
              <HiPencilAlt style={{ fontSize: "15px" }} />
            </button>
            {/* <button
              title="Delete Group"
              className="uniform_icon_btn"
              onClick={() => handleDeleteClick(row.id)}
            >
              <HiTrash style={{ fontSize: "15px" }} />
            </button> */}
          </div>
        </>
      ),
      style: {
        textAlign: "right", // Align the entire column content to the center
      },
    },
  ];

  const handleClientChange = (e) => {
    
    const id = e.target.value;
    setSelectedClientId(id);
  };
  const handleSenderChange = (e) => {
    
    const id = e.target.value;
    setSelectedSenderId(id);
  };

  
  const handleDetailClick = async (id) => {
    
    try {
      
      const response = await dispatch(fetchSettingById({ Id: id })).unwrap();
      
      if (response) {
        
        setSettingForm(response);
        setIsModalOpen(true);
      } else {
        showSweetAlert({
          title: "Error",
          text: "Failed to fetch details",
          icon: "error",
        });
      }
    } catch (error) {
      alert("Failed to fetch group details: " + error.message);
    }
  };
  const handleCancel = () => {
    setCreateModalOpen(false);
  };
  const handleDeleteClick = (Id) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteAppSetting({ Id })).then(() => {
            showSweetAlert({
              title: "Deleted Successfully",
              text: "",
              icon: "success",
            });
            refreshSettingList();
          });
        } catch (error) {
          alert("An unexpected error occurred: " + error.message);
        }
      }
    });
  };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(
      fetchSetting({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        senderId: senderId,
        clientId: clientId,
        pageNo: page,
        SearchStr: filterText,
      })
    );
  };

  const handlePageSizeChange = async (newSize) => {
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    await dispatch(
      fetchSetting({
        clientId: localStorage.getItem("clientId"),
        pageSize: newSize,
        senderId: senderId,
        clientId: clientId,
        pageNo: 1,
        SearchStr: filterText,
      })
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSettingForm({ ...settingForm, [name]: value });
  };
  const toggleModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchString = (setter) => (e) => {
    const searchValue = e;
    setFilterText(searchValue);
    setter(e);

    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      dispatch(
        fetchSetting({
           clientId: localStorage.getItem("clientId"),
        pageSize,
        senderId: senderId,
        clientId: clientId,
        pageNo: currentPage,
        SearchStr: searchValue,
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const requestBody = {
        id: settingForm.id || 0,
        keyName: settingForm.keyName || "string",
        val: settingForm.val || "string",
        senderId: settingForm.senderId || 0,
      };

      const response = await dispatch(updateAppSettings(requestBody)).unwrap();
      
      if (response.status === 1) {
        showSweetAlert({
          title: "Updated Successfully",
          text: "",
          icon: "success",
        });
        setIsLoading(false);
        setIsModalOpen(false);
        refreshSettingList();
      } else {
        showSweetAlert({
          title: "Error",
          text: response.message,
          icon: "error",
        });
      }
    } catch (error) {
      alert("Failed to update group: " + error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSettingList = () => {
    dispatch(
      fetchSetting({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        senderId: senderId,
        clientId: clientId,
        pageNo: currentPage,
        SearchStr: filterText,
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchSetting({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        senderId: senderId,
        clientId: clientId,
        pageNo: currentPage,
        SearchStr: filterText,
      })
    );
    return () => {
      dispatch(clearAppSettingState());
    };
  }, [dispatch,senderId,clientId]);

  const handleCreate = async() => {
    setCreateModalOpen(true);
  };


  const customPageSizes = [1, 5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10;
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col space-y-1 text-start mb-1 ">
            <SearchBar
              label="Search"
              value={filterText}
              onChange={handleSearchString(setFilterText)}
            />
          </div>
          <div className="flex flex-col space-y-1 text-start mb-1 ">
          <label className="font-medium text-gray-700 text-sm ">
              Sender Name
            </label>
            <SendernameDropdown name="senderId" value={senderId} onChange={handleSenderChange} />
          </div>
          <div className="flex flex-col space-y-1 text-start mb-1 ">
          <label className="font-medium text-gray-700 text-sm ">
              Client Name
            </label>
            <ClientDropdown
              name="client_Id"
              value={clientId}
              onChange={handleClientChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    );
  }, [filterText, clientId, senderId]);



  return (
    <App>
      <div className="flex items-center">
        {(loading || isLoading) && <Loading />}
        <div className="">
          <h4 className="font-bold">App Settings </h4>
        </div>
        {/* <div className="ml-auto mb-1">
          <button className="uniform_btn" onClick={handleCreate}>
            Create Settings
          </button>
        </div> */}
      </div>
      <div className="overflow-auto">
        <DataTable
          data={settingList}
          columns={settingColumns}
          highlightOnHover
          striped
          pagination
          paginationServer
          paginationTotalRows={totalRecords}
          sortIcon
          sortServer
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePageSizeChange}
          paginationPerPage={defultpagessize} // Default number of rows per page
          paginationRowsPerPageOptions={customPageSizes} // Custom page size options
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          className="w-full border"
        />
      </div>

      {isModalOpen && (
        <Modal isOpen={true} toggle={() => toggleModal()} fade={false}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
              {/* Loader for update operation */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-50 ">
                  <Loading />
                </div>
              )}
              <ModalHeader toggle={() => toggleModal()}>
                Edit Settings
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleUpdateSubmit}>
                  <div>
                    <label className="font-medium text-gray-700 text-sm">Sender Name</label>
                    <SendernameDropdown name="senderId" value={settingForm.senderId} onChange={handleFormChange} />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="keyName"
                      className="font-medium text-gray-700 text-sm"
                    >
                      Key Name
                    </label>
                    <input
                      type="text"
                      id="keyName"
                      name="keyName"
                      value={settingForm.keyName || ""}
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                      disabled={isLoading} // Disable input while loading
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="val"
                      className="font-medium text-gray-700 text-sm"
                    >
                      Value
                    </label>
                    <input
                      type="text"
                      id="val"
                      name="val"
                      value={settingForm?.val || ""}
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                      disabled={isLoading} // Disable input while loading
                    />
                  </div>
                  <div className="mt-4 w-full flex justify-end">
                    <button
                      type="submit"
                      className="uniform_btn"
                      disabled={isLoading} // Disable button while loading
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

      {CreateModalOpen && (
        <SettingForm
          isVisible={true}
          onClose={handleCancel}
          onsuccess={refreshSettingList}
        />
      )}
    </App>
  );
};

export default AppSettings;
