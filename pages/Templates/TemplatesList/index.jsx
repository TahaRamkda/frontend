import React, { useMemo, useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Input, Label, Alert, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Row, } from "reactstrap";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchTemplates, clearTemplateState, deleteTemplates, syncTemplates, updateTemplates, fetchTemplatesById, setCurrentPage, setPageSize } from "@/slices/TemplateSlice";
import showSweetAlert from "@/components/Sweetalert";
import UpdateTemplate from "../UpdateTemplate";
import App from "@/components/Layout/App";
import { HiPencilAlt, HiTrash, HiRefresh, HiEye } from "react-icons/hi";
import { useSetRecoilState } from "recoil";
import { TemplateState } from "@/components/recoil";
import SearchBar from '@/components/SearchBar/SearchComponent';
import Loading from "@/components/Layout/Loader";
const TemplateList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { templates, loading, error, pageSize, totalRecords, currentPage } = useSelector((state) => state.templates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [templateId, settemplateId] = useState(0);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [filterText, setFilterText] = useState('');
  const [transactonType, setTransactonType] = useState(0);
  const settemplateId = useSetRecoilState(TemplateState);
  const templateColumns = [
    {
      name: "Template Name",
      selector: (row) => row.templateName,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Whatsapp Id",
      selector: (row) => row.templateId,
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
    { name: "Status ", selector: (row) => row.status, sortable: true },
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
    try {
      settemplateId(templates_Id);
      router.replace("/Templates/UpdateTemplate");
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
    await dispatch(fetchTemplates({
      clientId: localStorage.getItem("clientId"),
      TransactonType: transactonType,
      searchStr: filterText,
      pageNo: 1, pageSize: newSize
    }));
  };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(fetchTemplates({
      clientId: localStorage.getItem("clientId"),
      TransactonType: transactonType,
      searchStr: filterText,
      pageNo: page, pageSize
    }));
  };
  const refreshTemplateList = () => {
    dispatch(
      fetchTemplates({
        clientId: localStorage.getItem("clientId"),
        TransactonType: transactonType,
        searchStr: filterText,
        pageNo: currentPage, pageSize
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchTemplates({
        clientId: localStorage.getItem("clientId"),
        TransactonType: transactonType,
        searchStr: filterText,
        pageNo: currentPage, pageSize
      })
    );
    return () => {
      dispatch(clearTemplateState());
    };
  }, [dispatch]);

  const filteredSendernames = templates.filter((template) =>
    template.templateName.toLowerCase().includes(filterText.toLowerCase())
  );
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
        fetchTemplates({
          clientId: localStorage.getItem("clientId"),
          TransactonType: transactonType,
          searchStr: searchValue,
          pageNo: currentPage, pageSize
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
  const customPageSizes = [1 ,5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10
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
        </div>
      </div>
    );
  }, [filterText]);

  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  return (
    <App>
      <div className="flex items-center">
        {loading && <Loading />}
        <div className="mb-1">
          <h4 className="font-bold mb-2">Templates </h4>
        </div>
        <div className="ml-auto mb-2">
          <button
            className="uniform_btn"
            onClick={() => router.push("/Templates/CreateTemplate")}
          >
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
