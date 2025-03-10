import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../msalConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Custom login using backend proxy with ROPC flow
  // const handleCustomLogin = async (e) => {
  //   e.preventDefault();
  //   if (!credentials.email || !credentials.password) {
  //     toast.error("Please provide both email and password.");
  //     return;
  //   }
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch("http://localhost:3001/api/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         email: credentials.email,
  //         password: credentials.password,
  //       }),
  //     });
  //     const data = await response.json();
  //     if (response.ok && data.access_token) {
  //       if (data.id_token) {
  //         try {
  //           const decoded = jwtDecode(data.id_token);
  //           const account = {
  //             homeAccountId: decoded.oid || decoded.sub,
  //             environment: "login.microsoftonline.com",
  //             tenantId: decoded.tid,
  //             username: decoded.preferred_username || credentials.email,
  //             name: decoded.name,
  //           };
  //           instance.setActiveAccount(account);
  //         } catch (err) {
  //           console.error("Error decoding id_token", err);
  //           toast.error("Custom login error: Token processing failed.");
  //         }
  //       }
  //       localStorage.setItem("accessToken", data.access_token);
  //       toast.success("Custom login successful!");
  //       navigate("/dashboard");
  //     } else {
  //       toast.error(
  //         "Custom login failed: " + (data.error_description || data.error)
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Custom login error:", error);
  //     toast.error("Custom login error: " + error.message);
  //   }
  //   setIsLoading(false);
  // };

  const handleCustomLogin = () => {
    toast.info("Please use Azure AD login");
  };

  // Azure Login using MSAL
  const handleAzureLogin = async (e) => {
    e.preventDefault();
    const request = { ...loginRequest, loginHint: credentials.email };
    instance
      .loginPopup(request)
      .then((res) => {
        instance.setActiveAccount(res.account);
        toast.success("Azure AD login successful!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Azure AD login error:", error);
        toast.error("Azure AD login failed.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f172a] to-[#4f46e5]">
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md border border-white/50">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Sign In
        </h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-white text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              placeholder="you@example.com"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-white/70"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-white text-sm font-bold mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                placeholder="********"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-white/70"
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a10.05 10.05 0 012.096-3.243M6.34 6.34A9.969 9.969 0 0112 5c4.478 0 8.269 2.943 9.543 7a10.05 10.05 0 01-1.248 2.453M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              onClick={handleCustomLogin}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={handleAzureLogin}
              className="w-full flex items-center justify-center bg-white border border-blue-500 text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <span className="ml-2">Login with</span>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg"
                alt="Azure Logo"
                className="ms-2 w-[60px]"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
