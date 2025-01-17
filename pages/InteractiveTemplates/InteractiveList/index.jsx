import { useMemo, useState, useEffect } from "react";
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
  fetchInteractiveTemplates,
  clearInteractiveTemplateListState,
  setCurrentPage,
  setPageSize,
} from "@/slices/InteractiveTemplateSlice";
import showSweetAlert from "@/components/Sweetalert";
import App from "@/components/App";
import { HiPencilAlt, HiTrash, HiRefresh } from "react-icons/hi";
import { useSetRecoilState } from "recoil";
import { TemplateState } from "@/components/recoil";
import Loading from "@/components/Loader";
import { toDate } from "date-fns";
const TemplateList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [ToDate, settoDate] = useState("");
  const [FromDate, setfromDate] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const {
    interactiveTemplateList,
    loading,
    error,
    pageSize,
    totalRecords,
    currentPage,
  } = useSelector((state) => state.interactiveTemplates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [templateId, settemplateId] = useState(0);
  const [filterText, setFilterText] = useState("");
  const settemplateId = useSetRecoilState(TemplateState);
  const templateColumns = [
    {
      name: "Template Name",
      selector: (row) => row.templateName,
      sortable: true,
    },
    {
      name: "Language",
      selector: (row) => row.language,
      sortable: true,
    },
    {
      name: " Sender Name ",
      selector: (row) => row.senderName,
      sortable: true,
    },
    // { name: t("Template Language"), selector: (row) => row.language, sortable: true },
    { name: "Status ", selector: (row) => row.statusName, sortable: true },
    {
      name: "Created Date",
      selector: (row) => row.createdDate,
      sortable: true,
    },
    {
      name: "System Template?",
      selector: (row) => (row.defaultTypeId === 0 ? "No" : "Yes"),
      sortable: true,
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
            {(row.defaultTypeId === 0 || row.defaultTypeId === "0") && (
              <button
              title="Delete Interactive Template"
                className="uniform_icon_btn"
                onClick={() => handleDeleteClick(row.interactiveTemplateId)}
              >
                <HiTrash style={{ fontSize: "15px" }} />
              </button>
            )}
          </div>
        </center>
      ),
    },
  ];

  const handleDetailClick = (templates_Id) => {
    try {
      settemplateId(templates_Id);
      router.push("/InteractiveTemplates/UpdateTemplate");
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
        pageNo: currentPage,
        pageSize,
      })
    );
  };
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
        fetchInteractiveTemplates({
          clientId: localStorage.getItem("clientId"),
          toDate: ToDate,
          fromDate: FromDate,
          searchStr: searchValue,
          pageNo: currentPage,
          pageSize,
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
  useEffect(() => {
    dispatch(
      fetchInteractiveTemplates({
        clientId: localStorage.getItem("clientId"),
        toDate: ToDate,
        fromDate: FromDate,
        searchStr: filterText,
        pageNo: currentPage,
        pageSize,
      })
    );
    return () => {
      dispatch(clearInteractiveTemplateListState());
    };
  }, [dispatch, ToDate, FromDate]);
  const customPageSizes = [1 ,5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col text-start mb-1">
            <label className="font-medium text-gray-700 text-sm">Search</label>
            <input
              type="search"
              value={filterText}
              onChange={handleSearchString}
              className="border rounded"
              placeholder=""
            />
          </div>
          <div className="flex flex-col text-start mb-1">
            <label className="font-medium text-gray-700 text-sm">From Date</label>
            <input
              type="date"
              id="FromDate"
              value={FromDate}
              onChange={(e) => setfromDate(e.target.value)}
              className="border rounded  w-100"
            />
          </div>
          <div className="flex flex-col text-start mb-1">
            <label className="font-medium text-gray-700 text-sm">To Date</label>
            <input
              type="date"
              id="ToDate"
              value={ToDate}
              onChange={(e) => settoDate(e.target.value)}
              className="border rounded  w-100"
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
      <div className="flex items-center">
        {loading && <Loading />}
        <div className="mb-1">
          <h4 className="font-bold mb-2"> Interactive Templates </h4>
        </div>
        <div className="ml-auto mb-2">
          <button
            className="uniform_btn"
            onClick={() => router.push("/InteractiveTemplates/CreateTemplate")}
          >
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
                width: "100%",
                borderCollapse: "collapse", // Ensures borders collapse for proper grid appearance
              },
            },
            headRow: {
              style: {
                borderBottom: "1px solid #ddd",
                padding: "0px",
                padding: "0px", // Grid line at the bottom of the header
              },
            },
            headCells: {
              style: {
                borderRight: "1px solid #ddd", // Grid line between columns
                fontWeight: "bold",
              },
            },
            rows: {
              style: {
                borderBottom: "1px solid #ddd", // Horizontal grid line between rows
              },
            },
            cells: {
              style: {
                borderRight: "1px solid #ddd", // Vertical grid line between cells
              },
            },
          }}
        />
      </div>
    </App>
  );
};

export default TemplateList;
