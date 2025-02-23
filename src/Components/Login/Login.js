import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../msalConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNormalLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      toast.success("Normal Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Please provide email and password.");
    }
  };

  const handleAzureLogin = (e) => {
    e.preventDefault();
    const request = { ...loginRequest, loginHint: email };
    instance
      .loginPopup(request)
      .then((res) => {
        instance.setActiveAccount(res.account);
        toast.success("Azure Login successful!");
        console.log("login", res);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Azure Login error: ", error);
        toast.error("Azure Login failed.");
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-white/70"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-white text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-white/70"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              onClick={handleNormalLogin}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleAzureLogin}
              className="w-full flex items-center justify-center bg-white border border-blue-500 text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg"
                alt="Azure Logo"
                className="w-[60px]"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
