import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormGroup,
  Row,
} from "reactstrap";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTemplates,
  clearTemplateState,
  deleteTemplates,
  syncTemplates,
  updateTemplates,
  fetchTemplatesById,
  setCurrentPage,
  setPageSize,
} from "@/slices/TemplateSlice";
import showSweetAlert from "@/components/Sweetalert";
import App from "@/components/Layout/App";
import { HiPencilAlt, HiTrash, HiRefresh, HiEye, HiArrowsExpand} from "react-icons/hi";
import { useSetRecoilState } from "recoil";
import { TemplateState } from "@/components/recoil";
import TemplateVisualisation from "../../TemplateVisualisation/index";
import { clearTemplateVisualization } from "@/slices/TemplateVisualizationSlice";
import SearchBar from "@/components/SearchBar/SearchComponent";
import Loading from "@/components/Layout/Loader";
import Updatetemplate from "../UpdateTemplate";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
const TemplateList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { templates, loading, error, pageSize, totalRecords, currentPage } =
    useSelector((state) => state.templates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [TemplateLoading, setTemplateLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [filterText, setFilterText] = useState("");
  const [transactonType, setTransactonType] = useState(0);
  const [showupdatemodel, setshowupdatemodel] = useState(false);
  const [showVisualizationModal, setShowVisualizationModal] = useState(false);
  const [templateId, settemplateId] = useState(0);
  const [SenderId, setSenderId] = useState(0);
  //const settemplateId = useSetRecoilState(TemplateState);

  const templateColumns = [
    {
      name: "Template",
      selector: (row) => row.templateName,
      sortable: true,
      width: "20%",
    },
    {
      name: "Sender Name",
      selector: (row) => row.senderName,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
   
    {
      name: "Language",
      selector: (row) => row.language,
      sortable: true,
    },
  
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Whatsapp Id",
      selector: (row) => row.templateId,
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) => row.createdDate,
      sortable: true,
    },
    
    {
      name: "Action",
      cell: (row) => (
        <center>
          <div className="flex gap-2">
            <button
              title="Edit Template"
              className="uniform_icon_btn"
              onClick={() => handleDetailClick(row.id)}
            >
              <HiEye style={{ fontSize: "15px" }} />
            </button>
            <button
              title="Template Visualisation"
              className="uniform_icon_btn"
              onClick={() => handleViualizationClick(row.id)}
            >
             <i class="fa fa-connectdevelop fa-lg" aria-hidden="true"></i>
            </button>
            <button
              title="Delete Template"
              className="uniform_icon_btn"
              onClick={() => handleDeleteClick(row.id)}
            >
              <HiTrash style={{ fontSize: "15px" }} />
            </button>
          </div>
        </center>
      ),
    },
  ];

  const handleDetailClick = (templates_Id) => {
    setTemplateLoading(true);
    try {
      settemplateId(templates_Id);
      setshowupdatemodel(true);
    } catch (error) {
      alert("Failed to fetch Template details: " + error.message);
    }
  };
  const handleViualizationClick = (templates_Id) => {
    settemplateId(templates_Id);
    setShowVisualizationModal(true)
  };

  const handleDeleteClick = (templateId) => {
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
          dispatch(deleteTemplates({ templateId })).then(() => {
            showSweetAlert({
              title: "Deleted Successfully",
              text: "",
              icon: "success",
            });
            refreshTemplateList();
          });
        } catch (error) {
          alert("An unexpected error occurred: " + error.message);
        }
      }
    });
  };

  const handlePageSizeChange = async (newSize) => {
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1));
    await dispatch(
      fetchTemplates({
        TransactonType: transactonType,
        senderId: SenderId,
        searchStr: filterText,
        pageNo: 1,
        pageSize: newSize,
      })
    );
  };

  const handlePageChange = async (page) => {
    dispatch(setCurrentPage(page));
    await dispatch(
      fetchTemplates({
        clientId: localStorage.getItem("clientId"),
        TransactonType: transactonType,
        senderId: SenderId,
        searchStr: filterText,
        pageNo: page,
        pageSize,
      })
    );
  };

  const refreshTemplateList = () => {
    dispatch(
      fetchTemplates({
        clientId: localStorage.getItem("clientId"),
        TransactonType: transactonType,
        senderId: SenderId,
        searchStr: filterText,
        pageNo: currentPage,
        pageSize,
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchTemplates({
        clientId: localStorage.getItem("clientId"),
        TransactonType: transactonType,
        senderId: SenderId,
        searchStr: filterText,
        pageNo: currentPage,
        pageSize,
      })
    );
    return () => {
      dispatch(clearTemplateState());
    };
  }, [dispatch, SenderId]);

  const filteredSendernames = templates.filter((template) =>
    template.templateName.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleCreateClick = () => {
    setTemplateLoading(true);
    router.push("/Templates/CreateTemplate");
  };
  const handleClose = () => {
    setshowupdatemodel(false);
    setTemplateLoading(false);
  };
  const handleCloseVS = () => {
    setShowVisualizationModal(false);
    dispatch(clearTemplateVisualization())

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
        fetchTemplates({
          clientId: localStorage.getItem("clientId"),
          TransactonType: transactonType,
          searchStr: searchValue,
          pageNo: currentPage,
          pageSize,
        })
      );
    }, 500);
    setSearchTimeout(timeout);
  };

  const handleSenderChange = () => (e) => {
    const senderId = e.target.value;
    setSenderId(senderId);
  };

  const customPageSizes = [1, 5, 10, 20, 50, 100];
  const defultpagessize = 10;

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col text-start mb-1">
            <SearchBar
              label="Search"
              value={filterText}
              onChange={handleSearchString(setFilterText)}
            />
          </div>
          <div className="flex flex-col text-start mb-1">
            <label className="font-medium text-gray-700 text-sm mb-1">
              Sender Names
            </label>
            <SendernameDropdown
              value={SenderId}
              onChange={handleSenderChange()}
            />
          </div>
        </div>
      </div>
    );
  }, [filterText]);

  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  return (
    <App>
      {showupdatemodel ? (
        <Updatetemplate Template_Id={templateId} onclose={handleClose} />
      )  : showVisualizationModal ? (
        <TemplateVisualisation Id={templateId} type={1} onclose={handleCloseVS} />
      ):(
        <>
          <div className="flex items-center">
            {loading || TemplateLoading ? <Loading /> : null}
            <div className="mb-1">
              <h4 className="font-bold mb-2">Templates</h4>
            </div>
            <div className="ml-auto mb-2">
              <button className="uniform_btn" onClick={handleCreateClick}>
                Create Template
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <DataTable
              data={filteredSendernames}
              columns={templateColumns}
              highlightOnHover
              striped
              pagination
              sortIcon
              sortServer
              paginationServer
              paginationTotalRows={totalRecords}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePageSizeChange}
              paginationPerPage={defultpagessize}
              paginationRowsPerPageOptions={customPageSizes}
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              className="w-full border"
            />
          </div>
        </>
      )}
    </App>
  );
};

export default TemplateList;
