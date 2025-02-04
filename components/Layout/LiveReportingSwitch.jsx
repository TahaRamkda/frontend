import React, { useState, useEffect } from "react";
import Switch from "react-switch";

const LiveReportingSwitch = () => {
  const [isLiveReporting, setIsLiveReporting] = useState(() => {
    // Retrieve initial state from local storage (or default to false)
    return JSON.parse(localStorage.getItem("isLiveReporting")) || false;
  });

  // Save the state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("isLiveReporting", JSON.stringify(isLiveReporting));
  }, [isLiveReporting]);

  const handleToggle = (checked) => {
    setIsLiveReporting(checked);
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
      <label >Live Reporting</label>
      <Switch
        checked={isLiveReporting} // Controlled by state
        onChange={handleToggle} // Toggles the state
        onColor="#28a745" // Green for "On"
        offColor="#dc3545" // Red for "Off"
        height={25}
        width={60}
        checkedIcon={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              fontSize: 10,
              color: "white",
              whiteSpace: "nowrap",
              backgroundColor: "#28a745",
              padding: "0 12px",
              borderRadius: "5px",
            }}
          >
            ON
          </div>
        }
        uncheckedIcon={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              fontSize: 10,
              color: "white",
              whiteSpace: "nowrap",
              backgroundColor: "#dc3545",
              padding: "0 12px",
              borderRadius: "5px",
            }}
          >
            OFF
          </div>
        }
      />
    </div>
  );
};

export default LiveReportingSwitch;
