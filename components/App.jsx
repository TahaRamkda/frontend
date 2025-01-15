import Head from 'next/head'
import { Header } from './Header'
import { Footer } from './Footer'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Sidebar from './Sidebar'

const App = (props) => {
    const router = useRouter()

    // Authentication check
    const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : false
    useEffect(()=> {
        if(router.pathname.indexOf("ChatsList") !== -1){
            setIsSidebarOpen(false);
        }
    })
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login') // Redirect to login if not authenticated
        }
    }, [isAuthenticated, router])

    // State to manage the sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    // Function to toggle the sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev)
    }

    const headerHeight = 60 // Adjust based on your header height
    const sidebarWidth = 250 // Adjust based on your sidebar width
    const collapsedSidebarWidth = 80 // Width when sidebar is collapsed

    return (
        <div id="pcoded" >
            <div className="pcoded-overlay-box"></div>
            <div className="pcoded-container navbar-wrapper">
                <Head>
                    <title>BCT WhatsApp</title>
                    {/* <title>{props.title}</title> */}
                </Head>

                {/* Header component with toggle sidebar button */}
                <Header toggleSidebar={toggleSidebar} />

                {/* Main container for the layout */}
                <div
                    className="pcoded-main-container"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: `${headerHeight}px`,
                    }}
                >
                    {/* Sidebar with dynamic width based on state */}
                    <div
                        className="pcoded-wrapper"
                        style={{
                            display: 'flex',
                            flex: 1,
                            position: 'fixed',
                            top: `${headerHeight}px`,
                            left: 0,
                            height: `calc(100vh - ${headerHeight}px)`,
                            width: isSidebarOpen ? `${sidebarWidth}px` : `${collapsedSidebarWidth}px`, // Handle collapsed state

                            transition: 'width 0.3s ease',
                        }}
                    >
                        <Sidebar isSidebarOpen={isSidebarOpen} />
                    </div>

                    {/* Content area */}
                    <div
                        className="pcoded-content"
                        style={{
                            flex: 1,
                            marginLeft: isSidebarOpen ? `${sidebarWidth}px` : `${collapsedSidebarWidth}px`, // Adjust based on sidebar state
                            transition: 'margin-left 0.3s ease',
                            padding: '20px',
                        }}
                    >
                        <div className="pcoded-inner-content">
                            <div className="main-body">
                                <div className="page-wrapper">
                                    <div className="page-body">
                                        {props.children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
       
    )
}

export default App
