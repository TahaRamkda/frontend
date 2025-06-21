import Head from "next/head";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = (props) => {
  const router = useRouter();

  // Authentication check
  const isAuthenticated =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : false;
  useEffect(() => {
    if (router.pathname.indexOf("ChatsList") !== -1) {
      setIsSidebarOpen(false);
    }
  });
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

  // State to manage the sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#f0f2f5' }}>
      <Head>
        <title>BCT WhatsApp</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          
          :root {
            --header-height: 4rem;
            --sidebar-width: 15rem;
            --sidebar-collapsed-width: 4rem;
            --border-color: rgba(229, 231, 235, 0.3);
            --shadow-color: rgba(0, 0, 0, 0.03);
          }

          @media (max-width: 768px) {
            :root {
              --header-height: 3.5rem;
              --sidebar-width: 14rem;
              --sidebar-collapsed-width: 3.5rem;
            }
          }

          @media (min-width: 1536px) {
            :root {
              --header-height: 4.5rem;
              --sidebar-width: 16rem;
              --sidebar-collapsed-width: 4.5rem;
            }
          }
          
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow-y: auto; /* Allow vertical scroll */
            background: #f0f2f5;
          }

          body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            font-size: 16px;
            color: #000000;
            font-weight: 500;
          }
          
          #__next {
            height: 100%;
          }

          .main-content {
            background: #f0f2f5;
            height: 100%;
          }

          a {
            text-decoration: none !important;
          }

          .sidebar-link {
            text-decoration: none !important;
            font-weight: 600;
          }

          .sidebar-text {
            font-size: 15px;
            font-weight: 600;
            letter-spacing: 0.01em;
          }

          .app-header {
            height: var(--header-height);
            border-bottom: 1px solid var(--border-color);
            box-shadow: 0 1px 2px var(--shadow-color);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 50;
            background: #F8F9FA;
          }

          .app-sidebar {
            width: var(--sidebar-width);
            position: fixed;
            top: var(--header-height);
            left: 0;
            bottom: 0;
            overflow-y: auto;
            overflow-x: hidden;
            border-right: 1px solid var(--border-color);
            box-shadow: 1px 0 2px var(--shadow-color);
            background: #F8F9FA;
            z-index: 40;
            transition: all 0.3s ease;
          }

          .app-sidebar.collapsed {
            width: var(--sidebar-collapsed-width);
          }

          .main-content-wrapper {
  margin-left: var(--sidebar-width);
  margin-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  width: calc(100% - var(--sidebar-width));
  background: #f0f2f5;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}



          .main-content-wrapper.sidebar-collapsed {
            margin-left: var(--sidebar-collapsed-width);
            width: calc(100% - var(--sidebar-collapsed-width));
          }

          @media (max-width: 640px) {
            body {
              overflow-y: auto;
            }

            .app-sidebar {
              transform: translateX(-100%);
              transition: transform 0.3s ease;
            }
            
            .app-sidebar.show {
              transform: translateX(0);
            }

            .main-content-wrapper {
              margin-left: 0;
              width: 100%;
              position: relative;
            }

            .main-content-wrapper.sidebar-collapsed {
              margin-left: 0;
              width: 100%;
            }
          }

          /* Custom scrollbar for sidebar */
          .app-sidebar::-webkit-scrollbar {
            width: 4px;
          }

          .app-sidebar::-webkit-scrollbar-track {
            background: transparent;
          }

          .app-sidebar::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
          }

          .app-sidebar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.2);
          }

          /* Content scrollbar */
          .main-content-wrapper::-webkit-scrollbar {
            width: 6px;
          }

          .main-content-wrapper::-webkit-scrollbar-track {
            background: transparent;
          }

          .main-content-wrapper::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
          }

          .main-content-wrapper::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.2);
          }

          /* Button and link hover effects */
          .sidebar-link:hover, button:hover {
            transition: all 0.2s ease;
          }

          /* Content card styling */
          .rounded-lg {
            border-radius: 12px;
          }

          .shadow-sm {
            box-shadow: 0 1px 3px var(--shadow-color),
                      0 1px 2px var(--shadow-color);
          }

          .content-card {
            background: white;
            box-shadow: 0 1px 3px var(--shadow-color),
                       0 1px 2px var(--shadow-color);
            height: 100%;
            width: 100%;
            padding: 1rem;
          }

          .content-wrapper {
            height: 100%;
            width: 100%;
          }

          @media (min-width: 768px) {
            .content-card {
              padding: 1.25rem;
            }
          }

          /* Toast styling */
          .Toastify__toast-container {
            padding: 0;
            width: auto;
            max-width: 400px;
          }

          .Toastify__toast {
            font-family: 'Poppins', sans-serif;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 8px;
            box-shadow: 0 2px 4px var(--shadow-color);
            font-size: 14px;
            font-weight: 500;
          }

          .Toastify__toast--success {
            background: #dcf5e8;
            color: #0a5a36;
            border: 1px solid #b4e6cc;
          }

          .Toastify__toast--error {
            background: #fee7e7;
            color: #b91c1c;
            border: 1px solid #fecaca;
          }

          .Toastify__toast--warning {
            background: #fef5e7;
            color: #92400e;
            border: 1px solid #fed7aa;
          }

          .Toastify__toast--info {
            background: #e7f2fe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
          }

          .Toastify__toast-icon {
            width: 20px;
            height: 20px;
            margin-right: 12px;
          }

          .Toastify__close-button {
            color: currentColor;
            opacity: 0.6;
          }

          .Toastify__close-button:hover {
            opacity: 1;
          }

          .Toastify__progress-bar {
            height: 3px;
            opacity: 0.8;
          }

          .Toastify__toast--success .Toastify__progress-bar {
            background: #059669;
          }

          .Toastify__toast--error .Toastify__progress-bar {
            background: #dc2626;
          }

          .Toastify__toast--warning .Toastify__progress-bar {
            background: #d97706;
          }

          .Toastify__toast--info .Toastify__progress-bar {
            background: #2563eb;
          }

          @media (max-width: 480px) {
            .Toastify__toast-container {
              width: calc(100% - 32px);
              margin: 16px;
            }
          }
        `}</style>
      </Head>

      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />

      {/* Main container */}
      <div className="flex flex-1 relative min-h-screen">
        {/* Sidebar */}
        <div
          className={`app-sidebar ${!isSidebarOpen ? 'collapsed' : ''} ${
            isSidebarOpen ? 'show' : ''
          }`}
        >
          <div className="h-full">
            <Sidebar isSidebarOpen={isSidebarOpen} />
          </div>
        </div>

        {/* Main content */}
        <div
          className={`main-content-wrapper ${
            !isSidebarOpen ? 'sidebar-collapsed' : ''
          }`}
        >
          <div className="content-wrapper">
            <div className="content-card">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
