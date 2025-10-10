import { useState, useEffect } from 'react';
import React from "react";
import AdminLogin from "./components/AdminLogin";
import './App.css';
import { Link } from "react-router-dom";

function Login() {
  const getUser = () => {
  fetch(`${import.meta.env.VITE_API_URL}/getUser`)   // ✅ Correct
    .then(res => res.json())
    .then(json => {
      setUser(json.data)
      setMessage(json.message)
    })
    .catch(err => console.error("Error:", err));
}



  return (
    <div className="flex h-screen w-screen overflow-hidden">
      
<div className="flex flex-col justify-center items-center w-1/2 min-h-screen bg-blue-600 p-6">
  {/* Logo + Title */}
  <div className="flex items-center mb-12">
    <div className="flex items-center mb-38">
    <svg
      className="w-18 h-25 text-white mr-2"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2 C9 6.2 6 9.6 6 13.2C6 16.9 8.9 20 12.5 20C16.1 20 19 16.9 19 13.2C19 9.6 15 6.2 12 2Z" />
    </svg>
    <h1 className="text-2xl font-bold text-white">SparkleWash</h1>
  </div>
  </div>

  {/* Car Icon */}
  <img src="/Car.png" alt="Logo" className="w-100 h-50" />

  {/* Subtitle */}
  <p className="text-xl font-semibold text-white mb-6 text-center">
    Professional Car &amp; Bike Washing Services
  </p>

  {/* Testimonial Card */}
  <div className="bg-blue-500 bg-opacity-30 rounded-lg shadow-lg p-6 max-w-xl text-center">
    <p className="italic text-white mb-2">
      "SparkleWash always leaves my vehicles looking brand new. The staff is
      professional and thorough!"
    </p>
    <p className="text-white text-right">- Satisfied Customer</p>
  </div>
</div>

      {/* White container */}
        <div className="flex flex-col justify-center items-center w-1/2 min-h-screen bg-white-600 p-6">  


       
         <AdminLogin/>
   
        </div>
    </div>
  )
}

export default Login;