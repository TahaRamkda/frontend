"use client";
import { useEffect } from "react";

const FaviconManager = () => {
  useEffect(() => {
    // Read favicon path from localStorage
    const faviconPath = localStorage.getItem("LogoPath") ;

    // Remove existing favicons
    document.querySelectorAll("link[rel*='icon']").forEach((el) => el.remove());

    // Inject new favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = faviconPath;
    document.head.appendChild(link);
  }, []);

  return null;
};

export default FaviconManager;
