import React from "react";
import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
const Loader = () => {
  const [logoSrc, setLogoSrc] = useState("");
  const [companyName, setCompanyName] = useState("");
  const logoMap = JSON.parse(process.env.NEXT_PUBLIC_LOGO_MAP || "{}");
  const companyNameMap = JSON.parse(
    process.env.NEXT_PUBLIC_COMPANY_NAME_MAP || "{}"
  );
  useEffect(() => {
    ;
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setLogoSrc(logoMap[hostname]);
      setCompanyName(companyNameMap[hostname]);
    }
  }, [logoMap, companyNameMap]);
  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      {/* Loader Container */}
      <div className="relative w-16 h-16">
        {" "}
        {/* Reduced size for closer effect */}
        {/* Spinning Circle */}
        <div className="absolute inset-0 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        {/* Fading Circle */}
        <div
          className="absolute inset-0 border-4 border-gray-200 border-t-blue-400 rounded-full"
          style={{ animation: "spin-and-fade 1.5s linear infinite" }}
        ></div>
        {/* Center Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={logoSrc} // Replace with your image path
            alt="Loading"
            className="w-10 h-10" // Adjust size as needed
          />
        </div>
      </div>
      {/* Keyframe Animation */}
      <style>
        {`
        @keyframes spin-and-fade {
          0% {
            transform: rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg);
            opacity: 0.5;
          }
        }
      `}
      </style>
    </div>
  );
};

export default Loader;
