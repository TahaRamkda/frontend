import Cookies from "js-cookie";
  import Link from "next/link";
  import { useRouter } from "next/navigation";
  import SweetAlert from "sweetalert2";
  import { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import imageOne from "@/public/images/logo.png";
  import { fetchLogin } from "@/slices/AuthSlice";
import { sidebarItems } from '@/utils/sidebarItems';
  const Login = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const { authData, loading, error } = useSelector((state) => state.authData);
  
    // Handler for form submission
    const handleLogin = (event) => {
      event.preventDefault();
  
      // Dispatch the fetchLogin action with email and password
      dispatch(fetchLogin({ email, password }));
    };
  
    useEffect(() => {
      if (authData) {
        
        // Set login cookie
        Cookies.set("edmin_login", JSON.stringify(true));
  
        // Get permission data from local storage
        const permissionData = localStorage.getItem("permission");
        const permissionJson = permissionData ? JSON.parse(permissionData) : [];
  
        if (permissionJson.length > 0) {
          // Find the first matching permission task name in sidebarItems
          const matchingItem = sidebarItems.find((item) =>
            permissionJson.some(
              (permission) =>
                permission.permissionTaskName === item.text &&
                permission.canView // Ensure the permission allows viewing
            )
          );
  
          // Redirect to the href of the matching item or to a default route
          if (matchingItem) {
            router.push(matchingItem.href);
          } else {
           
          }
        } else {
          router.push("/auth/login");
        }
      }
  
      if (error) {
        // Display an error if login fails
        SweetAlert.fire({
          icon: "error",
          title: "Oops...",
          text: "Incorrect Username or Password!",
         
        });
      }
    }, [authData, error, router]);
  
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="mb-6">
          
        </div>
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleLogin} className="space-y-6">
          <Link href={"/"  }>
            <img className="h-20 mx-auto" src="\images\logo\logo.png" alt="logo" />
          </Link>
          <h2 class="text-center text-2xl font-bold">Sign In</h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="text"
                required
                placeholder="Email Address"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="******"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  name="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500"
                  onClick={() => setShow(!show)}
                >
                  {show ? "Hide" : "Show"}
                </span>
              </div>
            </div>
            
            <div >
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
            
           
           
          </form>
        </div>
      </div>
    );
  };
  
  export default Login;
  