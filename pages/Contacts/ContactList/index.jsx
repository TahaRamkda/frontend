import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchContact, clearContactState, deleteContact, fetchContactById, updateContact, setPageSize,setCurrentPage } from "@/slices/ContactSlice";
import showSweetAlert from "@/components/Sweetalert";
import { Row, Modal, ModalBody, ModalHeader } from "reactstrap";
import GroupDropdown from '@/components/Dropdowns/GroupDropdown'; 
import ContactForm from "../CreateContact";
import Loading from "@/components/Loader";
import { HiPencilAlt, HiTrash ,HiRefresh  } from "react-icons/hi";
import App from '@/components/App';
const ContactList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { contacts, loading, error,pageSize, totalRecords, currentPage } = useSelector((state) => state.contacts);
  const { client } = useSelector((state) => state.clients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactForm, setcontactForm] = useState({});
  const [filterText, setFilterText] = useState('');
  const [GroupId,setGroupId] = useState(0);
  const [SearchStr , setSearchStr]= useState("")
  const [CreateModalOPen, setCreateModalOpen] = useState(false);
  const clientColumns = [
    { name: "Group Name", selector: (row) => row.groupName, sortable: true },
    { name: "First name", selector: (row) => row.firstName, sortable: true },
    { name: "Last Name", selector: (row) => row.lastName, sortable: true },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Email", selector: (row) => row.emailAddress, sortable: true },
    { name: "Area Name", selector: (row) => row.areaName, sortable: true },
   
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="flex gap-2">
          <button className="uniform_icon_btn" onClick={() => handleDetailClick(row.contactId)}>
            <HiPencilAlt style={{fontSize: "15px"}}/>
            </button> 
        <button className="uniform_icon_btn" onClick={() => handleDeleteClick(row.contactId)}>
            <HiTrash style={{fontSize: "15px"}}/>
            </button>
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
    try {
      const response = await dispatch(fetchContactById(contactId)).unwrap();
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
          dispatch(deleteContact({ contactId })).then(()=>{
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
    dispatch(fetchContact({clientId: localStorage.getItem("clientId"),groupId: groupId,searchStr: SearchStr,pageNo: currentPage, pageSize,}))
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setcontactForm({ ...contactForm, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
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
        setIsModalOpen(false);
        refreshContactList();
      } else {
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      alert("Failed to update" + error.message);
    }
  };

  const handlePageSizeChange = async (newSize) => {
          // Update page size and reset to the first page
          dispatch(setPageSize(newSize));
          dispatch(setCurrentPage(1)); // Reset to first page
          // Fetch data with updated page size and reset to page 1
          await dispatch(fetchContact({ clientId: localStorage.getItem("clientId"),groupId: GroupId,searchStr: filterText , pageSize : newSize, pageNo:1 }));
        };

  const handlePageChange = async (page) => {
        // Update current page state in Redux
        dispatch(setCurrentPage(page));
      
        // Fetch clients for the new page
        await dispatch(fetchContact({ clientId: localStorage.getItem("clientId"),groupId: GroupId,searchStr: filterText,pageNo: page, pageSize,}));
      };
  const refreshContactList = () => {
    dispatch(fetchContact({clientId: localStorage.getItem("clientId"), groupId: GroupId,searchStr: filterText,pageNo: currentPage, pageSize}));
  };

  useEffect(() => {
    dispatch(fetchContact({ clientId: localStorage.getItem("clientId"), groupId: GroupId,searchStr: filterText,pageNo: currentPage, pageSize}));
    return () => {
      dispatch(clearContactState());
    };
  }, [dispatch,filterText]);

  const filteredClients = contacts.filter((contact) =>
    contact.firstName.toLowerCase().includes(filterText.toLowerCase())
  );
  const handleCancel = () => {
    setCreateModalOpen(false)
  };

  const handleCreate = () => {
    setCreateModalOpen(true)
  };
  

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
      
      <div className="grid grid-cols-5 gap-4  ">
  {/* Search Section */}

  <div className="flex flex-col  mb-1 text-start">
    <label className="font-medium text-gray-700 text-sm">Search</label>
    <input
      type="search"
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
      className="border rounded py-1 px-2 w-full text-sm"
      // placeholder="Search"
    />
  </div>

  {/* Group Dropdown Section */}
  <div className="flex flex-col mb-1  text-start">
    <label className="font-medium text-gray-700 text-sm">Group</label>
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
     <div className="flex items-center">
  {loading && <Loading />}
  <div >
  <h4 className="font-bold ">Contact List</h4>
  </div>
  <div className="ml-auto mb-1">
  <button className="uniform_btn" onClick={handleCreate}>
          Create Contact
        </button>
  </div>
</div>
        <div className="overflow-auto">
        <DataTable
              data={contacts}
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
      

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
          <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-800"
      >
        &times;
      </button>
            <h2 className="text-xl font-semibold mb-3">Edit Contact</h2>
            
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
                  <label  className="font-medium text-gray-700 text-sm">First Name</label>
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
                  <label  className="font-medium text-gray-700 text-sm">Email Address</label>
                  <input 
                    type="text" 
                    id="emailAddress" 
                    name="emailAddress" 
                    value={contactForm.emailAddress || ""} 
                    onChange={handleFormChange} 
                    className="mt-1 border rounded py-1 px-2 w-full text-sm "
                  />
                </div>
              
              <div className="mt-4 w-full flex justify-end">
                <button 
                  type="submit" 
                  className="uniform_btn"
                >
                  Save
                </button>
                
              </div>
            </form>
          </div>
        </div>
      )}
      {CreateModalOPen &&(
        <ContactForm 
        isVisible={true}
        onClose={handleCancel}
        onsuccess={refreshContactList}
        />
      )}
    </App>
  );
};

export default ContactList;
