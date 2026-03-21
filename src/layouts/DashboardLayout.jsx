import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <Box className="flex">

      <Sidebar />

      <Box className="flex-1 bg-gray-50 min-h-screen">
        <Outlet />
      </Box>

    </Box>
  );
};

export default DashboardLayout;
