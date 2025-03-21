import React, { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaCircle } from "react-icons/fa"; // Example icons from react-icons
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import App from "@/components/Layout/App";
// Dummy data
import {
  fetchSupervisorDashboard,
  clearSupervisorDashboardState,
} from "@/slices/ReportSlice";

const DashboardPage = () => {
  const [senderid, setSenderid] = useState(0);
  const dispatch = useDispatch();
  const { supervisorDashboard, loading, error } = useSelector(
    (state) => state.reports
  );

  useEffect(() => {
    // Initial fetch when component mounts or senderid changes
    dispatch(fetchSupervisorDashboard({ senderid: senderid }));

    // Set up interval to fetch data every 30 seconds
    const intervalId = setInterval(() => {
      dispatch(fetchSupervisorDashboard({ senderid: senderid }));
    }, 3000); // 30 seconds in milliseconds

    // Cleanup function: clear interval and state when component unmounts or dependencies change
    return () => {
      clearInterval(intervalId); // Stop the interval
      clearSupervisorDashboardState(); // Clear Redux state
    };
  }, [senderid, dispatch]); // Dependencies remain the same

  return (
    <App>
      <div className="flex ">
        {" "}
        {/* Added h-screen to make full height */}
        {/* Side Panel (Always Open) */}
        <div className="w-80 bg-white transform transition-all duration-300 ease-in-out flex flex-col max-h-[80vh] overflow-auto ">
          {" "}
          {/* Added flex, flex-col, and h-full */}
          <div className="p-4 text-black text-lg border rounded-sm font-bold flex items-center">
            <FaUser className="mr-2" />
            Agent Details
          </div>
          <div className="overflow-y-auto border flex-grow">
            {" "}
            {/* Added flex-grow to make it stretch */}
            {supervisorDashboard?.Agents?.map((agent) => (
              <div
                key={agent.Id}
                className="p-1 border-b border-gray-200 hover:bg-blue-50 flex items-center"
              >
                <span className="w-3 h-3 rounded-full mr-4 ml-1 flex items-center justify-center">
                  <FaCircle
                    className={
                      agent.Status === 0
                        ? ""
                        : agent.Status === 1
                        ? "text-green-500 text-xs"
                        : "text-red-500 text-xs"
                    }
                  />
                </span>
                <div className="flex-grow p-1">
                  <div className="flex justify-between items-center ">
                    <strong className="text-gray-800 text-lg font-semibold">
                      {agent.FullName}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center p-1 ">
                    <span className="text-gray-500 text-sm">
                      Status:{" "}
                      <span className="font-medium">{agent.StatusName}</span>
                    </span>
                    <span className="text-gray-500 text-sm ">
                      Disabled:{" "}
                      <span className="font-medium">
                        {agent.IsDisabled === 1 ? "Yes" : "No"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-grow overflow-y-auto">
          <div className="ml-6">
            <h2 className=" bg-white shadow-sm border rounded-sm p-3">
              Dashboard
            </h2>
          </div>

          <div className="p-5">
            {/* Section 1: Agent Status */}
            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {supervisorDashboard?.Conversations?.map((status) => (
                  <div
                    key={status.Status}
                    className="bg-white p-1 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500 "
                  >
                    <div className="flex items-Start">
                      <div className="text-2xl text-blue-500 mr-3">
                        {/* Placeholder for icon */}
                      </div>
                      <div>
                        <h6 className="text-md font-medium text-gray-600 mb-1">
                          {status.StatusName}
                        </h6>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {status.Total}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Section 3: Alerts */}
            <h4 className="text-xl font-semibold text-gray-700 mb-4">Alerts</h4>
            <div>
              <div className="space-y-4 max-h-[45vh] overflow-auto ">
                {supervisorDashboard?.Alerts?.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg shadow-md ${
                      alert.priority === 1
                        ? "bg-red-100 border-l-4 border-red-500"
                        : alert.priority === 2
                        ? "bg-yellow-100 border-l-4 border-yellow-500"
                        : "bg-blue-100 border-l-4 border-blue-500"
                    } transition-transform duration-300 hover:bg-opacity-50`}
                  >
                    <div className="">
                      <div>
                        <p className="text-gray- text-sm">{alert.Message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </App>
  );
};

export default DashboardPage;
