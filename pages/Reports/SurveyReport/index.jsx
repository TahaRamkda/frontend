import { useState, useEffect, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { excelExportSurveyReport } from "@/slices/ExportExcel";
import App from "@/components/Layout/App";
import showSweetAlert from "@/components/Sweetalert";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import Loader from "@/components/Layout/Loader";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import DateTimePicker from "@/components/Timepicker/datetimepicker";

const SurveyReportPage = () => {
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [senderId, setSenderId] = useState(""); // Added state for senderId

  const handleExportToExcel = () => {
    dispatch(excelExportSurveyReport({ fromDate: fromDate, toDate: toDate }));
  };

  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setSenderId(senderId);
  };

  const refreshList = () => {
    dispatch(
      fetchMedia({
        ClientId: localStorage.getItem("clientId"),
        senderId: senderId,
      })
    );
  };

  const renderMediaPreview = (mediaPath, mimeType) => {
    const previewStyle =
      "w-full popup_img_container overflow-hidden flex justify-center items-center rounded-lg bg-gray-100";

    if (mimeType.startsWith("image/")) {
      return (
        <img
          src={`${BASE_URL}${mediaPath}`}
          alt="Image"
          className="w-full h-full object-cover rounded-lg"
        />
      );
    } else if (mimeType.startsWith("video/")) {
      return (
        <video controls className="w-full h-full object-cover">
          <source src={`${BASE_URL}${mediaPath}`} type={mimeType} />
        </video>
      );
    } else {
      return <p>Preview not available for this file type.</p>;
    }
  };

  return (
    <App>
      <div className=" w-1/3 ">
        <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="p-2">
          <h4 className="font-bold ">Survey Report</h4>
        </div>

          <div className="space-y-4">
            {/* Sender Name Dropdown */}
            <div className="p-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender Name
              </label>
              <SendernameDropdown
                name="senderId"
                onChange={handleSenderChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            {/* From Date */}
            <div>
              <DateTimePicker
                label="From Date"
                value={fromDate}
                onChange={setFromDate}
                className="w-full p-2  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* To Date */}
            <div>
              <DateTimePicker
                label="To Date"
                value={toDate}
                minDate={fromDate}
                onChange={setToDate}
                className="w-full p-2  rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Export Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleExportToExcel}
                className="uniform_btn"
              >
                Export to Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </App>
  );
};

export default SurveyReportPage;
