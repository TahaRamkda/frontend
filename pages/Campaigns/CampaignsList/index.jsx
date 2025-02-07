import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCampaign, clearCampaignListState, activateCampaign, clearCampaignActivateState, setPageSize, setCurrentPage } from "@/slices/campaignSlice";
import { Card, CardBody, CardHeader, Col, Input, Label, Alert, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Row, Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import TemplateDropdown from '@/components/Dropdowns/TemplateDropdown';
import showSweetAlert from "@/components/Sweetalert";
import App from "@/components/Layout/App";
import { useRouter } from "next/router"; // Correct import
import DataTable from "react-data-table-component";
import Loading from "@/components/Layout/Loader";
import { HiPencilAlt, HiTrash, HiLightningBolt, HiClock, HiBeaker } from "react-icons/hi";
import { MdGroupRemove } from "react-icons/md";
import { useSetRecoilState } from "recoil";
import { CampaignState } from "@/components/recoil";
import CampaignTest from '../CampaignTest';
import LastContactedList from '../Contacted';
import {Tooltip} from 'reactstrap';
import { REFRESH_INTERVAL } from '@/utils/constants';
import { set, toDate } from 'date-fns';
import SearchBar from '@/components/SearchBar/SearchComponent';
import DateTimePicker from '@/components/Timepicker/datetimepicker';
const CampaignsList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [templateId, settemplateId] = useState(0);
  const [status, setstatus] = useState(0);
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [sendernameId, setsendernameId] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [isfilteropen, setisfilteropen] = useState(false);
  const [showfilterbutton, setshowfilterbutton] = useState(true);
  const [Size, setSize] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ContactedModal, setContactedModaL] = useState(false);
  const [CampaignTestModal, setCampaignTestModal] = useState(false)
  const [CampaignId, setCampaignId] = useState(null);
  const [activateCampaignId, setactivateCampaignId] = useState(null);
  const [CampaignForm, setCampaignForm] = useState({});
  const { campaigns, loading, error, currentPage, pageSize, totalRecords } =
    useSelector((state) => state.campaigns);
  const [clientId, setClientId] = useState(null);
  const isLiveReporting = useRef(false); // UseRef to track live reporting state
  const setCampaignsId = useSetRecoilState(CampaignState);
 const [campaignloading, setcampaignloading] = useState(false);
  const customPageSizes = [1 ,5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10

  const handleTemplateChange = (e) => {
    const template = e.target.value;
    settemplateId(template);
     setcampaignloading(true)
    dispatch(
      fetchCampaign({
        ClientId: localStorage.getItem("clientId"), FromDate: FromDate, ToDate: ToDate, status, templateId: template, srcStr: keyword, pageSize, PageNo: currentPage,
      }));
  };

  useEffect(() => {
    if (!loading && campaigns) {
      setcampaignloading(false);
    }
  }, [loading, campaigns]);
 


  useEffect(() => {
    const checkAndFetch = async () => {
      const isLiveReporting = JSON.parse(localStorage.getItem("isLiveReporting"));
  
      if (isLiveReporting) {
        dispatch(
          fetchCampaign({ ClientId: localStorage.getItem("clientId"), FromDate: FromDate, ToDate: ToDate, status: status, templateId: templateId, srcStr: keyword, pageSize, PageNo: currentPage})
        );
      } else {
        // Handle the case when isLiveReporting is false
      }
    };
  
    // Run the function every 5 minutes
    const intervalId = setInterval(() => {
      // Perform the periodic refresh (e.g., every 5 minutes) if page is loaded
      if (!loading) {
        checkAndFetch();
      }
    }, REFRESH_INTERVAL);
  
    // Run the function once immediately

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [dispatch,FromDate,ToDate,status,templateId,currentPage,pageSize]);


 


  const HandleUpdateCampaign = (CampaignId) => {
    setCampaignsId(CampaignId);
    router.push("/Campaigns/UpdateCampaign");
  };
  const handleTestCampaign = (CampaignId) => {
    setactivateCampaignId(CampaignId)
    setCampaignTestModal(true)
  }
  const handleSearchString = setter => (e) => {
    const searchValue = e;
    setKeyword(searchValue);
    setter(e)

    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      setcampaignloading(true);
      dispatch(
        fetchCampaign({ ClientId: localStorage.getItem("clientId"), FromDate: FromDate, ToDate: ToDate, status: status, templateId: templateId, srcStr: searchValue, pageSize, PageNo: currentPage})
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };



 useEffect(() => {
    
      const clientId = localStorage.getItem("clientId");
      setcampaignloading(true);
      dispatch(fetchCampaign({ ClientId: clientId, FromDate: FromDate, ToDate: ToDate, status: status, templateId: templateId, srcStr: keyword, pageSize, PageNo: currentPage }));
    
    return () => {
      clearCampaignListState();
    };
  }, [dispatch, FromDate, ToDate,templateId]);

  const handleCreate = () => {
    window.location.href = "/Campaigns/CreateCampaigns";
  }

  const handelClick = (campaignId) => {
    setCampaignId(campaignId)
    setContactedModaL(true)
  }
  const handelCancelClick = () => {
    setContactedModaL(false)
    setCampaignTestModal(false)
  }

  const handelCloseClick = () => {
    setContactedModaL(false)
    setCampaignTestModal(false)
  }


  const refreshCampaignList = () => {
    setcampaignloading(true)
    dispatch(fetchCampaign({ ClientId: localStorage.getItem("clientId"), FromDate: FromDate, ToDate: ToDate, status: status, templateId: templateId, srcStr: keyword, pageSize, PageNo: currentPage }));
  }

  const handlePageSizeChange = async (newSize) => {
    setSize(newSize);
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to the first page
    setcampaignloading(true)
    await dispatch(fetchCampaign({ ClientId: localStorage.getItem("clientId"), FromDate: FromDate, ToDate: ToDate, status: status, templateId: templateId, srcStr: keyword, pageSize: newSize, PageNo: 1 }));
  };

  const handlePageChange = async (page) => {
    setcampaignloading(true)
    dispatch(setCurrentPage(page));
    await dispatch(fetchCampaign({ ClientId: localStorage.getItem("clientId"), FromDate: FromDate, ToDate: ToDate, status: status, templateId: templateId, srcStr: keyword, pageSize, PageNo: page }));
  };

  const handleActivateClick = async (campaignId) => {
    setCampaignId(campaignId);
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCampaignForm({ ...CampaignForm, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        clientId: localStorage.getItem("clientId"),
        campaignId: CampaignId,
        scheduleDate: CampaignForm.scheduleDate,
      };
      setIsModalOpen(false)
     
      const response = await dispatch(activateCampaign(requestBody)).unwrap();
      if (response.success) {
        refreshCampaignList()
        showSweetAlert({
          title: "Schedule Successfully",
          text: "",
          icon: "success",
        });
        setIsModalOpen(false);
      } else {
        showSweetAlert({
          title: "Error",
          text: response.message,
          icon: "error",
        });
      }
      
    } catch (error) {
      showSweetAlert({ title: "Failed", text: error.message, icon: "error" });
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US");
  };

  const campaignColumns = [
    {
      name: "Campaign Name",
      selector: (row) => row.campaignName,
      sortable: true,width: '10%'
      
    },
    {
      name: "Schedule Date",
      selector: (row) => row.scheduleDate,
      sortable: true, width: '15%',
     
    },
    { name: "Status", selector: (row) => row.statusName, sortable: true },
    {
      name: "Contacts",
      selector: (row) => row.totalContacts,
      sortable: true
      
    },
    { name: "Sent", selector: (row) => row.sentCount, sortable: true, },
    { name: "Delivered", selector: (row) => row.deliveredCount, sortable: true},
    { name: "Read", selector: (row) => row.readCount, sortable: true},
    { name: "Failed", selector: (row) => row.failedCount, sortable: true},
    { name: "Created Date", selector: (row) => row.createdDate, sortable: true,width: '15%' },
    {
      name: "Action", cell: (row) => {
        const scheduleDate = new Date(row.scheduleDate); // Convert scheduleDate to Date object
        const currentTime = new Date(); // Get current time
      
        // Check if scheduleDate is today
        const isSameDay =
          scheduleDate.getDate() === currentTime.getDate() &&
          scheduleDate.getMonth() === currentTime.getMonth() &&
          scheduleDate.getFullYear() === currentTime.getFullYear();
      
        const timeDifference = (scheduleDate - currentTime) / (1000 * 60 * 60); // Difference in hours
      
        return (
          <div className='Action_table' id='InfoIcon'>
            <button title="Schedule Campaign" className="uniform_icon_btn Action_Button" onClick={() => handleActivateClick(row.campaignId)}>
              <HiLightningBolt style={{ fontSize: "15px" }} />
            </button>
            <button title="Last Contacted People" className="uniform_icon_btn Action_Button" onClick={() => handelClick(row.campaignId)}>
              <MdGroupRemove style={{ fontSize: "15px" }} />
            </button>
            <button title="Test Campaign" className="uniform_icon_btn Action_Button" onClick={() => handleTestCampaign(row.campaignId)}>
              <HiBeaker style={{ fontSize: "15px" }} />
            </button>
             {/* Conditionally render the Edit button */}
             {(isSameDay && timeDifference > 3) || !isSameDay ? (
              <button title="Edit Campaign" className="uniform_icon_btn Action_Button" onClick={() => HandleUpdateCampaign(row.campaignId)}>
                <HiPencilAlt style={{ fontSize: "15px" }} />
              </button>
            ) : null}
          </div>
        );
      }
    }
    

  ];
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className='w-full'>
        
        <div className="grid grid-cols-5 gap-4 justify-start">
        
          <div className="flex flex-col text-start mb-1">
            <Label className="font-medium text-sm mb-0">Select Templates</Label>
            <TemplateDropdown
              name="role_Id"
              onChange={handleTemplateChange}
              className="border rounded w-100 MarginBOt"
              TransactionType={1}
            />
          </div>
          <div className="flex flex-col text-start mb-1">
          <SearchBar
              label="Search"
              value={keyword}
              onChange={handleSearchString(setKeyword )}
            />
          </div>
          <div className="flex flex-col text-start mb-1">
             <DateTimePicker
              label="From Date"
              value={FromDate}
              onChange={setFromDate}
            />
          </div>
          <div className="flex flex-col text-start mb-1">
          <DateTimePicker
              label="To Date"
              value={ToDate}
              onChange={setToDate}
            />
          </div>

        </div>
      </div>
    );
  }, [keyword, FromDate, ToDate, templateId]);

  return (
    
    <App>
      
      { campaignloading && <Loading />}
      <div className="flex items-center">
     
        <div className='mb-1'>
          <h4 className="font-bold mb-2">Campaign</h4>
        </div>
        <div className="ml-auto mb-2">
          <Button
            color="primary"
            className="uniform_btn"
            onClick={handleCreate} // Navigate on create
            type="button"
          >
            Create Campaign
          </Button>
        </div>
      </div>


      <div className="overflow-auto">
        <DataTable
          data={campaigns}
          columns={campaignColumns}
          highlightOnHover
          striped
          sortIcon
          sortServer
          pagination
          paginationServer
          paginationTotalRows={totalRecords}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePageSizeChange}
          paginationPerPage={defultpagessize} // Default number of rows per page
          paginationRowsPerPageOptions={customPageSizes} // Custom page size options
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
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)} fade={false}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
            <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>Schedule Campaign</ModalHeader>
            <ModalBody>
              {CampaignForm && (
                <Form onSubmit={handleUpdateSubmit}>
                  <div className='w-1/2'>
                    <Label for="scheduleDate">Schedule Date </Label>
                    <Input type="datetime-local" id="scheduleDate" name="scheduleDate" value={CampaignForm.scheduleDate || ""} onChange={handleFormChange} />
                  </div>
                  <div className='mt-4 text-end w-full' >
                    <Button color="secondary" className='uniform_btn ' type="submit">Save</Button>
                  </div>


                </Form>
              )}
            </ModalBody>
          </div>
        </div>
      </Modal>
      {ContactedModal && (
        <LastContactedList
          isVisible={true}
          onClose={handelCancelClick}
          onsuccess={refreshCampaignList}
          campaignId={CampaignId}
        />
      )}
      {CampaignTestModal && (
        <CampaignTest
          isVisible={true}
          onClose={handelCloseClick}
          onsuccess={refreshCampaignList}
          CampaignId={activateCampaignId}
        />
      )}
    </App>
  );
};

export default CampaignsList;
