import { useState, useEffect,useRef } from "react";
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
import { fetchDashboardSummary, clearDashboardReportState } from "@/slices/ReportSlice";

import Loader from "@/components/Layout/Loader";
import { set } from "date-fns";
import { toast } from "react-toastify";
import { REFRESH_INTERVAL } from "@/utils/constants";
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const [dataloading, setdataloading] = useState(false);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [SenderId, setSenderId] = useState(0);
  const [clientId, setclientId] = useState(0);
  const { dashboardsummary, loading, error } = useSelector((state) => state.reports);
  //const clientId = localStorage.getItem("clientId");
  const fromDateRef = useRef("");
  const toDateRef = useRef("");
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

  useEffect(()=>{
    if(dashboardsummary){
      setdataloading(false)
    }
  },[dashboardsummary]


  
)

//function for live reporting
 useEffect(() => {
    const checkAndFetch = async () => {
      const isLiveReporting = JSON.parse(localStorage.getItem("isLiveReporting"));
      const fromDate = fromDateRef.current;
      const toDate = toDateRef.current;
      if (isLiveReporting && !loading) {
       
        try {
          await dispatch(fetchDashboardSummary({ clientId:localStorage.getItem("clientId"), fromDate:fromDate, toDate:toDate, senderid: SenderId }));
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
      setdataloading(true)
      dispatch(fetchDashboardSummary({ clientId:clientId, fromDate, toDate, senderid: SenderId }));
    }
    return () => {
      clearDashboardReportState();
    };
  }, [dispatch, fromDate, toDate, SenderId]);

  const handlefromDateChange = (setter) => (e) => {
    fromDateRef.current = e.target.value;
    setter(e.target.value);
  };
  const handletoDateChange = (setter) => (e) => {
    toDateRef.current = e.target.value;
    setter(e.target.value);
  };
  const handleChange = (e) => {
    const senderId = e.target.value;
    setSenderId(senderId)
    const clientId = localStorage.getItem("clientId");
     setdataloading(true)
    dispatch(fetchDashboardSummary({ clientId : clientId, fromDate, toDate, senderid: SenderId }));
  };
  const lineChartData = {
    labels: dashboardsummary?.TotalMessagesChart?.map((item) => item.CreatedDate) || [],
    datasets: [
      {
        label: "Total Messages Sent",
        data: dashboardsummary?.TotalMessagesChart?.map((item) => item.SentCount) || [],
        borderColor: "#7e3af2",
        backgroundColor: "rgba(126, 58, 242, 0.2)",
        fill: true,
      },
      {
        label: "Total Delivered",
        data: dashboardsummary?.TotalMessagesChart?.map((item) => item.DeliveredCount) || [],
        borderColor: "#ffc107",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        fill: true,
      },
      {
        label: "Total Read",
        data: dashboardsummary?.TotalMessagesChart?.map((item) => item.ReadCount) || [],
        borderColor: "#28a745",
        backgroundColor: "rgba(255, 193, 7, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <App>
      {dataloading && <Loader />}
      <div className="w-full">
        {/* Date Filters */}
        <div className="grid grid-cols-5 mb-4 gap-4">
          <div className="flex flex-col space-y-1 text-start mb-1 ">
            <label className="font-medium text-gray-700 text-sm">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={handlefromDateChange(setfromDate)}
              className="border rounded py-1 px-2 w-full text-sm"
            />
          </div>
          <div className="flex flex-col space-y-1 text-start mb-1 ">
            <label className="font-medium text-gray-700 text-sm">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={handletoDateChange(settoDate)}
              className="border rounded py-1 px-2 w-full text-sm"
            />
          </div>
          <div className="flex flex-col mb-1 text-start">
            <label className="font-medium text-gray-700 text-sm">Sender Names</label>
            <SendernameDropdown name="senderId" onChange={handleChange} />
          </div>
        </div>
        {/* Tiles */}
        <div className="grid grid-cols-5 gap-4">
          {dashboardsummary?.UtilityMessages?.map((tile, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className="text-lg font-bold">{tile.Title}</h3>
              <hr className="h-1" />
              <table border="1">
                <tr>
                </tr> <tr><td>  <p className="text-lg font-semibold">Sent {tile.SentCount}</p></td>
                </tr> <tr> <td> <p className="text-lg font-semibold">Delivered {tile.DeliveredCount}</p></td>
                </tr> <tr> <td> <p className="text-lg font-semibold">Read {tile.ReadCount}</p></td>
                </tr>
              </table>
            </div>
          ))}

          {dashboardsummary?.MarketingMessages?.map((tile, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className="text-lg font-bold">{tile.Title}</h3>
              <hr className="h-1" />
              <p className="text-lg font-semibold">Sent: {tile.SentCount}</p>
              <p className="text-lg font-semibold">Delivered: {tile.DeliveredCount}</p>
              <p className="text-lg font-semibold">Read: {tile.ReadCount}</p>
            </div>
          ))}

          {dashboardsummary?.TotalConversations?.map((tile, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className="text-lg font-bold">{tile.Title}</h3>
              <hr className="h-1" />
              <p className="text-lg font-semibold">Count: {tile.TotalConversation}</p>
              <p className="text-lg font-semibold">Messages: {tile.TotalMessages}</p>
            </div>
          ))}

          {dashboardsummary?.TotalConversationsInitiated?.map((tile, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className="text-lg font-bold">{tile.Title}</h3>
              <hr className="h-1" />

              <p className="text-lg font-semibold">Count: {tile.TotalConversation}</p>
              <p className="text-lg font-semibold">Messages: {tile.TotalMessages}</p>
            </div>
          ))}
          {dashboardsummary?.ActiveConversations.map((tile, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-left"
              style={{ borderTop: `4px solid ${tile.Color}` }}
            >
              <h3 className="text-lg font-bold">{tile.Title}</h3>
              <hr className="h-1" />

              <p className="text-lg font-semibold">Count: {tile.TotalConversation}</p>
              <p className="text-lg font-semibold">Not Assigned: {tile.NotAssigned}</p>
              <p className="text-lg font-semibold">Assigned: {tile.Assigned}</p>

            </div>
          ))}
        </div>

        {/* Line Chart */}
        <div className="mt-8 bg-white p-4 rounded shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Total Messages Chart</h3>
          <div style={{ height: "400px" }}>
            <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </App>
  );
};

export default Dashboard;
