import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import DashBoard from "./DashBoard.jsx";
import Jobs from "./Jobs.jsx";
import "./index.css"; 



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Jobs/>}/>
        <Route path="/jobs" element={<DashBoard/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
