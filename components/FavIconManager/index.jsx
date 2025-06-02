"use client";
import { useEffect } from "react";

const FaviconManager = () => {
  useEffect(() => {
    const hostname = window.location.hostname;

    let faviconMap = {};
    try {
      faviconMap = JSON.parse(process.env.NEXT_PUBLIC_FAVICON_MAP || "{}");
    } catch (err) {
      console.error("Invalid favicon map in .env:", err);
    }

    const faviconHref = faviconMap[hostname] || "/favicons/default.ico";

    // Remove existing favicons
    document.querySelectorAll("link[rel*='icon']").forEach((el) => el.remove());

    // Inject new favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = faviconHref;
    document.head.appendChild(link);
  }, []);

  return null;
};

export default FaviconManager;
