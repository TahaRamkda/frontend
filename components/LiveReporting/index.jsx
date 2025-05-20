// components/LiveReport.jsx
"use client"; // Mark as Client Component for client-side interactivity

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
const LiveReport = ({fetchData}) => {
  // State variables:
  // - data: Stores the fetched API data
  // - refreshInterval: Controls how often data is fetched (in seconds)
  // - countdown: Tracks seconds until the next refresh
  // - loading: Indicates if data is being fetched
  const [refreshInterval, setRefreshInterval] = useState(10); // Default: 10 seconds
  const [countdown, setCountdown] = useState(refreshInterval);

  // Function to fetch data (mock or real API)
 

  // Effect to manage data fetching and countdown
  useEffect(() => {
    // Fetch data immediately on mount
    fetchData();

    // Set up interval for auto-refreshing data
    const refreshTimer = setInterval(() => {
      fetchData();
      setCountdown(refreshInterval); // Reset countdown after each fetch
    }, refreshInterval * 1000);

    // Set up countdown timer (updates every second)
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : refreshInterval));
    }, 1000);

    // Cleanup: Clear intervals when component unmounts to prevent memory leaks
    return () => {
      clearInterval(refreshTimer);
      clearInterval(countdownTimer);
    };
  }, [refreshInterval]); // Re-run effect if refreshInterval changes

  // Handle changes to the refresh interval input
  const handleIntervalChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setRefreshInterval(value);
      setCountdown(value); // Reset countdown to new interval
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Live Reporting Dashboard
      </h1>

      {/* Refresh Interval Input */}
      <div className="mb-6">
        <label
          htmlFor="interval"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Refresh Interval (seconds)
        </label>
        <input
          type="number"
          id="interval"
          value={refreshInterval}
          onChange={handleIntervalChange}
          min="1"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>

      {/* Countdown Display */}
      <div className="mb-6">
        <p className="text-lg text-gray-600">
          Next refresh in:{" "}
          <span className="font-semibold text-indigo-600">{countdown}</span>{" "}
          seconds
        </p>
      </div>
    </div>
  );
};

export default LiveReport;
