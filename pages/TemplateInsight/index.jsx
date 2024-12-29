import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import App from "@/components/App";
import {
  fetchTemplateInsight,
  clearTemplateInsightState,
} from "@/slices/ReportSlice";
import TemplateDropdown from "@/components/Dropdowns/TemplateDropdown";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TemplateInsight = () => {
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [TemplateId, setTemplateId] = useState("");
  const { templateInsight, loading, error } = useSelector(
    (state) => state.reports
  );

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    setToDate(today.toISOString().split("T")[0]);
    setFromDate(lastWeek.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (fromDate && toDate && TemplateId) {
      localStorage.setItem("activeModule", "0");
      const clientId = localStorage.getItem("clientId");
      dispatch(
        fetchTemplateInsight({
          clientId,
          fromDate,
          toDate,
          TemplateId: TemplateId,
        })
      );
    }
    return () => {
      clearTemplateInsightState();
    };
  }, [dispatch, fromDate, toDate, TemplateId]);

  const handleDateChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const lineChartData = {
    labels:
      templateInsight?.TotalMessagesChart?.map((item) => item.CreatedDate) ||
      [],
    datasets: [
      {
        label: "Total Messages Sent",
        data:
          templateInsight?.TotalMessagesChart?.map((item) => item.SentCount) ||
          [],
        borderColor: "#7e3af2",
        backgroundColor: "rgba(126, 58, 242, 0.2)",
        fill: true,
      },
      {
        label: "Total Delivered",
        data:
          templateInsight?.TotalMessagesChart?.map(
            (item) => item.DeliveredCount
          ) || [],
        borderColor: "#ffc107",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        fill: true,
      },
      {
        label: "Total Read",
        data:
          templateInsight?.TotalMessagesChart?.map((item) => item.ReadCount) ||
          [],
        borderColor: "#28a745",
        backgroundColor: "rgba(255, 193, 7, 0.2)",
        fill: true,
      },
    ],
  };
  const handleTemplateChange = (e) => {
    setTemplateId(e.target.value);
  };

  return (
    <App>
      <div className="container p-4">
        {/* Date Filters */}
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold">From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={handleDateChange(setFromDate)}
              className="border rounded p-1"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={handleDateChange(setToDate)}
              className="border rounded p-1"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold"> Template</label>
            <TemplateDropdown
              name="role_Id"
              onChange={handleTemplateChange}
              className="border rounded m-0 mb-0 w-100"
            />
          </div>
        </div>
        <div className="mt-8 bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">
            Total Messages Chart
          </h3>
          <div style={{ height: "400px" }}>
            <Line
              data={lineChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        {/* Tiles */}
        <div className="grid grid-cols-4 gap-4">
          {templateInsight?.TemplateResponses?.map((tile, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className="text-lg font-semibold">{tile.Title}</h3>
              <p className="text-lg font-semibold">Sent: {tile.ResponseText}</p>
              <p className="text-lg font-semibold">
                Delivered: {tile.DeliveredCount}
              </p>
              <p className="text-lg font-semibold">Read: {tile.ReadCount}</p>
            </div>
          ))}

          {templateInsight?.MarketingMessages?.map((tile, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className="text-lg font-semibold">{tile.Title}</h3>
              <p className="text-lg font-semibold">Sent: {tile.SentCount}</p>
              <p className="text-lg font-semibold">
                Delivered: {tile.DeliveredCount}
              </p>
              <p className="text-lg font-semibold">Read: {tile.ReadCount}</p>
            </div>
          ))}

          {templateInsight?.TotalConversations?.map((tile, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className="text-lg font-semibold">{tile.Title}</h3>
              <p className="text-lg font-semibold">
                Conversations: {tile.TotalConversation}
              </p>
              <p className="text-lg font-semibold">
                Total Messages: {tile.TotalMessages}
              </p>
            </div>
          ))}
        </div>

        {/* Line Chart */}
      </div>
    </App>
  );
};

export default TemplateInsight;
