import { ToastContainer } from 'react-toastify';
import Toast from '../components/Toast';
import ErrorBoundary from '../components/ErrorBoundary';
import { RecoilRoot, useRecoilState } from 'recoil';
import { useEffect, Suspense, useState } from 'react';
import { useRouter } from 'next/router';
import { toastState } from '../atoms';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import '../styles/style.css';
import '../styles/icon/font-awesome/css/font-awesome.min.css';
import '../styles/icon/themify-icons/themify-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { PermissionsProvider } from '@/context/PermissionsContext';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { sidebarItems } from '@/utils/sidebarItems';
function MyApp({ Component, pageProps }) {
    const [permissions, setPermissions] = useState([]);
    const router = useRouter();



    const isAuthenticated =
    typeof window !== "undefined" &&
    localStorage.getItem("accessToken") &&
    localStorage.getItem("tokenexpiry") &&
    new Date() < new Date(localStorage.getItem("tokenexpiry"));

  useEffect(() => {
    if (!isAuthenticated) {
      if (router.pathname !== "/auth/login") {
        router.push("/auth/login");
      }
    } else {
      if (router.pathname === "/" || router.pathname === "/auth/login" || router.pathname === "/Dashboard") {
        const permissionData = localStorage.getItem("permission");
        const permissionJson = permissionData ? JSON.parse(permissionData) : [];
  
       if (permissionJson.length > 0) {
                 // Find the first matching permission task name in sidebarItems
                 const matchingItem = sidebarItems.find((item) =>
                   permissionJson.some(
                     (permission) =>
                       permission.permissionTaskName.toLowerCase() === item.text.toLowerCase() &&
                       permission.canView // Ensure the permission allows viewing
                   )
                 );
         
                 // Redirect to the href of the matching item or to a default route
                 if (matchingItem) {
                   router.push(matchingItem.href);
                 } else {
                   SweetAlert.fire({
                     icon: "error",
                     title: "Permission Error",
                     text: "No valid permissions found for accessible pages.",
                   });
                 }
               } else {
                 
               }
      }
    }
  }, [isAuthenticated, router.pathname]);

    useEffect(() => {
        const fetchPermissionDetail = async () => {
            const permissionData = localStorage.getItem("permission");
            const permissionJson = permissionData ? JSON.parse(permissionData) : [];
            setPermissions(permissionJson);
        };
        fetchPermissionDetail();
    }, []);

    useEffect(() => {
        // Skip permission check for auth/login page
        if (router.pathname === '/auth/login') {
            return; // Do not check permissions for the login page
        }

        const basePath = router.pathname.split('/')[1]?.toLowerCase().replace(' ', ''); // Extract base module (e.g., 'clients')
        const currentAction = router.pathname.split('/')[2]?.toLowerCase().replace(' ', ''); // Extract subpath (e.g., 'createclient', 'list')

        const isCreateAction = currentAction?.includes('create'); // Check if the subpath includes 'create'

        const hasPermission = permissions.some((perm) => {
            if (isCreateAction) {
                return (
                    perm.permissionTaskName.toLowerCase().replace(' ', '') === basePath &&
                    perm.canCreate
                );
            } else {
                return (
                    perm.permissionTaskName.toLowerCase().replace(' ', '') === basePath &&
                    perm.canView
                );
            }
        });
        if (router.pathname.toLowerCase().indexOf("test")>-1 || router.pathname.toLowerCase().indexOf("flows")>-1) 
          {

          }
        else if (!hasPermission && permissions.length > 0) {
            router.push('/NotPermitted');
        }
    }, [permissions, router.pathname]);

    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <title>Babji Whatsapp Integration</title>
            <ErrorBoundary>
                <RecoilRoot>
                    <Provider store={store}>
                        <PermissionsProvider permissions={permissions}>
                            <Component {...pageProps} />
                        </PermissionsProvider>
                    </Provider>
                    <ToastContainer autoClose={3000} />
                    <ErrorComponent />
                </RecoilRoot>
            </ErrorBoundary>
        </Suspense>
    );
}

const ErrorComponent = () => {
    const [toast] = useRecoilState(toastState);
    return toast && <Toast />;
};

export default MyApp;
