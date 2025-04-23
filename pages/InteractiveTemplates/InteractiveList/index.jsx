import { useMemo, useState, useEffect } from "react";
import { Alert } from "reactstrap";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import {
  fetchInteractiveTemplates,
  clearInteractiveTemplateListState,
  setCurrentPage,
  setPageSize,
} from "@/slices/InteractiveTemplateSlice";
import showSweetAlert from "@/components/Sweetalert";
import App from "@/components/Layout/App";
import { HiPencilAlt, HiTrash, HiRefresh, HiArrowsExpand } from "react-icons/hi";
import { useSetRecoilState } from "recoil";
import { TemplateState } from "@/components/recoil";
import Loader from "@/components/Layout/Loader";
import TemplateVisualisation from "@/pages/TemplateVisualisation";
import { clearTemplateVisualization } from "@/slices/TemplateVisualizationSlice";
import SearchBar from "@/components/SearchBar/SearchComponent";
import { toDate } from "date-fns";
import DateTimePicker from "@/components/Timepicker/datetimepicker";
import Updatetemplate from "../UpdateTemplate";
import SendernamesDropdown from "@/components/MultiSelect/SendernameDropdown";
const InteractiveTemplateList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [ToDate, settoDate] = useState("");
  const [FromDate, setfromDate] = useState("");
  const [showVisualizationModal, setShowVisualizationModal] = useState(false);
  const [showupdatemodel, setshowupdatemodel] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const {
    interactiveTemplateList,
    loading,
    error,
    pageSize,
    totalRecords,
    currentPage,
  } = useSelector((state) => state.interactiveTemplates);
  const [filterText, setFilterText] = useState("");
  const [TemplateLoading, setTemplateLoading] = useState(false);
  const [templateId, settemplateId] = useState(0);
  const [senderId, setsenderId] = useState(0);

  const handleViualizationClick = (templates_Id) => {
    settemplateId(templates_Id);
    setShowVisualizationModal(true);
  };
  const handleCloseVS = () => {
    setShowVisualizationModal(false);
    dispatch(clearTemplateVisualization());
  };
  const templateColumns = [
    {
      name: "Template",
      selector: (row) => row.templateName,
      sortable: true,
      width: "20%",
    },
    {
      name: " Sender Name",
      selector: (row) => row.senderName,
      sortable: true,
      width: "17%",
    },
    {
      name: "Language",
      selector: (row) => row.language,
      sortable: true,
    },
    // { name: t("Template Language"), selector: (row) => row.language, sortable: true },
    { name: "Status ", selector: (row) => row.statusName, sortable: true },
    {
      name: "Created Date",
      selector: (row) => row.createdDate,
      sortable: true,
      width: "20%",
    },
    {
      name: "System Template",
      selector: (row) => (row.defaultTypeId === 0 ? "No" : "Yes"),
      sortable: true,
      width: "16%",
    },
    {
      name: "Action",
      cell: (row) => (
        <center>
          <div className="flex gap-2">
            <button
              title="Edit Interactive Template"
              className="uniform_icon_btn"
              onClick={() => handleDetailClick(row.interactiveTemplateId)}
            >
              <HiPencilAlt style={{ fontSize: "15px" }} />
            </button>
            <button
              title="Template Visualisation"
              className="uniform_icon_btn"
              onClick={() => handleViualizationClick(row.interactiveTemplateId)}
            >
              <i class="fa fa-connectdevelop fa-lg" aria-hidden="true"></i>
            </button>
            {/* {(row.defaultTypeId === 0 || row.defaultTypeId === "0") && (
              <button
              title="Delete Interactive Template"
                className="uniform_icon_btn"
                onClick={() => handleDeleteClick(row.interactiveTemplateId)}
              >
                <HiTrash style={{ fontSize: "15px" }} />
              </button>
            )} */}
          </div>
        </center>
      ),
    },
  ];

  const handleClose = () => {
    setshowupdatemodel(false);
    setTemplateLoading(false);
  };

  const handleDetailClick = (templates_Id) => {
    try {
      settemplateId(templates_Id);
      setshowupdatemodel(true);
    } catch (error) {
      alert(t("Failed to fetch Template details: ") + error.message);
    }
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
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    // Fetch data with updated page size and reset to page 1
    await dispatch(
      fetchInteractiveTemplates({
        clientId: localStorage.getItem("clientId"),
        senderId: senderId,
        toDate: ToDate,
        fromDate: FromDate,
        searchStr: filterText,
        pageNo: 1,
        pageSize: newSize,
      })
    );
  };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(
      fetchInteractiveTemplates({
        clientId: localStorage.getItem("clientId"),
        toDate: ToDate,
        senderId: senderId,
        fromDate: FromDate,
        searchStr: filterText,
        pageNo: page,
        pageSize,
      })
    );
  };
  const refreshTemplateList = () => {
    dispatch(
      fetchInteractiveTemplates({
        clientId: localStorage.getItem("clientId"),
        searchStr: filterText,
        senderId: senderId,
        pageNo: currentPage,
        pageSize,
      })
    );
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
        fetchInteractiveTemplates({
          clientId: localStorage.getItem("clientId"),
          toDate: ToDate,
          fromDate: FromDate,
          senderId: senderId,
          searchStr: searchValue,
          pageNo: currentPage,
          pageSize,
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };

  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setsenderId(senderId);
  };

  const handleCreateClick = () => {
    setTemplateLoading(true);
    router.push("/InteractiveTemplates/CreateTemplate");
  };
  useEffect(() => {
    dispatch(
      fetchInteractiveTemplates({
        clientId: localStorage.getItem("clientId"),
        toDate: ToDate,
        fromDate: FromDate,
        senderId: senderId,
        searchStr: filterText,
        pageNo: currentPage,
        pageSize,
      })
    );
    return () => {
      dispatch(clearInteractiveTemplateListState());
    };
  }, [dispatch, ToDate, FromDate, senderId]);
  const customPageSizes = [1, 5, 10, 20, 50, 100]; // Custom page size options
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
              name="senderId"
              value={senderId}
              onChange={handleSenderChange}
            />
          </div>
          <div className="flex flex-col text-start mb-1">
            <DateTimePicker
              label="From Date"
              value={FromDate}
              onChange={setfromDate}
            />
          </div>
          <div className="flex flex-col text-start mb-1">
            <DateTimePicker
              label="To Date"
              value={toDate}
              minDate={FromDate}
              onChange={settoDate}
            />
          </div>
        </div>
      </div>
    );
  }, [filterText, FromDate, ToDate]);

  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  return (
    <App>
      {showupdatemodel ? (
        <Updatetemplate Template_Id={templateId} onclose={handleClose} />
      ) : showVisualizationModal ? (
        <TemplateVisualisation
          Id={templateId}
          type={2}
          onclose={handleCloseVS}
        />
      ) : (
        <>
          <div className="flex items-center">
            {(loading || TemplateLoading) && <Loader />}
            <div className="mb-1">
              <h4 className="font-bold mb-2"> Interactive Templates </h4>
            </div>
            <div className="ml-auto mb-2">
              <button className="uniform_btn" onClick={handleCreateClick}>
                Create Template
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <DataTable
              data={interactiveTemplateList}
              columns={templateColumns}
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
            />
          </div>
        </>
      )}
    </App>
  );
};

export default InteractiveTemplateList;
