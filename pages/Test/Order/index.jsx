import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrder,
  fetchOrderById,
  clearOrderDetailState,
  clearOrderState,
  setCurrentPage,
  setPageSize,
} from "@/slices/OrderSlice";
import showSweetAlert from "@/components/Sweetalert";
import Loading from "@/components/Layout/Loader";
// import OrderDetailsModal from "../OrderDetails";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import App from "@/components/Layout/App";
import SearchBar from "@/components/SearchBar/SearchComponent";
import { usePermissions } from "@/context/PermissionsContext";

const OrderList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { ordersList, loading, error, pageSize, totalRecords, currentPage } =
    useSelector((state) => state.orders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [orderDetailData, setOrderDetailData] = useState({});
  const [filterText, setFilterText] = useState("");

  const { hasPermission } = usePermissions();

  const [isLoading, setIsLoading] = useState(false); // Start as true since we're fetching data
  const orderColumns = [
    { name: "Order Id", selector: (row) => row.orderId, sortable: true },
    { name: "Order Name", selector: (row) => row.name, sortable: true },
    { name: "Order Date", selector: (row) => row.orderDate, sortable: true },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "Status Name",
      selector: (row) => row.statusName,
      sortable: true,
    },
    {
      name: "subtotal",
      selector: (row) => row.subtotal,
      sortable: true,
    },
    {
      name: "deliveryCharges",
      selector: (row) => row.deliveryCharges,
      sortable: true,
    },
    {
      name: "discount",
      selector: (row) => row.discount,
      sortable: true,
    },
    {
      name: "total",
      selector: (row) => row.total,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="flex gap-2 w-full">
            <button
              title="Edit Order"
              className="uniform_icon_btn"
              onClick={() => handleDetailClick(row.orderId)}
            >
              <HiPencilAlt style={{ fontSize: "15px" }} />
            </button>
            {hasPermission("Order", "delete") && (
              <button
                title="Delete Order"
                className="uniform_icon_btn"
                //   onClick={() => handleDeleteClick(row.orderId)}
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

  const handleDetailClick = async (orderId) => {
    try {
      const response = await dispatch(fetchOrderById({ orderId })).unwrap();
      
      if (response) {
        setOrderDetailData(response);
        setIsModalOpen(true);
      } else {
        showSweetAlert({
          title: "Error",
          text: "Failed to fetch details",
          icon: "error",
        });
      }
    } catch (error) {
      alert("Failed to fetch order details: " + error.message);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //   const handleDeleteClick = (orderId) => {
  //     SweetAlert.fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it!",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         try {
  //           dispatch(deleteOrder({ orderId })).then(() => {
  //             showSweetAlert({
  //               title: "Deleted Successfully",
  //               text: "",
  //               icon: "success",
  //             });
  //             refreshOrderList();
  //           });
  //         } catch (error) {
  //           alert("An unexpected error occurred: " + error.message);
  //         }
  //       }
  //     });
  //   };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(
      fetchOrder({
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
      fetchOrder({
        clientId: localStorage.getItem("clientId"),
        pageSize: newSize,
        pageNo: 1,
        SearchStr: filterText,
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
        fetchOrder({
          clientId: localStorage.getItem("clientId"),
          pageSize,
          pageNo: currentPage,
          SearchStr: searchValue,
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };

  const refreshOrderList = () => {
    dispatch(
      fetchOrder({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        pageNo: currentPage,
        SearchStr: filterText,
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchOrder({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        pageNo: currentPage,
        SearchStr: filterText,
      })
    );
    return () => {
      dispatch(clearOrderState());
    };
  }, [dispatch]);

  const filteredOrder = ordersList.filter(
    (order) =>
      order.orderName &&
      order.orderName.toLowerCase().includes(filterText.toLowerCase())
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

  return (
    <App>
      <div className="flex items-center">
        {(loading || isLoading) && <Loading />}
        <div className="">
          <h4 className="font-bold">Order </h4>
        </div>
        {/* {hasPermission("Order", "create") && (
        <div className="ml-auto mb-1">
          <button className="uniform_btn" onClick={handleCreate}>
            Create Order
          </button>
        </div>
        )} */}
      </div>
      <div className="overflow-auto">
        <DataTable
          data={ordersList}
          columns={orderColumns}
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
          className="w-full border"
        />
      </div>

      {/* {isModalOpen && (
        <OrderDetailsModal
          isVisible={true}
          toggle={handleCancel}
          isOpen={isModalOpen}
          Data={orderDetailData}
          onsuccess={refreshOrderList}
        />
      )} */}
    </App>
  );
};

export default OrderList;
