import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversationAnalytics,
  cleaConversationAnalyticsState,
  setCurrentPage,
  setPageSize,
} from "@/slices/ConversationAnalyticsSlice";
import showSweetAlert from "@/components/Sweetalert";
import Loading from "@/components/Layout/Loader";
import App from "@/components/Layout/App";
import DateTimePicker from "@/components/Timepicker/datetimepicker";
import SearchBar from "@/components/SearchBar/SearchComponent";
import { usePermissions } from "@/context/PermissionsContext";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
const ConversationAnalyticsList = () => {
  const router = useRouter();
  const fromDateRef = useRef("");
  const toDateRef = useRef("");
  const dispatch = useDispatch();
  const [searchTimeout, setSearchTimeout] = useState(null);
  const {
    conversationAnalyticList,
    loading,
    error,
    currentPage,
    pageSize,
    totalRecords,
  } = useSelector((state) => state.conversationAnalytic);
  const [fromDate, setfromDate] = useState("");
  const [SenderId, setSenderId] = useState(0);
  const [toDate, settoDate] = useState("");
  const [filterText, setFilterText] = useState("");
  const { hasPermission } = usePermissions();
  const conversationColumns = [
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.startUtc,
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.endUtc,
      sortable: true,
    },
    {
      name: "Conversation Type",
      selector: (row) => row.conversationType,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Conversation Count",
      selector: (row) => row.conversationCount,
      sortable: true,
    },
    {
      name: "Cost",
      selector: (row) => row.cost,
      sortable: true,
    },
  ];

  const handlePageChange = async (page) => {
    dispatch(setCurrentPage(page));
  };

  const handlePageSizeChange = async (newSize) => {
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1));
  };
  useEffect(() => {
    dispatch(
      fetchConversationAnalytics({
        clientId: localStorage.getItem("clientId"),
        pageSize,
        pageNo: currentPage,
        fromDate: fromDate,
        toDate: toDate,
        senderId: SenderId,
      })
    );
    return () => {
      dispatch(cleaConversationAnalyticsState());
    };
  }, [dispatch]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        fetchConversationAnalytics({
          clientId: localStorage.getItem("clientId"),
          fromDate: fromDate,
          toDate: toDate,
          senderId: SenderId,
          pageNo: currentPage,
          pageSize,
        })
      );
    }, 500); // debounce for search input

    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [dispatch, filterText, SenderId, currentPage, pageSize, fromDate, toDate]);
  const handlefromDateChange = (setter) => (e) => {
    fromDateRef.current = e;
    setter(e);
  };
  const handletoDateChange = (setter) => (e) => {
    toDateRef.current = e;
    setter(e);
  };
  const handleChange = (e) => {
    const senderId = e.target.value;
    setSenderId(senderId);
  };
  const customPageSizes = [1, 5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10;
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 mb-4 gap-4">
          <div className="flex flex-col space-y-1 text-start mb-1">
            <DateTimePicker
              label="From Date"
              value={fromDate}
              onChange={handlefromDateChange(setfromDate)}
            />
          </div>

          <div className="flex flex-col space-y-1 text-start mb-1 ">
            <DateTimePicker
              label="To Date"
              value={toDate}
              minDate={fromDate}
              onChange={handletoDateChange(settoDate)}
            />
          </div>
          <div className="flex flex-col mb-1 text-start">
            <label className="font-medium text-gray-700 text-sm mb-1">
              Sender Names
            </label>
            <SendernameDropdown
              name="senderId"
              value={SenderId}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    );
  }, [fromDate, toDate, SenderId]);

  return (
    <App>
      <div className="flex items-center">
        {loading && <Loading />}
        <div className="">
          <h4 className="font-bold">Conversation Analytics </h4>
        </div>
      </div>
      <div className="overflow-auto">
        <DataTable
          data={conversationAnalyticList}
          columns={conversationColumns}
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
    </App>
  );
};

export default ConversationAnalyticsList;
