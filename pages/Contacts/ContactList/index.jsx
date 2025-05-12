import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchContact, clearContactState, deleteContact, fetchContactById, updateContact, setPageSize, setCurrentPage } from "@/slices/ContactSlice";
import showSweetAlert from "@/components/Sweetalert";
import { Row, Modal, ModalBody, ModalHeader } from "reactstrap";
import GroupDropdown from '@/components/Dropdowns/GroupDropdown';
import ContactForm from "../CreateContact";
import Loading from "@/components/Layout/Loader";
import { HiPencilAlt, HiTrash, HiRefresh } from "react-icons/hi";
import BulkUpload from "../BulkUpload";
import App from '@/components/Layout/App';
import { usePermissions } from "@/context/PermissionsContext";
import SearchBar from '@/components/SearchBar/SearchComponent';
const ContactList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { hasPermission } = usePermissions();
  const { contacts, loading, error, pageSize, totalRecords, currentPage } = useSelector((state) => state.contacts);
  const { client } = useSelector((state) => state.clients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ContactLoading, setContactLoading] = useState(false);
  const [contactForm, setcontactForm] = useState({});
  const [filterText, setFilterText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [GroupId, setGroupId] = useState(0);
  const [SearchStr, setSearchStr] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [CreateModalOPen, setCreateModalOpen] = useState(false);
  const [BulkUploadModal, setBulkUploadModal] = useState(false);
  const clientColumns = [
    { name: "Groups", selector: (row) => row.groupName, sortable: true,  minWidth: "200px",  },
    { name: "First name", selector: (row) => row.firstName, sortable: true,  minWidth: "180px", },
    { name: "Last Name", selector: (row) => row.lastName, sortable: true, minWidth: "180px" },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true, minWidth: "120px" },
    { name: "Email", selector: (row) => row.emailAddress, sortable: true, minWidth: "200px" },
    { name: "Area", selector: (row) => row.areaName, sortable: true, minWidth: "150px" },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="flex gap-2">
            <button className="uniform_icon_btn" title="Edit Contact" onClick={() => handleDetailClick(row.contactId)}>
              <HiPencilAlt style={{ fontSize: "15px" }} />
            </button>
            {hasPermission("Contacts", "delete") && (
            <button className="uniform_icon_btn" title="Delete Contact" onClick={() => handleDeleteClick(row.contactId)}>
              <HiTrash style={{ fontSize: "15px" }} />
            </button>
            )}
            {/* <button
          className="uniform_icon_btn"
            onClick={() => handleAsynClick(row.id)}>
            <HiRefresh style={{fontSize: "15px"}}/>
            </button> */}
          </div>
        </>
      ),
    },
  ];
  const handleDetailClick = async (contactId) => {
    setContactLoading(true);
    try {
      const response = await dispatch(fetchContactById({contactId:contactId})).unwrap();
      if (response.success) {
        setcontactForm(response.result);
        setIsModalOpen(true);
      } else {
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      alert("Failed to fetch details" + error.message);
    }
  };
  const handleSearchString = (setter) => (e) => {
    const searchValue = e;
    setFilterText(searchValue);
    setter(e)

    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      dispatch(
        fetchContact({ clientId: localStorage.getItem("clientId"), groupId: GroupId, searchStr: searchValue, pageNo: currentPage, pageSize })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
  const handleDeleteClick = (contactId) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteContact({ contactId })).then(() => {
            showSweetAlert({ title: " Deleted Successfully", text: "", icon: "success" });
            refreshContactList();
          });
        } catch (error) {
          alert("An unexpected error occurred" + error.message);
        }
      }
    });
  };

  const handleChange = (e) => {
    const groupId = e.target.value;
    setGroupId(groupId)
    dispatch(fetchContact({ clientId: localStorage.getItem("clientId"), groupId: groupId, searchStr: SearchStr, pageNo: currentPage, pageSize, }))
    console.log("Total Records:", totalRecords);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setcontactForm({ ...contactForm, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const requestBody = {

        contactId: contactForm.contactId || 0,
        groupId: contactForm.groupId || 0,
        firstName: contactForm.firstName || "",
        lastName: contactForm.lastName || "",
        phoneNumber: contactForm.phoneNumber || 0,
        emailAddress: contactForm.emailAddress || "",
        areaName: contactForm.areaName || "",
        actionBy: localStorage.getItem('userId'),
      };

      const response = await dispatch(updateContact(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({ title: "Updated Successfully", text: "", icon: "success" });
        setIsLoading(false);
        setIsModalOpen(false);
        refreshContactList();
      } else {
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      alert("Failed to update" + error.message);
      setIsLoading(false);
    }finally{
      setIsLoading(false);
    }
  };
  const toggleModal = (reason = null) => {
    console.log("Modal closed due to:", reason);
    setIsModalOpen(false);
  };
  const handlePageSizeChange = async (newSize) => {
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    // Fetch data with updated page size and reset to page 1
    await dispatch(fetchContact({ clientId: localStorage.getItem("clientId"), groupId: GroupId, searchStr: filterText, pageSize: newSize, pageNo: 1 }));
  };
  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(fetchContact({ clientId: localStorage.getItem("clientId"), groupId: GroupId, searchStr: filterText, pageNo: page, pageSize, }));
  };
  const refreshContactList = () => {
    dispatch(fetchContact({ clientId: localStorage.getItem("clientId"), groupId: GroupId, searchStr: filterText, pageNo: currentPage, pageSize }));
  };

  useEffect(() => {
    dispatch(fetchContact({ clientId: localStorage.getItem("clientId"), groupId: GroupId, searchStr: filterText, pageNo: currentPage, pageSize }));
    console.log("Total Records:", totalRecords);
    return () => {
      dispatch(clearContactState());
    };
  }, [dispatch]);

  const filteredClients = contacts.filter((contact) =>
    contact.firstName.toLowerCase().includes(filterText.toLowerCase())
  );
  const handleCancel = () => {
    setCreateModalOpen(false)
  };
  const handleCancelBulk = () => {
    setBulkUploadModal(false)
  };

  const handleCreate = () => {
    setCreateModalOpen(true)
  };
  const handleBulkUpload = () => {
    setBulkUploadModal(true)
  };
  const customPageSizes = [1 ,5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col  mb-1 text-start">
          <SearchBar
              label="Search"
              value={filterText}
              onChange={handleSearchString(setFilterText)}
            />
          </div>

          {/* Group Dropdown Section */}
          <div className="flex flex-col mb-1  text-start">
            
            <label className="font-medium text-gray-700 text-sm mb-1">Group</label>
            <GroupDropdown
              name="Group"
              value={GroupId}
              onChange={handleChange}
              className="border rounded w-full"
            />
          </div>
        </div>

      </div>

    );
  }, [filterText]);

  if (error) {
    return <div className="bg-red-500 text-white p-4 rounded">{error}</div>;
  }
  return (
    <App>
       {loading && <Loading />}
      <div className="flex items-center">
       
        <div >
          <h4 className="font-bold ">Contact</h4>
        </div>
        <div className=" flex ml-auto mb-1 gap-4">
          <button className="uniform_btn" onClick={handleBulkUpload}>
            Bulk Upload
          </button>
          {hasPermission("Contacts", "create") && (
          <button className="uniform_btn" onClick={handleCreate}>
            Create Contact
          </button>
          )}
        </div>
      </div>
      <div className="overflow-auto">
        <DataTable
          data={contacts}
          columns={clientColumns}
          highlightOnHover
          striped
          pagination
          sortIcon
          sortServer
          paginationServer
          paginationTotalRows={totalRecords}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePageSizeChange}
          paginationPerPage={defultpagessize} // Default number of rows per page
          paginationRowsPerPageOptions={customPageSizes} // Custom page size options
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          className="w-full border"
        />
      </div>
      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={true} toggle={() => toggleModal("close-icon")} fade={false}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
            {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-50 ">
            <Loading />
          </div>
        )}
              <ModalHeader
                toggle={() => toggleModal("close-icon")}
              >
                Edit Contact
              </ModalHeader>
              <ModalBody className="max-h-[60vh] overflow-auto">
                <form onSubmit={handleUpdateSubmit}>
                  <div className="w-full">
                    <label className="font-medium text-gray-700 text-sm"> Group </label>
                    <GroupDropdown
                      name="groupId"
                      value={contactForm.groupId || ""}
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div className="w-full ">
                    <label className="font-medium text-gray-700 text-sm">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={contactForm.firstName || ""}
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div className="w-full ">
                    <label className="font-medium text-gray-700 text-sm">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={contactForm.lastName || ""}
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>

                  <div className="w-full ">
                    <label className="font-medium text-gray-700 text-sm">Phone Number</label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={contactForm.phoneNumber || ""}
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full text-sm mt-1"
                    />
                  </div>
                  <div className="w-full ">
                    <label className="font-medium text-gray-700 text-sm">Email Address</label>
                    <input
                      type="text"
                      id="emailAddress"
                      name="emailAddress"
                      value={contactForm.emailAddress || ""}
                      onChange={handleFormChange}
                      className="mt-1 border rounded py-1 px-2 w-full text-sm "
                    />
                  </div>
                  <div className="w-full">
                    <label className="font-medium text-gray-700 text-sm">Area Name</label>
                    <input
                      id="areaName"
                      name="areaName"
                      value={contactForm.areaName || ""}
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  {hasPermission("Contacts", "update") && (
                  <div className="mt-4 w-full flex justify-end">
                    <button
                      type="submit"
                      className="uniform_btn"
                    >
                      Save
                    </button>

                  </div>
                  )}
                </form>
              </ModalBody>
            </div>
          </div>
        </Modal>
      )}
      {CreateModalOPen && (
        <ContactForm
          isVisible={true}
          onClose={handleCancel}
          onsuccess={refreshContactList}
        />
      )}
      {BulkUploadModal && (
        <BulkUpload
          isVisible={true}
          onClose={handleCancelBulk}
          onsuccess={refreshContactList} />
      )}

    </App>
  );
};

export default ContactList;
