import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import Loading from "@/components/Layout/Loader";
import {
  fetchSendernames,
  clearSendernameState,
  updateSendername,
} from "@/slices/sendernameSlice";
import showSweetAlert from "@/components/Sweetalert";
import App from "@/components/Layout/App";
import SenderNameForm from "../CreateSenderName";
import { BASE_URL } from "@/utils/apiConstants";
import { selector } from "recoil";

const SendernameList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendernames, loading, error } = useSelector(
    (state) => state.sendernames
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendernameForm, setSendernameForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const [CreateModalOPen, setCreateModalOpen] = useState(false);

  const sendernameColumns = [
    {
      name: "Sender Name",
      selector: (row) => row.mediaPath, // Assuming mediaPath is the field in your data
      cell: (row) => (
        <div className="flex flex-row items-center gap-2 text-center">
          
          <img
            src={`${BASE_URL}${row.mediaPath}`}
            alt="Image"
            className="w-8 h-8 object-cover rounded-lg"
          />
          <div className="flex items-center">
            <span className="m-1">{row.senderName}</span>
            <span>{row.verified && ( // Check if verified is true and render the image
            <img
              src="\images\wVarified.png"
              alt="Verified"
              className="w-4 h-4 object-contain mt-1" // Adjust size as needed
            />
          )}</span>
          </div>
          
        </div>
      ),
      sortable: false, // Disable sorting for images if not needed
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    { name: "Limit", selector: (row) => row.limit, sortable: true },
    { name: "Quality", selector: (row) => row.quality, sortable: true },

  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSendernameForm({ ...sendernameForm, [name]: value });
  };



  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        senderId: sendernameForm.senderId || 0,
        clientId: sendernameForm.clientId || 0,
        senderName: sendernameForm.senderName || "string",
        phoneNumber: sendernameForm.phoneNumber || "string",
        phoneId: sendernameForm.phoneId || "string",
        appId: sendernameForm.appId || "string",
        limit: sendernameForm.limit || 0,
        quality: sendernameForm.quality || 0,
        actionBy: 1,
      };

      const response = await dispatch(updateSendername(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: "Updated Successfully",
          text: "",
          icon: "success",
        });
        setIsModalOpen(false);
        refreshSendernameList();
      } else {
        showSweetAlert({
          title: "Error",
          text: response.message,
          icon: "error",
        });
      }
    } catch (error) {
      showSweetAlert({ title: "Error", text: error.message, icon: "error" });
    }
  };

  const refreshSendernameList = () => {
    dispatch(fetchSendernames({ client_Id: localStorage.getItem("clientId") }));
  };

  useEffect(() => {
    dispatch(fetchSendernames({ client_Id: localStorage.getItem("clientId") }));
    return () => {
      dispatch(clearSendernameState());
    };
  }, [dispatch]);

  const filteredSendernames = sendernames.filter((sender) =>
    sender.senderName.toLowerCase().includes(filterText.toLowerCase())
  );
  const customPageSizes = [1 ,5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col space-y-1 text-start mb-1">
            <label className="font-medium text-gray-700 text-sm ">
              Search{" "}
            </label>
            <input
              type="search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="border rounded"
            //  placeholder=" "
            />
          </div>
        </div>
      </div>
    );
  }, [filterText]);

  if (error) {
    return <div className="text-red-500 p-4 bg-red-100 rounded">{error}</div>;
  }

  return (
    <App>
      <div className="flex items-center">
        {loading && <Loading />}
        <div className=''>
          <h4 className="font-bold ">Sender Name</h4>
        </div>
        <div className="ml-auto mb-1">

        </div>
      </div>

      <div className="overflow-auto">
        <DataTable
          data={filteredSendernames}
          columns={sendernameColumns}
          highlightOnHover
          striped
          pagination
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          paginationPerPage={defultpagessize} // Default number of rows per page
          paginationRowsPerPageOptions={customPageSizes} // Custom page size options
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h4 className="text-xl mb-4">Edit Sender</h4>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="font-medium text-gray-700 text-sm">
                  Sender Name
                </label>
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  value={sendernameForm.senderName || ""}
                  onChange={handleFormChange}
                  className="border rounded py-1 px-2 w-full mt-1 text-sm"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 text-sm">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={sendernameForm.phoneNumber || ""}
                  onChange={handleFormChange}
                  className="border rounded py-1 px-2 w-full mt-1 text-sm"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 text-sm">
                  Limit
                </label>
                <input
                  type="number"
                  id="limit"
                  name="limit"
                  value={sendernameForm.limit || ""}
                  onChange={handleFormChange}
                  className="border rounded py-1 px-2 w-full mt-1 text-sm"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 text-sm">
                  Quality
                </label>
                <input
                  type="text"
                  id="quality"
                  name="quality"
                  value={sendernameForm.quality || ""}
                  onChange={handleFormChange}
                  className="border rounded py-1 px-2 w-full mt-1 text-sm"
                />
              </div>

              <div className="flex w-full justify-end">
                <button type="submit" className="uniform_btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {CreateModalOPen && (
        <SenderNameForm
          isVisible={true}
          onClose={handleCancel}
          onsuccess={refreshSendernameList}
        />
      )}
    </App>
  );
};

export default SendernameList;
