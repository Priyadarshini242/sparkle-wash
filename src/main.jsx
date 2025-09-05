import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import DashBoard from "./DashBoard.jsx";

import DashBoardWelcome from "./components/DashBoardWelcome.jsx";

import DashBoardEarning from "./components/DashBoardEarning.jsx";
import ProfileDashBoard from "./components/ProfileDashBoard.jsx";

import Jobs from "./Jobs.jsx";
import "./index.css"; 



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />}/>
        <Route path="/dashboard" element={<DashBoardWelcome/>}/>
 
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<DashBoard/>}/>
        <Route path="/earning" element={<DashBoardEarning/>}/>
        <Route path="/profile" element={<ProfileDashBoard/>}/>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
