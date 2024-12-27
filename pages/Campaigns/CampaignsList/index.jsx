import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCampaign, clearCampaignListState, activateCampaign, clearCampaignActivateState, setPageSize, setCurrentPage } from "@/slices/CampaignSlice";
import { Card, CardBody, CardHeader, Col, Input, Label, Alert, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Row, Table, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import TemplateDropdown from '@/components/Dropdowns/TemplateDropdown';
import Loader from '@/components/Loader';
import showSweetAlert from "@/components/Sweetalert";
import App from "@/components/App";
import { useRouter } from 'next/router';  // Correct import
import DataTable from 'react-data-table-component';
import Loading from "@/components/Loader";
import { HiPencilAlt, HiTrash, HiLightningBolt  } from "react-icons/hi";

import { useSetRecoilState } from 'recoil';
import { CampaignState } from '@/components/recoil';
import LastContactedList from '../Contacted';

const CampaignsList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [templateId, settemplateId] = useState(0);
  const [status, setstatus] = useState(0);
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const [srcStr, setsrcStr] = useState("");
  const [sendernameId, setsendernameId] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [isfilteropen, setisfilteropen] = useState(false);
  const [showfilterbutton, setshowfilterbutton] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ContactedModal, setContactedModaL] = useState(false);
  const [CampaignId, setCampaignId] = useState(null);
  const [CampaignForm, setCampaignForm] = useState({});

  const { campaigns, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.campaigns);
  const [clientId, setClientId] = useState(null);
  const setCampaignsId = useSetRecoilState(CampaignState);
  const handleSearchString = (e) => {
    setKeyword(e.target.value);
  };
  const refreshCampaignList = () =>{
    dispatch(
      fetchCampaign({
        ClientId: clientId,
        FromDate: FromDate,
        ToDate: ToDate,
        status,
        templateId,
        srcStr,
        pageSize,
        PageNo: currentPage,
      })
    );
  }

  const handleTemplateChange = (e) => {
    const template = e.target.value;
    settemplateId(template);
  };

  const HandleUpdateCampaign = (CampaignId) => {
    setCampaignsId(CampaignId);
    router.push('/Campaigns/UpdateCampaign');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientId(localStorage.getItem('clientId'));
    }
  }, []);

  useEffect(() => {
    if (clientId) {
      dispatch(
        fetchCampaign({
          ClientId: clientId,
          FromDate: FromDate,
          ToDate: ToDate,
          status,
          templateId,
          srcStr,
          pageSize,
          PageNo: currentPage,
        })
      );
    }
    return () => {
      dispatch(clearCampaignListState());
    };
  }, [clientId, FromDate, ToDate, srcStr]);

   useEffect(() => {
      if (clientId) {
        
        dispatch(fetchCampaign({ ClientId: clientId, FromDate: FromDate , ToDate:ToDate, status:status, templateId:templateId, srcStr:srcStr, pageSize,PageNo:currentPage}));
      }
      return () => {
        dispatch(clearCampaignListState());
      };
    }, [dispatch, clientId]);
  

  

  const handlefilter = (e) => {
    dispatch(fetchCampaign({ clientId: clientId, FromDate: FromDate, ToDate: ToDate, status: status, sendernameId: sendernameId, templateId: templateId, srcStr: srcStr, pageSize, PageNo: currentPage }));
  };

  const handleCreate = () => {
     window.location.href ="/Campaigns/CreateCampaigns";
  }

  const handelClick = () =>{
    setContactedModaL(true)
  }
  const handelCancelClick = () =>{
    setContactedModaL(false)
  }




    const handlePageSizeChange = async (newSize) => {
       dispatch(setPageSize(newSize));
       dispatch(setCurrentPage(1)); // Reset to the first page
       await dispatch(fetchCampaign({ ClientId: clientId, FromDate: FromDate , ToDate:ToDate, status:status, templateId:templateId, srcStr:srcStr, pageSize:newSize , PageNo:1 }));
     };

  const handlePageChange = async (page) => {
    dispatch(setCurrentPage(page));
    await dispatch(fetchCampaign({ ClientId: clientId, FromDate: FromDate, ToDate: ToDate, status: status, templateId: templateId, srcStr: srcStr, pageSize, PageNo: page }));
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
        campaignId: CampaignId,
        scheduleDate: CampaignForm.scheduleDate,
      };

      const response = await dispatch(activateCampaign(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({ title: "Updated Successfully", text: "", icon: "success" });
        setIsModalOpen(false);
      } else {
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      showSweetAlert({ title: "Failed", text: error.message, icon: "error" });
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US');
  };

  const campaignColumns = [
    { name: "Campaign Name", selector: (row) => row.campaignName, sortable: true },
    { name: "Schedule Date", selector: (row) => row.scheduleDate, sortable: true },
    { name: "Status", selector: (row) => row.statusName, sortable: true },
    { name: "Total Contacts", selector: (row) => row.totalContacts, sortable: true },
    { name: "Sent Count", selector: (row) => row.sentCount, sortable: true },
    { name: "Failed Count", selector: (row) => row.failedCount, sortable: true },
    { name: "Delivered Count", selector: (row) => row.deliveredCount, sortable: true },
    { name: "Undelivered Count", selector: (row) => row.undeliveredCount, sortable: true },
    { name: "Created Date", selector: (row) => row.createdDate, sortable: true },
    { name: "Action", cell: (row) => (
      <div className='flex gap-2'>
      <button className="uniform_icon_btn" onClick={() => handleActivateClick(row.campaignId)}>
        <HiLightningBolt style={{fontSize: "15px"}} />
      </button>
      <button className="uniform_icon_btn" onClick={() => HandleUpdateCampaign(row.campaignId)}>
        <HiPencilAlt style={{fontSize: "15px"}} />
      </button>
      <button className="uniform_icon_btn" onClick={handelClick}></button>
      </div>
      
    )},
    
  ];
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="flex gap-5 w-full">
        <div className="text-start">
          <Label className="font-medium text-sm mb-0">Select Templates</Label>
          <TemplateDropdown
            name="role_Id"
            onChange={handleTemplateChange}
            className="border rounded w-100 MarginBOt"
          />
        </div>
        <div className="text-start ">
          <Label className="font-medium text-sm mb-0">Search</Label>
          <Input
            type="text"
            placeholder=""
            value={srcStr}
            onChange={handleSearchString}
            className="border rounded  w-100"
          />
        </div>
        <div className="text-start">
          <Label className="font-medium text-sm mb-0">From Date</Label>
          <Input
            type="date"
            id="FromDate"
            value={FromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded  w-100"
          />
        </div>
        <div className="text-start ">
          <Label className="font-medium text-sm mb-0">To Date</Label>
          <Input
            type="date"
            id="ToDate"
            value={ToDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded  w-100"
          />
        </div>
       
      </div>
      
    );
  }, [srcStr, FromDate, ToDate, templateId]);

  return (
    <App>
      <div className="flex items-center">
  {loading && <Loading />}
  <div className='mb-1'>
  <h4 className="font-bold mb-2">Campaign List</h4>
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
                    borderBottom: '1px solid #ddd',  padding: '0px',
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
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)} style={{ maxWidth: '800px', width: '90%' }}>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>Schedule Campaign</ModalHeader>
        <ModalBody>
          {CampaignForm && (
            <Form onSubmit={handleUpdateSubmit}>
             <div className='w-1/2'>
              <Label for="scheduleDate">Schedule Date </Label>
              <Input type="datetime-local"  id="scheduleDate" name="scheduleDate" value={CampaignForm.scheduleDate || ""} onChange={ handleFormChange } />
              </div>
              <div className='mt-4 text-end w-full' >
              <Button color="secondary" className='uniform_btn ' type="submit">Save</Button>
              </div>


            </Form>
          )}
        </ModalBody>
      </Modal>
      {ContactedModal &&(
        <LastContactedList
        isVisible={true}
        onClose={handelCancelClick}
        onsuccess={refreshCampaignList}/>
      )}
    </App>
  );
};

export default CampaignsList;
