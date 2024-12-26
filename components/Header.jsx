import { useState, useEffect } from "react";
import Link from "next/link";
import { HiZoomIn, HiZoomOut, HiLogout, HiMoon, HiSun, HiMenu } from "react-icons/hi";
import { useRouter } from 'next/router';

export function Header({ toggleSidebar }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkFullScreen = () => {
      setIsFullScreen(
        document.fullscreenElement !== null ||
        document.webkitFullscreenElement !== null ||
        document.mozFullScreenElement !== null ||
        document.msFullscreenElement !== null
      );
    };

    document.addEventListener("fullscreenchange", checkFullScreen);
    document.addEventListener("webkitfullscreenchange", checkFullScreen);
    document.addEventListener("mozfullscreenchange", checkFullScreen);
    document.addEventListener("msfullscreenchange", checkFullScreen);

    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }

    return () => {
      document.removeEventListener("fullscreenchange", checkFullScreen);
      document.removeEventListener("webkitfullscreenchange", checkFullScreen);
      document.removeEventListener("mozfullscreenchange", checkFullScreen);
      document.removeEventListener("msfullscreenchange", checkFullScreen);
    };
  }, []);

  const toggleFullScreen = () => {
    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    }
  };

  
  useEffect(() => {
    localStorage.setItem("darkMode", true);
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.clear();
      router.push("/auth/login")
    }
  };

  const handleSidebarToggle = () => {
    toggleSidebar();
  };

  return (
    <nav className="bg-[#820000]  text-white dark:bg-gray-900 fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex justify-between items-center py-3 px-2">
        {/* Logo Section on the Left Side */}
        <div className="flex items-center space-x-3">
          <Link href="/Dashboard" className="flex items-center space-x-3">
            <img className="h-8 w-auto" src="/images/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Action Buttons Section on the Right Side */}
        <div className="flex items-center justify-between space-x-4 w-100">
          {/* Sidebar Toggle Button */}
          <div className="ml-52">
            <button
              onClick={handleSidebarToggle}
              className="p-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
            >
              <HiMenu className="w-6 h-6" />
            </button>
          </div>

          <div className="space-x-4">
            {/* Fullscreen Toggle Icon */}
            <button
              onClick={toggleFullScreen}
              className="p-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
            >
              {isFullScreen ? <HiZoomOut className="w-6 h-6" /> : <HiZoomIn className="w-6 h-6" />}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
            >
              <HiLogout className="w-6 h-6" />
            </button>

          </div>

        </div>
      </div>
    </nav >
  );
}

export default Header;
