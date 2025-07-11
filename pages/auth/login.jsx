import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import imageOne from "@/public/images/logo.png";
import { fetchLogin, blankAuthState } from "@/slices/AuthSlice";
import { Image } from "react-bootstrap";
import Logo from "@/components/Logo/Logo";
import { fetchMerchant } from "@/slices/MerchantSlice";
import { sidebarItems } from "@/utils/sidebarItems";
const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [authuserData, setauthuserData] = useState(null);
  const { authData, loading, error } = useSelector((state) => state.authData);
  const { merchantData } = useSelector((state) => state.merchant);
  
  useEffect(() => {
    const hostname = window.location.hostname;
    
    if (merchantData.length === 0 && localStorage.getItem("LogoPath") === null) {
      dispatch(fetchMerchant({ domain: hostname }));
    }
  }, [dispatch, merchantData]);

  
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await dispatch(fetchLogin({ email, password })).unwrap();
      console.log("Auth data:", response);
      if (response.status === 1) {
        if (rememberMe) {
          // Set remember me cookie
          Cookies.set("rememberMe", "true", { expires: 30 });
          Cookies.set("email", email, { expires: 30 });
        }
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
      SweetAlert.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Incorrect Username or Password!",
      });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        background: `linear-gradient(135deg, #CADCFC 0%, #EDF4F2 100%)`,
      }}
    >
      <div
        className="relative w-full max-w-4xl h-[600px] bg-white/95 rounded-[30px] overflow-hidden border border-white/20 backdrop-filter backdrop-blur-sm"
        style={{
          boxShadow:
            "0 15px 50px rgba(115, 145, 206, 0.2), 0 5px 15px rgba(115, 145, 206, 0.1)",
        }}
      >
        {/* Background Design */}
        <div
          className="absolute top-0 left-0 w-3/5 h-full rounded-br-[120px]"
          style={{
            background: "linear-gradient(135deg, #7391CE 0%, #4A6CA2 100%)",
            boxShadow: "0 4px 30px rgba(115, 145, 206, 0.2)",
          }}
        >
          <div
            className="absolute w-52 h-52 rounded-full -bottom-28 -right-[29rem] backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(135deg, rgba(237, 244, 242, 0.3) 0%, rgba(202, 220, 252, 0.3) 100%)",
            }}
          ></div>
          <div
            className="absolute w-52 h-52 rounded-full top-[27rem] right-[2rem] transform -translate-y-1/2 backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(135deg, rgba(202, 220, 252, 0.3) 0%, rgba(237, 244, 242, 0.3) 100%)",
            }}
          ></div>
          <div
            className="absolute w-80 h-80 rounded-full -bottom-28 -left-28 backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(135deg, rgba(237, 244, 242, 0.3) 0%, rgba(202, 220, 252, 0.3) 100%)",
            }}
          ></div>
        </div>

        {/* Company Logo and Name */}
        <div className="absolute left-[25%] top-[120px] text-white flex flex-col items-center">
          <div className="relative w-[90px] h-[90px] flex items-center justify-center ">
            <div className="absolute inset-0 blur-md bg-white/30 rounded-full"></div>
            <div>
              <Logo
                alt="Company Logo"
                showName={true}
                imageClassName="relative drop-shadow-2xl transform hover:scale-105 transition-transform duration-300 mt-16"
                imageStyle={{
                  filter:
                    "brightness(1.05) drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                }}
                textClassName="text-2xl font-semibold text-white drop-shadow-xl tracking-wide mt-4"
                textStyle={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              />
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div
          className="absolute right-10 top-1/2 transform -translate-y-1/2 w-[380px]"
          style={{
            filter: "drop-shadow(0 25px 25px rgba(115, 145, 206, 0.15))",
          }}
        >
          <div className="relative">
            {/* Card with shadow and border effect */}
            <div
              className="absolute inset-0 rounded-[20px] bg-white/50 backdrop-blur-xl"
              style={{
                boxShadow:
                  "0 15px 35px rgba(115, 145, 206, 0.2), 0 5px 15px rgba(115, 145, 206, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
              }}
            ></div>

            {/* Main card content */}
            <div
              className="relative bg-white rounded-[20px] p-8"
              style={{
                boxShadow:
                  "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 15px 35px rgba(115, 145, 206, 0.15), 0 5px 15px rgba(115, 145, 206, 0.1)",
              }}
            >
              <div className="text-center mb-8">
                <h2
                  className="text-[28px] font-bold"
                  style={{
                    color: "#4A6CA2",
                    textShadow: "0 2px 4px rgba(115, 145, 206, 0.1)",
                  }}
                >
                  Welcome Back
                </h2>
                <p className="text-sm mt-2" style={{ color: "#7391CE" }}>
                  Sign in to continue to your account
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#4A6CA2" }}
                  >
                    Username
                  </label>
                  <input
                    id="email"
                    type="text"
                    required
                    placeholder="Enter your username"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-xl py-3 px-4 w-full text-sm focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{
                      backgroundColor: "#EDF4F2",
                      borderColor: "#CADCFC",
                      boxShadow: "inset 0 2px 4px rgba(202, 220, 252, 0.1)",
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#4A6CA2" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={show ? "text" : "password"}
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      name="password"
                      className="border rounded-xl py-3 px-4 w-full text-sm focus:outline-none focus:ring-2 transition-all duration-200"
                      style={{
                        backgroundColor: "#EDF4F2",
                        borderColor: "#CADCFC",
                        boxShadow: "inset 0 2px 4px rgba(202, 220, 252, 0.1)",
                      }}
                    />
                    <span
                      className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer hover:text-blue-600"
                      style={{ color: "#7391CE" }}
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

                

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:opacity-90 transform hover:-translate-y-0.5"
                    }`}
                    style={{
                      background:
                        "linear-gradient(135deg, #7391CE 0%, #4A6CA2 100%)",
                      boxShadow: "0 4px 15px rgba(115, 145, 206, 0.3)",
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
