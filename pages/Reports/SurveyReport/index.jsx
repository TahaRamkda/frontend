import { useState, useEffect, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { excelExportSurveyReport } from "@/slices/ExportExcel";
import App from "@/components/Layout/App";
import showSweetAlert from "@/components/Sweetalert";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import Loader from "@/components/Layout/Loader";
import FlowDropdown from "@/components/Dropdowns/FlowsDropdown";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import DateTimePicker from "@/components/Timepicker/datetimepicker";
import { Image } from "react-bootstrap";

const SurveyReportPage = () => {
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [senderId, setSenderId] = useState(0); // Added state for senderId
    const [flowId, setFlowId] = useState(0);
  const handleExportToExcel = () => {
    dispatch(excelExportSurveyReport({ fromDate: fromDate, toDate: toDate, senderId: senderId, flowId:flowId }));
  };

  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setSenderId(senderId);
  };
  const handleFlowChange = (e) => {
    const flowId = e.target.value;
    setFlowId(flowId);
  };

  
  const renderMediaPreview = (mediaPath, mimeType) => {
    const previewStyle =
      "w-full popup_img_container overflow-hidden flex justify-center items-center rounded-lg bg-gray-100";

    if (mimeType.startsWith("image/")) {
      return (
        <Image
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
     <div className=" inset-0 flex items-center justify-center z-50">
  <div className="bg-white p-6 rounded-lg shadow-lg w-2/5 border border-gray-200">
    <div className="p-4 border-b border-gray-200">
      <h4 className="font-bold text-lg text-gray-800">Survey Report</h4>
    </div>

    <form className="p-4 space-y-6">
      {/* Sender Name Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Sender Name
        </label>
        <SendernameDropdown
          name="senderId"
          value={senderId}
          onChange={handleSenderChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
        />
      </div>

      {/* Flow Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Flow
        </label>
        <FlowDropdown
          name="flowId"
          value={ flowId}
          onChange={handleFlowChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
        />
      </div>

      {/* From Date */}
      <div className="space-y-2">
        
        <DateTimePicker
          label="From Date"
          value={fromDate}
          onChange={setFromDate}
          className="w-full  border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
        />
      </div>

      {/* To Date */}
      <div className="space-y-2">
        
        <DateTimePicker
          label="To Date"
          value={toDate}
          minDate={fromDate}
          onChange={setToDate}
          className="w-full  border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
        />
      </div>

      {/* Export Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={handleExportToExcel}
          className="uniform_btn"
        >
          Export to Excel
        </button>
      </div>
    </form>
  </div>
</div>
     
    </App>
  );
};

export default SurveyReportPage;
