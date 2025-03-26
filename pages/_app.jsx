import { ToastContainer } from 'react-toastify';
import Toast from '../components/Layout/Toast';
import ErrorBoundary from '../components/ErrorBoundary';
import { RecoilRoot, useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toastState } from '../atoms';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import '../styles/style.css';
import showSweetAlert from "@/components/Sweetalert"; // Import your showSweetAlert utility
import '../styles/icon/font-awesome/css/font-awesome.min.css';
import '../styles/icon/themify-icons/themify-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import SweetAlert from 'sweetalert2';
import { sidebarItems } from '@/utils/sidebarItems';
import { PermissionsProvider } from '@/context/PermissionsContext';
import Loader from '@/components/Layout/Loader';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Tracks permission check completion

  const isAuthenticated =
    typeof window !== 'undefined' &&
    localStorage.getItem('accessToken') &&
    localStorage.getItem('tokenexpiry') &&
    new Date() < new Date(localStorage.getItem('tokenexpiry'));

  const normalizeString = (str) => str?.toLowerCase().replace(/\s/g, '') || '';

  const fetchPermissions = () => {
    const permissionData = localStorage.getItem('permission');
    return permissionData ? JSON.parse(permissionData) : [];
  };

  const hasPermission = (path, action = 'view') => {
    
    const permissions = fetchPermissions();
    const basePath = normalizeString(path.split('/')[1]);
    const isCreateAction = action.toLowerCase().includes('create');
   if(basePath.toLowerCase() ==="test"){
    return true
   }
    return permissions.some((perm) => {
      const taskName = normalizeString(perm.permissionTaskName);
      if (isCreateAction) {
        return taskName === basePath && perm.canCreate;
      }
       return taskName === basePath && perm.canView;
     
    });
  };

  useEffect(() => {
    const handleRouteChange = async () => {
      
      setIsLoading(true);

      if (!isAuthenticated) {
        if (router.pathname !== '/auth/login') {
          router.push('/auth/login');
        }
      } else if (router.pathname === '/') {
        const permissionJson = fetchPermissions();

        if (permissionJson.length > 0) {
          const matchingItem = sidebarItems.find((item) =>
            permissionJson.some(
              (permission) =>
                normalizeString(permission.permissionTaskName) ===
                  normalizeString(item.text) && permission.canView
            )
          );

          if (matchingItem) {
           
            router.push(matchingItem.href);
          } else {
            SweetAlert.fire({
              icon: 'error',
              title: 'Permission Error',
              text: 'No valid permissions found for accessible pages.',
            });
            
          }
        } else {
          SweetAlert.fire({
            icon: 'error',
            title: 'Permission Error',
            text: 'No permissions found. Please contact your administrator.',
          });
        }
      } else {
        const basePath = normalizeString(router.pathname.split('/')[1]);
        const currentAction =
          normalizeString(router.pathname.split('/')[2]) || 'view';

        const permissionExists = hasPermission(router.pathname, currentAction);

        if (!permissionExists) {
          router.push('/NotPermitted');
        }
      }

      setIsLoading(false);
    };

    handleRouteChange();
  }, [router.pathname]);


  useEffect(() => {
    const storedPermissions = localStorage.getItem("permission");
    if (storedPermissions) {
      setPermissions(JSON.parse(storedPermissions));
    } 
  }, []);

  // Display a loading state until permissions are validated
  if (isLoading) {
    return <div><Loader/></div>; // Replace with a loading spinner if needed
  }

  return (
   <ErrorBoundary>
      <RecoilRoot>
        <Provider store={store}>
          {/* Wrap the app with PermissionsProvider */}
          <PermissionsProvider permissions={permissions}>
            <Component {...pageProps} />
            <ToastContainer autoClose={3000} />
            <ErrorComponent />
          </PermissionsProvider>
        </Provider>
      </RecoilRoot>
    </ErrorBoundary>
  );
}

const ErrorComponent = () => {
  const [toast] = useRecoilState(toastState);
  return toast && <Toast />;
};

export default MyApp;
