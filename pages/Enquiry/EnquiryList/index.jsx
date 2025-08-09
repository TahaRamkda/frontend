import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormEnquiry,
  Label,
  Input,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEnquiry,
  clearEnquiryState,
  setPageSize,
  setCurrentPage,
} from "@/slices/EnquirySlice";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import showSweetAlert from "@/components/Sweetalert";
import Loading from "@/components/Layout/Loader";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import App from "@/components/Layout/App";
import SearchBar from "@/components/SearchBar/SearchComponent";
import { usePermissions } from "@/context/PermissionsContext";
import DateTimePicker from "@/components/Timepicker/datetimepicker";
import { toast } from "react-toastify";
import EnquiryDropdown from "@/components/Dropdowns/InquiryDropdown";
import { from } from "form-data";
import { toDate } from "date-fns";
const EnquiryList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { enquiryList, loading, error, pageSize, totalRecords, currentPage } =
    useSelector((state) => state.enquiry);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [senderId, setSenderId] = useState(0);
  const [enquiryId, setEnquiryId] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const { hasPermission } = usePermissions();
  const [enquiryDetails, setEnquiryDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Start as true since we're fetching data
  const enquiryColumns = [
    {
      name: "Id",
      selector: (row) => row.submissionId,
      sortable: true,
    },
    {
      name: "Enquiry Name",
      selector: (row) => row.enquiryName,
      sortable: true,
      minWidth: "200px"
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Created Date",
      selector: (row) => row.createdDate,
      sortable: true,
      minWidth: "200px"
    },
    {
      name: "Status",
      selector: (row) => {
        if (row) {
          return row.status === 1
            ? "Completed"
            : row.status === 2
              ? "Pending"
              : "Canceled";
        }
        return "Canceled"; // fallback if row is undefined/null
      },
      sortable: true,
    }
    ,
    {
      name: "Submission Name",
      selector: (row) => row.submissionName,
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Enquiry Date",
      selector: (row) => row.enquiryCreatedDate,
      sortable: true,
      minWidth: "200px"
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="flex gap-2 w-full">
            <button
              title="Edit Enquiry"
              className="uniform_icon_btn"
              onClick={() => handleDetailClick(row)}
            >
              <HiPencilAlt style={{ fontSize: "15px" }} />
            </button>
          </div>
        </>
      ),
      style: {
        textAlign: "right", // Align the entire column content to the center
      },
    },
  ];

  const handleDetailClick = async (data) => {
    if (data) {
      const parsedData = JSON.parse(data.enquiryData)
      if (parsedData) {
        const filteredData = parsedData.map((item) => {
          return {
            ...item,
            TemplateName: item.TemplateName === item.Question ? "-" : item.TemplateName
          };
        });
         setEnquiryDetails(filteredData)
      setIsModalOpen(true)
      }
     
    }
  };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(
      fetchEnquiry({
        senderId: senderId,
        enquiryId: enquiryId,
        fromDate: FromDate,
        toDate: ToDate,
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
      fetchEnquiry({
        senderId: senderId,
        enquiryId: enquiryId,
        fromDate: FromDate,
        toDate: ToDate,
        pageSize: newSize,
        pageNo: 1,
      })
    );
  };
  const toggleModal = () => {
    setIsModalOpen(false);
  };

  const refreshEnquiryList = () => {
    dispatch(
      fetchEnquiry({
        senderId: senderId,
        enquiryId: enquiryId,
        pageSize,
        pageNo: currentPage,
        fromDate: FromDate,
        toDate: ToDate,
      })
    );
  };

  const handleEnquiryChange = (e) => {
    const enquiryId = e.target.value;
    setEnquiryId(enquiryId);
  };
  const handleChange = (e) => {
    const senderId = e.target.value;
    setSenderId(senderId);
  };
  useEffect(() => {
    dispatch(
      fetchEnquiry({
        senderId: senderId,
        enquiryId: enquiryId,
        fromDate: FromDate,
        toDate: ToDate,
        pageSize,
        pageNo: currentPage,
      })
    );
    return () => {
      dispatch(clearEnquiryState());
    };
  }, [dispatch, senderId, enquiryId, FromDate, ToDate]);
  const filteredEnquiry = enquiryList.filter(
    (enquiry) =>
      enquiry.enquiryName &&
      enquiry.enquiryName.toLowerCase().includes(filterText.toLowerCase())
  );
  const customPageSizes = [1, 5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10;
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col space-y-1 text-start mb-1 ">
            <label className="font-medium text-gray-700 text-sm">
              Sender Names
            </label>
            <SendernameDropdown
              name="senderId"
              value={senderId}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col space-y-1 text-start mb-1 ">
            <label className="font-medium text-gray-700 text-sm ">
              Enquiry
            </label>
            <EnquiryDropdown
              name="Enquiry"
              value={enquiryId}
              onChange={handleEnquiryChange}
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
              minDate={FromDate}
              onChange={setToDate}
            />
          </div>
        </div>
      </div>
    );
  }, [filterText, FromDate, ToDate, senderId, enquiryId]);

  return (
    <App>
      <div className="flex items-center">
        {loading && <Loading />}
        <div className="">
          <h4 className="font-bold">Enquiry</h4>
        </div>
      </div>
      <div className="overflow-auto">
        <DataTable
          data={filteredEnquiry}
          columns={enquiryColumns}
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

      {isModalOpen && (
        <Modal isOpen={true} toggle={() => toggleModal()} fade={false}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl  overflow-scroll">

              {/* Header */}
              <ModalHeader toggle={() => toggleModal()}>
                <h2 className="text-lg font-semibold">Enquiry Details</h2>
              </ModalHeader>

              {/* Body */}
              <ModalBody className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-md">
                    <thead>
                      <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                        <th className="py-2 px-4 border-b">Template ID</th>
                        <th className="py-2 px-4 border-b">Question</th>
                        <th className="py-2 px-4 border-b">Answer</th>
                        <th className="py-2 px-4 border-b">Template Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiryDetails?.map((enquiry, index) => (
                        <tr key={index} className="hover:bg-gray-50 text-sm">
                          <td className="py-2 px-4 border-b">
                            {enquiry.TemplateId || "-"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {enquiry.Question || "-"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {enquiry.Answer || "-"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {enquiry.TemplateName || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ModalBody>
            </div>
          </div>
        </Modal>

      )}
    </App>
  );
};

export default EnquiryList;
