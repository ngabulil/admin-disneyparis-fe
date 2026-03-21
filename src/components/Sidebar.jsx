import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
    });

    if (!confirm.isConfirmed) return;

    Cookies.remove("token");

    Swal.fire({
      icon: "success",
      title: "Logged out",
      timer: 1000,
      showConfirmButton: false,
    });

    setTimeout(() => navigate("/"), 1000);
  };

  const navStyle = ({ isActive }) =>
    `px-4 py-2 rounded transition font-medium ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #e5e5e5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold" className="px-4 py-4">
          Admin Panel
        </Typography>

        <nav className="flex flex-col gap-2 px-3">
          <NavLink to="/location" className={navStyle}>
            Location
          </NavLink>

          <NavLink to="/vehicle" className={navStyle}>
            Vehicle
          </NavLink>

          <NavLink to="/hotel" className={navStyle}>
            Hotel
          </NavLink>

          <NavLink to="/terminal" className={navStyle}>
            Terminal
          </NavLink>

          <NavLink to="/trip" className={navStyle}>
            Trip
          </NavLink>

          <NavLink to="/pricing-vehicle" className={navStyle}>
            Pricing
          </NavLink>

          <NavLink to="/promo" className={navStyle}>
            Promo
          </NavLink>

          <NavLink to="/booking" className={navStyle}>
            Booking
          </NavLink>
        </nav>
      </Box>

      <Box className="p-4">
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
