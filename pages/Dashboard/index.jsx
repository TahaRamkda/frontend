import { useState, useEffect, useRef } from "react";
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
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import {
  fetchDashboardSummary,
  clearDashboardReportState,
} from "@/slices/ReportSlice";

import Loader from "@/components/Layout/Loader";
import { set } from "date-fns";
import { toast } from "react-toastify";
import { REFRESH_INTERVAL } from "@/utils/constants";
import DateTimePicker from "@/components/Timepicker/datetimepicker";
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

const Dashboard = () => {
  const dispatch = useDispatch();
  const [dataloading, setdataloading] = useState(false);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [SenderId, setSenderId] = useState(0);
  const [clientId, setclientId] = useState(0);
  const { dashboardsummary, loading, error } = useSelector(
    (state) => state.reports
  );
  //const clientId = localStorage.getItem("clientId");
  const fromDateRef = useRef("");
  const toDateRef = useRef("");
  const isLiveReporting = useRef(false); // UseRef to track live reporting state
  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    settoDate(today.toISOString().split("T")[0]);
    setfromDate(lastWeek.toISOString().split("T")[0]);

    const todayStr = today.toISOString().split("T")[0];
    const lastWeekStr = lastWeek.toISOString().split("T")[0];

    fromDateRef.current = lastWeekStr;
    toDateRef.current = todayStr;
  }, []);

  useEffect(() => {
    if (dashboardsummary) {
      setdataloading(false);
    }
  }, [dashboardsummary]);

  //function for live reporting
  useEffect(() => {
    const checkAndFetch = async () => {
      const isLiveReporting = JSON.parse(
        localStorage.getItem("isLiveReporting")
      );
      const fromDate = fromDateRef.current;
      const toDate = toDateRef.current;
      if (isLiveReporting && !loading) {
        try {
          await dispatch(
            fetchDashboardSummary({
              clientId: localStorage.getItem("clientId"),
              fromDate: fromDate,
              toDate: toDate,
              senderid: SenderId,
            })
          );
        } catch (error) {
          console.error("Error fetching chat monitor:", error);
        }
      }
    };

    const intervalId = setInterval(() => {
      // Perform the periodic refresh (e.g., every 5 minutes) if page is loaded
      if (!loading) {
        checkAndFetch();
      }
    }, REFRESH_INTERVAL);

    // Cleanup interval on component unmount or when page is unloaded
    return () => clearInterval(intervalId);
  }, [dispatch, SenderId]);

  useEffect(() => {
    if (fromDate && toDate) {
      const clientId = localStorage.getItem("clientId");
      setdataloading(true);
      dispatch(
        fetchDashboardSummary({
          clientId: clientId,
          fromDate,
          toDate,
          senderid: SenderId,
        })
      );
    }
    return () => {
      clearDashboardReportState();
    };
  }, [dispatch, fromDate, toDate, SenderId]);

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
    const clientId = localStorage.getItem("clientId");
    setdataloading(true);
    dispatch(
      fetchDashboardSummary({
        clientId: clientId,
        fromDate,
        toDate,
        senderid: SenderId,
      })
    );
  };
  const lineChartData = {
    labels:
      dashboardsummary?.TotalMessagesChart?.map((item) => item.CreatedDate) ||
      [],
    datasets: [
      {
        label: "Total Messages Sent",
        data:
          dashboardsummary?.TotalMessagesChart?.map((item) => item.SentCount) ||
          [],
        borderColor: "#7e3af2",
        backgroundColor: "rgba(126, 58, 242, 0.2)",
        fill: true,
      },
      {
        label: "Total Delivered",
        data:
          dashboardsummary?.TotalMessagesChart?.map(
            (item) => item.DeliveredCount
          ) || [],
        borderColor: "#ffc107",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        fill: true,
      },
      {
        label: "Total Read",
        data:
          dashboardsummary?.TotalMessagesChart?.map((item) => item.ReadCount) ||
          [],
        borderColor: "#28a745",
        backgroundColor: "rgba(255, 193, 7, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <App>
     {!isLiveReporting.current && dataloading && <Loader />}



      <div className="w-full">
        {/* Date Filters */}
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
              onChange={handletoDateChange(settoDate)}
            />
          </div>
          <div className="flex flex-col mb-1 text-start">
            <label className="font-medium text-gray-700 text-sm">
              Sender Names
            </label>
            <SendernameDropdown name="senderId" onChange={handleChange} />
          </div>
        </div>
        {/* Tiles */}
        <div className="dashboard_stats row">
          {dashboardsummary?.UtilityMessages?.map((tile, index) => (
            <div
              key={index}
              className="bg-white stats shadow-md rounded-lg col-lg-3 mb-5 col-md-4 p-3 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className=" font-bold mb-0 ">{tile.Title}</h3>
              <hr className="h-1 d-hr" />
              <table border="1">
                <tr></tr>{" "}
                <tr>
                  <td>
                    {" "}
                    <p className=" font-semibold">
                      Sent {tile.SentCount}
                    </p>
                  </td>
                </tr>{" "}
                <tr>
                  {" "}
                  <td>
                    {" "}
                    <p className="font-semibold">
                      Delivered {tile.DeliveredCount}
                    </p>
                  </td>
                </tr>{" "}
                <tr>
                  {" "}
                  <td>
                    {" "}
                    <p className=" font-semibold">
                      Read {tile.ReadCount}
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          ))}

          {dashboardsummary?.MarketingMessages?.map((tile, index) => (
            <div
              key={index}
              className="bg-white stats shadow-md rounded-lg col-lg-3 mb-5 col-md-4 p-3 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className=" font-bold mb-0">{tile.Title}</h3>
              <hr className="h-1 d-hr" />
              <p className=" font-semibold">Sent: {tile.SentCount}</p>
              <p className=" font-semibold">
                Delivered: {tile.DeliveredCount}
              </p>
              <p className=" font-semibold">Read: {tile.ReadCount}</p>
            </div>
          ))}

          {dashboardsummary?.TotalConversations?.map((tile, index) => (
            <div
              key={index}
              className="bg-white stats shadow-md rounded-lg col-lg-3 mb-5 col-md-4 p-3 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className=" font-bold mb-0">{tile.Title}</h3>
              <hr className="h-1 d-hr" />
              <p className=" font-semibold">
                Count: {tile.TotalConversation}
              </p>
              <p className=" font-semibold">
                Messages: {tile.TotalMessages}
              </p>
            </div>
          ))}

          {dashboardsummary?.TotalConversationsStatus?.map((tile, index) => (
            <div
              key={index}
              className="bg-white stats shadow-md rounded-lg col-lg-3 mb-5 col-md-4 p-3 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className=" font-bold mb-0">{tile.Title}</h3>
              <hr className="h-1 d-hr" />

              <p className=" font-semibold">
                Total Conversation: {tile.TotalConversation}
              </p>
              <p className=" font-semibold">
                Auto Chat: {tile.AutoChat}
              </p>
              <p className=" font-semibold">
                Looking for agent: {tile.LookingForAgent}
              </p>
              <p className=" font-semibold">
                Agent assigned: {tile.AgentAssigned}
              </p>
            </div>
          ))}
          {dashboardsummary?.TotalConversationsStatus?.map((tile, index) => (
            <div
              key={index}
              className="bg-white stats shadow-md rounded-l col-lg-3 mb-5 col-md-4 g p-4 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className=" font-bold mb-0">Closed {tile.Title}</h3>
              <hr className="h-1 d-hr" />

              <p className=" font-semibold">
                Chat Closed: {tile.ChatClosed}
              </p>
              <p className=" font-semibold">
                Chat Expired: {tile.ChatExpired}
              </p>
              <p className=" font-semibold">Chat Force Closed: {tile.ChatForceClosed}</p>
            </div>
          ))}
        </div>

        {/* Line Chart */}
        <div className="mt-8 bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">
            Total Messages Chart
          </h3>
          <div className="chart-dashboard" style={{ height: "400px" }}>
            <Line
              data={lineChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </App>
  );
};

export default Dashboard;
