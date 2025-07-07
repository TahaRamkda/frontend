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
import App from "@/components/Layout/App";
import Loader from "@/components/Layout/Loader";
import TemplateDropdown from "@/components/Dropdowns/TemplateDropdown";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import {
  fetchTemplateInsight,
  clearTemplateInsightState,
} from "@/slices/ReportSlice";
import DateTimePicker from "@/components/Timepicker/datetimepicker";
import {
  FaPaperPlane,
  FaCheckCircle,
  FaEye,
  FaReply,
  FaDollarSign,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const performanceCards = [
  {
    label: "Messages Sent",
    icon: <FaPaperPlane className="text-indigo-500 text-2xl" />,
    key: "totalSent",
    color: "bg-indigo-50",
    valueClass: "text-indigo-700",
  },
  {
    label: "Messages Delivered",
    icon: <FaCheckCircle className="text-yellow-500 text-2xl" />,
    key: "totalDelivered",
    color: "bg-yellow-50",
    valueClass: "text-yellow-700",
  },
  {
    label: "Messages Read",
    icon: <FaEye className="text-green-500 text-2xl" />,
    key: "totalRead",
    color: "bg-green-50",
    valueClass: "text-green-700",
  },
];

const TemplateInsight = () => {
  const [fromDate, setFromDate] = useState("");
  const dispatch = useDispatch();
  const [toDate, setToDate] = useState("");
  const [templateId, setTemplateId] = useState(0);
  const [templateData, setTemplaterData] = useState([]);
  const [sendernameId, setsendernameId] = useState(null);
  const { templateInsight, loading, error } = useSelector(
    (state) => state.reports
  );
  const [parseData, setParseData] = useState([]);
  const handleChange = (e) => {
    setsendernameId(e.target.value);
  };
  useEffect(() => {
    if (templateInsight) {
      console.log("Raw templateInsight:", templateInsight);

      // Set the template data
      setTemplaterData(templateInsight);

      // Parse the details safely
      try {
        const rawDetails = templateInsight[0].details;
        const parsedDetails =
          typeof rawDetails === "string"
            ? JSON.parse(rawDetails || "[]")
            : rawDetails || [];
        setParseData(parsedDetails);
        console.log("Parsed details:", parsedDetails);
      } catch (error) {
        console.error("Error parsing templateInsight.details:", error);
      }
    }
  }, [templateInsight]);
  useEffect(() => {
    // Clear state when filters change
    setTemplaterData([]);
    setParseData([]);
    dispatch(clearTemplateInsightState());
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

  const handleTemplateChange = (e) => {
    setTemplateId(e.target.value);
  };

  useEffect(() => {
    if (fromDate && toDate && templateId) {
      localStorage.setItem("activeModule", "0");
      const clientId = localStorage.getItem("clientId");
      dispatch(
        fetchTemplateInsight({
          clientId,
          fromDate,
          toDate,
          TemplateId: templateId,
          senderId: sendernameId,
        })
      );
    }
    return () => {
      clearTemplateInsightState();
    };
  }, [dispatch, fromDate, toDate, templateId, sendernameId]);

  const totalSent = templateData.reduce((sum, item) => sum + item.sentCount, 0);
  const totalDelivered = templateData?.reduce(
    (sum, item) => sum + item.deliveredCount,
    0
  );
  const totalRead = templateData?.reduce(
    (sum, item) => sum + item.readCount,
    0
  );

  const performanceValues = {
    totalSent,
    totalDelivered,
    totalRead,
  };

  const lineChartData = {
    labels:
      Array.isArray(templateData) &&
      templateData?.map((item) => item.recordDate),
    datasets: [
      {
        label: "Messages Sent",
        data:
          Array.isArray(templateData) &&
          templateData?.map((item) => item.sentCount),
        borderColor: "#FF6384", // Red/Pink
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Messages Delivered",
        data:
          Array.isArray(templateData) &&
          templateData?.map((item) => item.deliveredCount),
        borderColor: "black", // Blue
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Messages Read",
        data:
          Array.isArray(templateData) &&
          templateData?.map((item) => item.readCount),
        borderColor: "green", // Teal
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <App>
      {/* Filters */}
      {loading && <Loader />}
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
           {sendernameId && (
            <div className="flex-1">
              <label className="text-[11px] font-semibold text-gray-700">
                Template
              </label>
              <TemplateDropdown
                value={templateId}
                onChange={handleTemplateChange}
                SenderId={sendernameId}
              />
            </div>
          )}
        </div>
      </div>
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        {/* Performance Summary */}

        {/* Line Chart */}
        <div className="bg-white border border-gray-200 p-3 rounded shadow-sm mb-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-gray-800">
              Performance
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
            {performanceCards.map((card) => (
              <div
                key={card.label}
                className="flex flex-col items-start justify-center p-1"
              >
                <div className="text-xs text-gray-500 font-medium mt-1">
                  {card.label}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {performanceValues[card.key]}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white  rounded ">
            <div className="chart-dashboard" style={{ height: "400px" }}>
              <Line
                data={lineChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }, // Hide default legend
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 20 },
                      title: { display: true, text: "Messages" },
                    },
                    x: {
                      title: { display: true, text: "Date" },
                    },
                  },
                }}
              />
            </div>

            {/* Custom Legend */}
            <div className="flex justify-center gap-32 mt-1 text-sm">
              <div className="flex items-center gap-2 ">
                <span
                  className="w-4 h-1 rounded-sm"
                  style={{
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    border: "2px solid rgb(255, 99, 132)",
                  }}
                ></span>
                <span>Messages Sent</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-1 rounded-sm"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    border: "2px solid black",
                  }}
                ></span>
                <span>Messages Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-1 rounded-sm"
                  style={{
                    backgroundColor: "rgba(0, 128, 0, 0.2)",
                    border: "2px solid green",
                  }}
                ></span>
                <span>Messages Read</span>
              </div>
            </div>
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
