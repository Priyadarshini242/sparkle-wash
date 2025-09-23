import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import DashBoard from "./DashBoard.jsx";
import DashBoardWelcome from "./components/DashBoardWelcome.jsx";
import DashBoardEarning from "./components/DashBoardEarning.jsx";
import ProfileDashBoard from "./components/ProfileDashBoard.jsx";
import SidebarAdmin from "./components/SidebarAdmin.jsx";
import SidebarDashboard from "./components/SidebarDashboard.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard"element={<PrivateRoute> <DashBoardWelcome /> </PrivateRoute>}/>
        <Route path="/jobs"element={ <PrivateRoute> <DashBoard /> </PrivateRoute> }/>
        <Route path="/earning"element={ <PrivateRoute> <DashBoardEarning /> </PrivateRoute> } />
        <Route path="/profile"element={ <PrivateRoute>  <ProfileDashBoard /> </PrivateRoute>  }/>

        {/* Admin Pages */}
        <Route
          path="/side" element={  <SidebarDashboard />  }  />
        <Route path="/admin" element={  <SidebarAdmin />  } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
