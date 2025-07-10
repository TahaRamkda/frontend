import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import App from "@/components/Layout/App";
import Loader from "@/components/Layout/Loader";
import TemplatesDropdown from "@/components/MultiSelect/TemplateDropdown";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import {
  fetchTemplateInsightDetails,
  clearTemplateInsighDetailstState,
} from "@/slices/ReportSlice";
import { excelExportTemplateAnalyticReport } from "@/slices/ExportExcel";
import DateTimePicker from "@/components/Timepicker/datetimepicker";

const TemplateInsight = () => {
  const [fromDate, setFromDate] = useState("");
  const dispatch = useDispatch();
  const [toDate, setToDate] = useState("");
  const [templateId, setTemplateId] = useState([]);
  const [templateData, setTemplaterData] = useState([]);
  const [sendernameId, setsendernameId] = useState(0);
  const { templateInsightDetails, loading, error } = useSelector(
    (state) => state.reports
  );
  const [parseData, setParseData] = useState([]);
  const handleChange = (e) => {
    setsendernameId(e.target.value);
  };
  useEffect(() => {
    if (templateInsightDetails) {
      console.log("Raw templateInsightDetails:", templateInsightDetails);

      // Set the template data
      setTemplaterData(templateInsightDetails);

      // Parse the details safely
      try {
        const rawDetails = templateInsightDetails[0].buttonDetails;
        const parsedDetails =
          typeof rawDetails === "string"
            ? JSON.parse(rawDetails || "[]")
            : rawDetails || [];
        setParseData(parsedDetails);
        console.log("Parsed details:", parsedDetails);
      } catch (error) {
        console.error("Error parsing templateInsightDetails.details:", error);
      }
    }
  }, [templateInsightDetails]);
  useEffect(() => {
    // Clear state when filters change
    setTemplaterData([]);
    setParseData([]);
    dispatch(clearTemplateInsighDetailstState());
  }, [templateId, fromDate, toDate, sendernameId]);
  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    // Fix: convert to string format accepted by <input type="date" />
    setToDate(today.toISOString().split("T")[0]);
    setFromDate(lastWeek.toISOString().split("T")[0]);
  }, []);

  const handleDateChange = (setter) => (e) => {
    setter(e);
  };

  const handleTemplateChange = (selectedOptions) => {
    if (Array.isArray(selectedOptions)) {
      const values = selectedOptions.map((option) => option.value); // Extract values
      setTemplateId(values.join(",")); // Join as a comma-separated string
    } else {
      setTemplateId(""); // Reset if no selection
    }
  };
   const handleExportToExcel = () => {
    dispatch(excelExportTemplateAnalyticReport({ senderId:sendernameId, templateId: templateId ,startDate: fromDate, endDate: toDate}));
  };
  
  useEffect(() => {
    localStorage.setItem("activeModule", "0");
    const clientId = localStorage.getItem("clientId");
    dispatch(
      fetchTemplateInsightDetails({
        clientId,
        fromDate,
        toDate,
        TemplateId: templateId,
        senderId: sendernameId,
      })
    );
    return () => {
      clearTemplateInsighDetailstState();
    };
  }, [dispatch, fromDate, toDate, templateId, sendernameId]);

  return (
    <App>
      {/* Filters */}
      {loading && <Loader />}
      <div className="flex items-center">
        <div >
          <h4 className="font-bold ">Template Insight </h4>
        </div>
        <div className="ml-auto mb-1">
          <button className="uniform_btn" 
          onClick={handleExportToExcel}
          >
            Export Report
          </button>
        
        </div>
      </div>
      <div className="mb-3">
        <div className="bg-white  rounded p-2 flex flex-col md:flex-row gap-2 items-stretch">
          <div className="flex-1">
            <label className="text-[11px] font-semibold text-gray-700">
              From Date
            </label>
            <DateTimePicker
              value={fromDate}
              onChange={handleDateChange(setFromDate)}
            />
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-semibold text-gray-700">
              To Date
            </label>
            <DateTimePicker
              value={toDate}
              onChange={handleDateChange(setToDate)}
              minDate={fromDate}
            />
          </div>

          <div className="flex-1">
            <label className="text-[11px] font-semibold text-gray-700">
              SenderName
            </label>
            <SendernameDropdown
              name="senderId"
              value={sendernameId}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-semibold text-gray-700">
              Template
            </label>
            <TemplatesDropdown
              value={templateId}
              onChange={handleTemplateChange}
              SenderId={sendernameId}
            />
          </div>
        </div>
      </div>
      <div className="w-full  bg-gray-50">
        {/* Performance Summary */}

        <div className="bg-white border w-full border-gray-200 p-2 rounded shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800">
              Performance
            </h3>
          </div>

          <div >
            {templateData.map((item, index) => (
              <div >
              <div
                key={index}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4"
              >
                <div className="  rounded ">
                  <div className="text-lg text-gray-500 font-medium">
                    Sent Count
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {item.sentCount}
                  </div>
                </div>
                <div className="rounded ">
                  <div className="text-lg text-gray-500 font-medium">
                    Delivered Count
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {item.deliveredCount}
                  </div>
                </div>
                <div className=" rounded ">
                  <div className="text-lg text-gray-500 font-medium">
                    Read Count
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {item.readCount}
                  </div>
                </div>
                <div className=" rounded ">
                  <div className="text-lg text-gray-500 font-medium">
                    Failed Count
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {item.failedCount}
                  </div>
                </div>
              </div>
              </div>
            ))}
          </div>
        </div>

        {/* Button Clicks Table */}
        <div className="rounded-md border border-gray-200 shadow-sm bg-white">
          <div className="flex items-center justify-between px-2  border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
              Button clicks
            </h3>
          </div>

          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-2  font-medium">Template Name</th>
                <th className="px-2  font-medium">Label</th>
                <th className="px-2 font-medium">Type</th>
                <th className="px-2 font-medium">Total clicks </th>
              </tr>
            </thead>
            <tbody>
              {parseData?.map((btn, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 border-b border-gray-100"
                >
                  <td className="px-2 text-gray-800">{btn.TemplateName}</td>
                  <td className="px-2 text-gray-800">{btn.ButtonText}</td>
                  <td className="px-2 text-gray-600">{btn.ButtonType}</td>
                  <td className="px-2 text-gray-800">{btn.ClickCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </App>
  );
};

export default TemplateInsight;
