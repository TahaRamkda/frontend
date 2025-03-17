import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import SweetAlert from "sweetalert2";
import { fetchFlowsListData,clearFlowListState, fetchFlowDetailsById, clearFlowDetailState, publishFlow,clearFlowPublishState, deleteFlow, clearFlowDeleteState, setCurrentPage, setPageSize } from "@/slices/FlowsSlice";
import DataTable from "react-data-table-component";
import { HiPencilAlt, HiTrash, HiUpload } from "react-icons/hi";
import showSweetAlert from "@/components/Sweetalert";
import SearchBar from "@/components/SearchBar/SearchComponent";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown"; 
import Loader from "@/components/Layout/Loader";
import App from "@/components/Layout/App";
import { useSetRecoilState } from "recoil";
import { FlowState } from "@/components/recoil";
import { set } from "date-fns";
import UpdateFlow from "../FlowDetails";
const Flow = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { flowsList, totalRecords, loading, error } = useSelector((state) => state.flows);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flowForm, setFlowForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const [PageNum, SetPageNum] = useState(1)
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [floawLoading, setFlowLoading] = useState(false);
  const [page, SetPageSize] = useState(10)
  const [SenderId , setSenderId] = useState(0);
  const[showupdateflowmodel,setshowupdateflowmodel] = useState(false);
  const[flowId, setflowId] = useState(0);
 // const setFlowsId = useSetRecoilState(FlowState);
  const flowColumn = [
    { name: "Flow Name", selector: (row) => row.flowName, sortable: true },
    { name: "Flow Language", selector: (row) => row.flowLanguage, sortable: true },
    { name: "Sender Name", selector: (row) => row.senderName, sortable: true },
    { name: "Created Date", selector: (row) => row.createdDate, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button onClick={() => handleDetailClick(row.flowId)} title="Edit Flow" className="uniform_icon_btn">
            <HiPencilAlt style={{ fontSize: "15px" }} />
          </button>
          <button onClick={() => handlePublishClick(row.flowId)} title="Publish Flow" className="uniform_icon_btn">
            <HiUpload style={{ fontSize: "15px" }} />
          </button>
          <button onClick={() => handleDeleteClick(row.flowId)} title="Delete Flow" className="uniform_icon_btn">
            <HiTrash style={{ fontSize: "15px" }} />
          </button>
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    router.push("/Flows/CreateFlow");
  };
  useEffect(() => {
    dispatch(fetchFlowsListData({pageNo:PageNum, pageSize: page, SearchStr: filterText, senderId:SenderId}));
  }, [dispatch,PageNum,page, SenderId]);

  const handleDetailClick = (flowId) => {
    setflowId(flowId);
    setshowupdateflowmodel(true);
  };
  const handlePublishClick = async (flowId) => {
    try {
      const response = await dispatch(publishFlow(flowId)).unwrap();
      if (response.success) {
        dispatch(clearFlowPublishState());
        showSweetAlert({
          title: "Published Successfully",
          text: "",
          icon: "success",
        });
      } else {
        showSweetAlert({
          title: "Failed",
          text: response.result.message || "",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Failed to Upload", err);
      showSweetAlert({
        title: "Failed",
        text: err.message || "",
        icon: "error",
      });
    }
  }
  

  const handleDeleteClick = (id) => {
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
          dispatch(deleteFlow({ id })).then(() => {
            showSweetAlert({ title: "Deleted Successfully", text: "", icon: "success" });
          });


        } catch (error) {
          alert("An unexpected error occurred: " + error.message);
        }
      }
    });
  };

  const handleSenderChange = () => (e) => {
    const senderId = e.target.value;  
      setSenderId(senderId);
    }
  
   const handlePageSizeChange = async (newSize) => {
      SetPageSize(newSize)
      dispatch(setPageSize(newSize));
      dispatch(setCurrentPage(1)); // Reset to first page
      setFlowLoading(true);
      await dispatch(
        fetchFlowsListData({
          SearchStr: filterText,
          pageSize: newSize,
          pageNo: 1, senderId:SenderId
        })
      );
    };

     const handlePageChange = async (pageNo) => {
        SetPageNum(pageNo)
        dispatch(setCurrentPage(pageNo));
        setFlowLoading(true);
        await dispatch(
          fetchFlowsListData({
            SearchStr: filterText ,
            pageSize:page,
            pageNo: pageNo, senderId:SenderId
          })
        );
    
      };

  const handleSearchString = (setter) => (e) => {
     const searchValue = e;
     setFilterText(searchValue);
     
     setter(e);
 
     if (searchTimeout) {
       clearTimeout(searchTimeout);
     }
 
     const timeout = setTimeout(() => {
       dispatch(
         fetchFlowsListData({
           SearchStr: searchValue,
           pageSize:page,
           pageNo: PageNum, senderId:SenderId
         })
       );
     }, 500);
 
     setSearchTimeout(timeout); // Save the timeout reference
   };
 

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
          <div className="flex flex-col space-y-1 text-start mb-1">
          <label className="font-medium text-gray-700 text-sm ">Sender Names</label>
            <SendernameDropdown
              value={filterText}
              onChange={handleSearchString(setFilterText)}
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
  const customPageSizes = [1, 5, 10, 20, 50, 100]; // Custom page size options
  // const handleSave = () => {
  //   setFlowsList((prevFlows) =>
  //     prevFlows.map((flow) => (flow.id === flowForm.id ? flowForm : flow))
  //   );
  //   setIsModalOpen(false);
  // };
 
  const handleClose = () => {
    setshowupdateflowmodel(false);
    setFlowLoading(false);
  };
  
  return (
    <App>
      {floawLoading && loading && <Loader />}
      {showupdateflowmodel ? (
        <UpdateFlow 
        Flow_Id={flowId}
        onclose={handleClose} />
      ) : (
        <>
     <div className="flex items-center">
        {/* {loading && <Loader />} */}
        <div className=''>
          <h4 className="font-bold">Flows</h4>
        </div>
        <div className="ml-auto mb-1">
          <button
            className="uniform_btn"
            onClick={handleCreate}
          >
            Create Flows
          </button>
        </div>
      </div>

      <div className="overflow-auto">
      <DataTable
        data={flowsList}
        columns={flowColumn}
        highlightOnHover
        striped
        pagination
        paginationServer
        paginationTotalRows={totalRecords}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePageSizeChange}
        sortIcon
        sortServer
        
        paginationRowsPerPageOptions={customPageSizes}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        className="w-full border"
        customStyles={{
          table: {
            style: {
              width: "100%",
              borderCollapse: "collapse",
            },
          },
          headRow: {
            style: {
              borderBottom: "1px solid #ddd",
              padding: "0px",
            },
          },
          headCells: {
            style: {
              borderRight: "1px solid #ddd",
              fontWeight: "bold",
            },
          },
          rows: {
            style: {
              borderBottom: "1px solid #ddd",
            },
          },
          cells: {
            style: {
              borderRight: "1px solid #ddd",
            },
          },
        }}
      />
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
      </>
       )}
    </App>
  );
};

export default Flow;
