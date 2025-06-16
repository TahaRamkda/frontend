"use client";
import { useEffect } from "react";

const FaviconManager = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const faviconPath = localStorage.getItem("LogoPath");

      if (faviconPath) {
        // Remove existing favicons
        document.querySelectorAll("link[rel*='icon']").forEach((el) => el.remove());

        // Inject new favicon
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = faviconPath;
        document.head.appendChild(link);

        // Stop polling once favicon is set
        clearInterval(interval);
      }
    }, 10); // Check every 500ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return null;
};

export default FaviconManager;
