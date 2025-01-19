import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiZoomIn,
  HiZoomOut,
  HiLogout,
  HiMoon,
  HiSun,
  HiMenu,
  HiShieldExclamation,
} from "react-icons/hi";
import { useRouter } from "next/router";
import SweetAlert from "sweetalert2";
import UserBadge from "@/public/images/User.jpg";
import ChangePass from "./ChangePassword";
import LiveReportingSwitch from "./LiveReportingSwitch";
import Switch from "react-switch";
import { set } from "date-fns";
export function Header({ toggleSidebar }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [ShowChangePass, setShowChangePass] = useState (false)
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

    // const savedDarkMode = localStorage.getItem("darkMode") === "true";
    // setIsDarkMode(savedDarkMode);
    // if (savedDarkMode) {
    //   document.documentElement.classList.add("dark");
    // }

    return () => {
      document.removeEventListener("fullscreenchange", checkFullScreen);
      document.removeEventListener("webkitfullscreenchange", checkFullScreen);
      document.removeEventListener("mozfullscreenchange", checkFullScreen);
      document.removeEventListener("msfullscreenchange", checkFullScreen);
    };
  }, []);

  const HandelChangePass = () =>{
    setShowChangePass(true)
  }
  const handleCancel = () => {
    setShowChangePass(false);

  };

  const enterFullScreen = () => {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) {
      docEl.webkitRequestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      docEl.mozRequestFullScreen();
    } else if (docEl.msRequestFullscreen) {
      docEl.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const toggleFullScreen = () => {
    if (isFullScreen) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
  };

  // Listen for fullscreen changes and update the state
  useEffect(() => {
    const handleFullScreenChange = () => {
      const fullScreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      setIsFullScreen(!!fullScreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
  }, []);

  


  const handleLogout = () => {
    SweetAlert.fire({
      title: "Are you sure you want to logout?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        router.push("/auth/login");
      }
    });
  };

  const handleSidebarToggle = () => {
    toggleSidebar();
  };

  return (
    <nav className="text-white bg-gray-900 fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex justify-between items-center py-3 px-2">
        {/* Logo Section on the Left Side */}
        <div className="flex items-center space-x-3">
          <Link href="/Dashboard" className="flex items-center space-x-3">
            <img
              className="h-8 w-auto"
              src="\images\logo\Loader.svg"
              alt="Logo"
            />
          </Link>
        </div>

        {/* Action Buttons Section on the Right Side */}
        <div className="flex items-center justify-between space-x-4 w-100">
          {/* Sidebar Toggle Button */}
          <div className="ml-52">
            <button
              onClick={handleSidebarToggle}
              className="p-2 bg-gray-100  bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none"
            >
              <HiMenu className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
         
          <LiveReportingSwitch />
            {/* Fullscreen Toggle Icon */}
            <button
              onClick={toggleFullScreen}
              className="p-2 bg-gray-100  bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none"
            >
              {isFullScreen ? (
                <HiZoomOut className="w-6 h-6" />
              ) : (
                <HiZoomIn className="w-6 h-6" />
              )}
            </button>

            {/* User Badge with Name and Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 p-2 bg-gray-100  bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={UserBadge.src}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span>{localStorage.getItem("userName")}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 shadow-lg rounded-md">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600"
                  >
                    <HiLogout className="" />
                    <span>Logout</span>
                  </button>

                  <button
       onClick={HandelChangePass}
       className="flex items-center w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600"
     >
       <HiShieldExclamation className="" />
       <span>Change Password</span>
     </button> 
                </div>
              )}
            </div>
          </div>
        </div>
        {ShowChangePass && (
          <ChangePass 
          isVisible={true}
          onClose={handleCancel} />
        )} 
      </div>
    </nav>
  );
}

export default Header;
