import React, { useState, useEffect } from "react";
import Switch from "react-switch";

const LiveReportingSwitch = () => {
  const [isLiveReporting, setIsLiveReporting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("isLiveReporting");
      if (storedValue !== null) {
        setIsLiveReporting(JSON.parse(storedValue));
      }
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("isLiveReporting", JSON.stringify(isLiveReporting));
    }
  }, [isLiveReporting, isMounted]);

  const handleToggle = (checked) => {
    setIsLiveReporting(checked);
    window.location.reload();
  };

  if (!isMounted) return null; // Prevent rendering until mounted on client

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <label>Live Reporting</label>
      <Switch
        checked={isLiveReporting}
        onChange={handleToggle}
        onColor="#28a745"
        offColor="#dc3545"
        height={25}
        width={60}
        checkedIcon={
          <div style={iconStyle("#28a745")}>ON</div>
        }
        uncheckedIcon={
          <div style={iconStyle("#dc3545")}>OFF</div>
        }
      />
    </div>
  );
};

const iconStyle = (bgColor) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  fontSize: 10,
  color: "white",
  backgroundColor: bgColor,
  padding: "0 12px",
  borderRadius: "5px",
});

export default LiveReportingSwitch;
