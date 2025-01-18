import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import {
  fetchClients,
  clearClientState,
  deleteClient,
  fetchClientById,
  updateClient,
  setPageSize,
  setCurrentPage
} from "@/slices/ClientSlice";
import showSweetAlert from "@/components/Sweetalert";
import Loading from "@/components/Layout/Loader";
import App from '@/components/App';

const ClientList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { clients, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.clients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [clientForm, setClientForm] = useState({});
  const [filterText, setFilterText] = useState("");

  const clientColumns = [
    { name: "Client name", selector: (row) => row.clientName, sortable: true },
    { name: "Client Language", selector: (row) => row.clientLanguage, sortable: true },
    { name: "Client Address", selector: (row) => row.clientAddress, sortable: true },
    { name: "Balance", selector: (row) => row.balance, sortable: true },
    { name: "Contact Email", selector: (row) => row.contactPersonEmail, sortable: true },
    { name: "Contact Phone", selector: (row) => row.contactPersonPhone, sortable: true },
    { name: "Created Date", selector: (row) => row.createdDate, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="uniform_icon_btn"
            onClick={() => handleDetailClick(row.clientId)}
          >
            <HiPencilAlt style={{ fontSize: "15px" }} />
          </button>
          <button
            className="uniform_icon_btn"
            onClick={() => handleDeleteClick(row.clientId)}
          >
            <HiTrash style={{ fontSize: "15px" }} />
          </button>
        </div>
      ),
    },
  ];
 const handleSearchString = (e) => {
    const searchValue = e.target.value;
    setFilterText(searchValue);

    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      dispatch(
        fetchClients({SearchStr:searchValue, pageSize, pageNo: currentPage })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
  const handleDetailClick = async (clientId) => {
    try {
      const response = await dispatch(fetchClientById(clientId)).unwrap();
      if (response.success) {
        setClientForm(response.result);
        setIsModalOpen(true);
      } else {
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      alert("Failed to fetch client details: " + error.message);
    }
  };

  const handleDeleteClick = (clientId) => {
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
          dispatch(deleteClient({ clientId })).then(() => {
            showSweetAlert({ title: "Deleted Successfully", text: "", icon: "success" });
            refreshClientList();
          });

        } catch (error) {
          alert("An unexpected error occurred: " + error.message);
        }
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setClientForm({ ...clientForm, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    const requestBody = {
      clientId: clientForm.clientId,
      clientName: clientForm.clientName,
      clientAddress: clientForm.clientAddress,
      clientLanguage: clientForm.clientLanguage,
      contactPerson: clientForm.contactPerson,
      contactPersonEmail: clientForm.contactPersonEmail,
      contactPersonPhone: clientForm.contactPersonPhone,
      balanceAlertLimit: clientForm.balanceAlertLimit,
      balance: clientForm.balance,
      actionby: localStorage.getItem("userId"),
    }
    e.preventDefault();
    try {
      const response = await dispatch(updateClient(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({ title: "Updated Successfully", text: "", icon: "success" });
        setIsModalOpen(false);
        refreshClientList();
      } else {
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      showSweetAlert({ title: "Error", text: error.message, icon: "error" });
    }
  };

  const refreshClientList = () => {
    dispatch(fetchClients({ pageSize, pageNo: currentPage }));
    return () => {
      dispatch(clearClientState());
    };
  };
  const handlePageSizeChange = async (newSize) => {
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page

    // Fetch data with updated page size and reset to page 1
    await dispatch(fetchClients({ pageSize: newSize, pageNo: 1 }));
  };


  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(fetchClients({ pageSize, pageNo: page }));
  };

  useEffect(() => {
  
    dispatch(fetchClients({ pageSize, pageNo: currentPage }));
    return () => {
      dispatch(clearClientState());
    };
  }, [dispatch]);

  const filteredClients = clients.filter((client) =>
    client.clientName.toLowerCase().includes(filterText.toLowerCase())
  );


  const handleCreate = () => {
    router.push(`/Clients/CreateClient`);
  };

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col space-y-1 text-start mb-1 ">
            <label className="mr-1">Search</label>
            <input
              type="search"
              value={filterText}
              onChange={handleSearchString}
              className="border rounded"
              placeholder=""
            />
          </div>
        </div>

      </div>
    );
  }, [filterText]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  // if (loading) return <Loading />;

  return (
    <App>
      <div className="">
        <div className="flex items-center">
          {loading && <Loading />}
          <div className=''>
            <h4 className="font-bold">Client</h4>
          </div>
          <div className="ml-auto mb-1">
            <button className="uniform_btn" onClick={handleCreate}>
              Create Client
            </button>
          </div>
        </div>

        <div className="overflow-auto">
          <DataTable
            data={filteredClients}
            columns={clientColumns}
            highlightOnHover
            striped
            pagination
            paginationServer
            paginationTotalRows={totalRecords}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePageSizeChange}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
              <h3 className="text-lg font-semibold">Edit Client Details</h3>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Client Name</label>
                    <input
                      type="text"
                      name="clientName"
                      value={clientForm.clientName || ""}
                      onChange={handleFormChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Client Language</label>
                    <input
                      type="text"
                      name="clientLanguage"
                      value={clientForm.clientLanguage || ""}
                      onChange={handleFormChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Client Address</label>
                    <input
                      type="text"
                      name="clientAddress"
                      value={clientForm.clientAddress || ""}
                      onChange={handleFormChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Contact Email </label>
                    <input
                      type="email"
                      name="contactPersonEmail"
                      value={clientForm.contactPersonEmail || ""}
                      onChange={handleFormChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded" type="submit">
                  Update Client
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded ml-4"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </App>
  );
};

export default ClientList;
