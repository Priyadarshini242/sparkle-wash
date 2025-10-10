// src/components/AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("allowNavigation");
}, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminId, password }),
      });
      const json = await res.json();
      console.log("Response", json);
      
      if (res.ok) {

       // Save JWT token
       localStorage.setItem("token", json.data.token);

       // (Optional) Save user details
       localStorage.setItem("user", JSON.stringify(json.data.user));

       // ✅ Allow navigation just this time
        
       sessionStorage.setItem("allowNavigation", "true");
       
      navigate("/dashboard", { replace: true });

      
      } else {
        setError(json.message || "Login failed");
      }
    } catch (error) {
      setError("Server error", error.message);
    }
  }


  


 return (
    <div className="max-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white  w-full-md p-10">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-1">
          Admin Login
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your credentials to access the admin dashboard
        </p>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin ID */}
          <div>
            <p className="text-start text-gray-700 font-medium">
              Admin ID
            </p>
            <div className="mt-2 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
              {/* mail icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.75 7.5l-9 6-9-6" />
                <path d="M3.75 6.75l8.88 5.55c.21.13.48.13.69 0l8.88-5.55" />
                <path d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5H4.5a2.25 2.25 0 01-2.25-2.25V6.75" />
              </svg>

              <input
                id="adminId"
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter your admin ID"
                className="ml-3 w-full placeholder-gray-400 text-gray-700 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <p className="text-start text-gray-700 font-medium">
              Password
            </p>
            <div className="mt-2 flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
              {/* lock icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3" />
                <path d="M3 12.75V19.5A2.25 2.25 0 005.25 21.75h13.5A2.25 2.25 0 0021 19.5v-6.75" />
              </svg>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="ml-3 w-full placeholder-gray-400 text-gray-700 outline-none"
              />

              {/* eye toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="ml-2 p-1 rounded hover:bg-gray-100"
              >
                {showPassword ? (
                  /* eye-off icon */
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A3 3 0 0113.42 13.42" />
                    <path d="M9.88 5.13A11.98 11.98 0 0121 12c-2.25 4.5-6.75 7.5-9.75 7.5a10.3 10.3 0 01-2.37-.28" />
                  </svg>
                ) : (
                  /* eye icon */
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.25 12c2.25-4.5 6.75-7.5 9.75-7.5s7.5 3 9.75 7.5c-2.25 4.5-6.75 7.5-9.75 7.5s-7.5-3-9.75-7.5z" />
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>Remember me</span>
            </label>

            <a href="#" className="text-indigo-500 hover:text-indigo-400 font-medium">
              Forgot Password?
            </a>
          </div>

          {/* Login button */}
          <button
             type={"submit"}
            className="px-4 py-2 bg-amber-400 text-black rounded-lg inline-block text-center w-full">
            Login
          </button>

          {/* Secure info */}
          <div className="flex items-center justify-center mt-1 text-gray-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3" />
              <path d="M3 12.75V19.5A2.25 2.25 0 005.25 21.75h13.5A2.25 2.25 0 0021 19.5v-6.75" />
            </svg>
            <span>Secure login with 256-bit encryption</span>
          </div>
          </form>

     
        
      </div>
    </div>
  );
}
