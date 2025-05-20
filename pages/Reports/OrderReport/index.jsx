import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import {
  Modal,
  ModalHeader,
  ModalBody,
  
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderReport,
  clearOrderReportState,
  deleteOrderReport,
  fetchOrderReportById,
  updateOrderReport,
  setPageSize,
  setCurrentPage,
} from "@/slices/OrderReportSlice";
import showSweetAlert from "@/components/Sweetalert";
import Loading from "@/components/Layout/Loader";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import OrderReportForm from "../CreateOrderReport";
import App from "@/components/Layout/App";
import SearchBar from "@/components/SearchBar/SearchComponent";
import { usePermissions } from "@/context/PermissionsContext";

const OrderReportList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { orderReports, loading, error, pageSize, totalRecords, currentPage } =
    useSelector((state) => state.orderReports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [orderReportForm, setOrderReportForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const [CreateModalOpen, setCreateModalOpen] = useState(false);
  
  const { hasPermission } = usePermissions();
  
  const [isLoading, setIsLoading] = useState(false); // Start as true since we're fetching data
  const orderReportColumns = [
    { name: "OrderReport Id", selector: (row) => row.id, sortable: true },
    { name: "OrderReport Name", selector: (row) => row.orderReportName, sortable: true },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true },
    {
      name: "OrderReportDate",
      selector: (row) => row.createdDate,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="flex gap-2 w-full">
            <button
              title="Edit OrderReport"
              className="uniform_icon_btn"
            //   onClick={() => handleDetailClick(row.orderReportId)}
            >
              <HiPencilAlt style={{ fontSize: "15px" }} />
            </button>
            {hasPermission("OrderReports", "delete") && (
            <button
              title="Delete OrderReport"
              className="uniform_icon_btn"
            //   onClick={() => handleDeleteClick(row.orderReportId)}
            >
              <HiTrash style={{ fontSize: "15px" }} />
            </button>
            )}
          </div>
        </>
      ),
      style: {
        textAlign: "right", // Align the entire column content to the center
      },
    },
  ];

  const handleDetailClick = async (orderReportId) => {
    try {
      const response = await dispatch(fetchOrderReportById({ orderReportId })).unwrap();
      if (response) {
        setOrderReportForm(response.result);
        setIsModalOpen(true);
      } else {
        showSweetAlert({
          title: "Error",
          text: "Failed to fetch details",
          icon: "error",
        });
      }
    } catch (error) {
      alert("Failed to fetch orderReport details: " + error.message);
    }
  };
  const handleCancel = () => {
    setCreateModalOpen(false);
  };
  const handleDeleteClick = (orderReportId) => {
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
          dispatch(deleteOrderReport({ orderReportId })).then(() => {
            showSweetAlert({
              title: "Deleted Successfully",
              text: "",
              icon: "success",
            });
            refreshOrderReportList();
          });
        } catch (error) {
          alert("An unexpected error occurred: " + error.message);
        }
      }
    });
  };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(
      fetchOrderReport({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        pageNo: page,
      })
    );
  };

  const handlePageSizeChange = async (newSize) => {
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    // Fetch data with updated page size and reset to page 1
    await dispatch(
      fetchOrderReport({
        clientId: localStorage.getItem("clientId"),
        pageSize: newSize,
        pageNo: 1,
        SearchStr: filterText,
      })
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOrderReportForm({ ...orderReportForm, [name]: value });
  };
  const toggleModal = () => {
    setIsModalOpen(false);
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
        fetchOrderReport({
          clientId: localStorage.getItem("clientId"),
          pageSize,
          pageNo: currentPage,
          SearchStr: searchValue,
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const requestBody = {
        orderReportId: orderReportForm.orderReportId || 0,
        orderReportName: orderReportForm.orderReportName || "string",
        actionBy: localStorage.getItem("userId"),
        clientId: orderReportForm.clientId || 0,
      };

      const response = await dispatch(updateOrderReport(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: "Updated Successfully",
          text: "",
          icon: "success",
        });
        setIsLoading(false);
        setIsModalOpen(false);
        refreshOrderReportList();
      } else {
        showSweetAlert({
          title: "Error",
          text: response.message,
          icon: "error",
        });
      }
    } catch (error) {
      alert("Failed to update orderReport: " + error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const refreshOrderReportList = () => {
    dispatch(
      fetchOrderReport({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        pageNo: currentPage,
        SearchStr: filterText,
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchOrderReport({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        pageNo: currentPage,
        SearchStr: filterText,
      })
    );
    return () => {
      dispatch(clearOrderReportState());
    };
  }, [dispatch]);

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const filteredOrderReport = orderReports.filter(
    (orderReport) =>
      orderReport.orderReportName &&
      orderReport.orderReportName.toLowerCase().includes(filterText.toLowerCase())
  );
  const customPageSizes = [1, 5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10;
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
        </div>
      </div>
    );
  }, [filterText]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <App>
      <div className="flex items-center">
        {(loading || isLoading) && <Loading />}
        <div className="">
          <h4 className="font-bold">Order Reports </h4>
        </div>
        {/* {hasPermission("OrderReports", "create") && (
        <div className="ml-auto mb-1">
          <button className="uniform_btn" onClick={handleCreate}>
            Create OrderReport
          </button>
        </div>
        )} */}
      </div>
      <div className="overflow-auto">
        <DataTable
          data={filteredOrderReport}
          columns={orderReportColumns}
          highlightOnHover
          striped
          pagination
          paginationServer
          paginationTotalRows={totalRecords}
          sortIcon
          sortServer
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePageSizeChange}
          paginationPerPage={defultpagessize} // Default number of rows per page
          paginationRowsPerPageOptions={customPageSizes} // Custom page size options
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          className="w-full borderReport"
        />
      </div>

      {isModalOpen && (
        <Modal isOpen={true} toggle={() => toggleModal()} fade={false}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
              {/* Loader for update operation */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-50 ">
                  <Loading />
                </div>
              )}
              <ModalHeader toggle={() => toggleModal()}>Edit OrderReport</ModalHeader>
              <ModalBody>
                <form onSubmit={handleUpdateSubmit}>
                  <div className="flex flex-col">
                    <label
                      htmlFor="orderReportName"
                      className="font-medium text-gray-700 text-sm"
                    >
                      OrderReport Name
                    </label>
                    <input
                      type="text"
                      id="orderReportName"
                      name="orderReportName"
                      value={orderReportForm.orderReportName || ""}
                      onChange={handleFormChange}
                      className="borderReport rounded py-1 px-2 w-full mt-1 text-sm"
                      disabled={isLoading} // Disable input while loading
                    />
                  </div>
                  {hasPermission("OrderReports", "update") && (
                  <div className="mt-4 w-full flex justify-end">
                    <button
                      type="submit"
                      className="uniform_btn"
                      disabled={isLoading} // Disable button while loading
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

      {CreateModalOpen && (
        <OrderReportForm
          isVisible={true}
          onClose={handleCancel}
          onsuccess={refreshOrderReportList}
        />
      )}
    </App>
  );
};

export default OrderReportList;
