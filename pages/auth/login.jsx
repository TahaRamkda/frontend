import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import imageOne from "@/public/images/logo.png";
import { fetchLogin, blankAuthState } from "@/slices/AuthSlice";
import { Image } from "react-bootstrap";
import { sidebarItems } from "@/utils/sidebarItems";
const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authuserData, setauthuserData] = useState(null);
  const { authData, loading, error } = useSelector((state) => state.authData);

  // Handler for form submission
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await dispatch(fetchLogin({ email, password })).unwrap();
      debugger;
      if (response.status === 1) {
        console.log("Auth data:", response);
        blankAuthState();
        router.push("/");
      } else {
        SweetAlert.fire({
          icon: "error",
          title: "Oops...",
          text: response.message || "Incorrect Username or Password!",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      // Handle errors (e.g., invalid credentials)
      SweetAlert.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Incorrect Username or Password!",
      });
    }
  };

  // useEffect(() => {

  //   if (authData) {
  //
  //     // Set login cookie
  //     blankAuthState();
  //     // Redirect to dashboard
  //     router.push("/Dashboard");

  //   }

  //   if (error) {
  //     // Display an error if login fails
  //     SweetAlert.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Incorrect Username or Password!",

  //     });
  //   }
  // }, [ error, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="relative w-full max-w-4xl h-[600px] bg-white  shadow-lg overflow-hidden">
        {/* Background Circles */}
        <div className="absolute top-0 left-0 w-3/5 h-full bg-gray-900 rounded-br-full">
          <div className="absolute w-52 h-52 bg-blue-900 rounded-full -bottom-28 -right-[29rem]"></div>
          <div className="absolute w-52 h-52 bg-blue-900 rounded-full top-[27rem] right-[2rem] transform -translate-y-1/2"></div>
          <div className="absolute w-80 h-80 bg-blue-900 rounded-full -bottom-28 -left-28"></div>
        </div>

        {/* Company Logo and Name */}
        <div className="absolute left-10 top-[80px] text-white flex flex-col items-center">
          <Image
            src="/images/logo/Loader.svg" // Ensure correct path (use / instead of \)
            alt="Company Logo"
            width={100} // Adjusted width
            height={100} // Corrected height to match width for proper proportion
            className="mb-3"
          />
          <p className="text-3xl font-semibold">Babji Consult Techies</p>
        </div>

        {/* Login Form */}
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-80 p-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 class="text-center text-2xl font-bold">Sign In</h2>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                User Name
              </label>
              <input
                id="email"
                type="text"
                required
                placeholder="User Name"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded py-1 px-2 w-full mt-1 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
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
                  className="border rounded py-1 px-2 w-full mt-1 text-sm"
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-2 mt-2 cursor-pointer text-gray-500"
                  onClick={() => setShow(!show)}
                >
                  {show ? (
                    <i className="fa fa-eye"></i>
                  ) : (
                    <i className="fa fa-eye-slash"></i>
                  )}
                </span>
              </div>
            </div>

            <div>
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
    </div>
  );
};

export default Login;
