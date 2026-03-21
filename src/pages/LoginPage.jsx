import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
} from "@mui/material";
import Swal from "sweetalert2";
import { loginAdmin } from "../services/authService";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      Swal.fire({
        title: "Logging in...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await loginAdmin(form);

      Cookies.set("token", res.data.token, { expires: 1 });

      Swal.fire({
        icon: "success",
        title: "Login success",
        timer: 1200,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/location"), 1200);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: err.message || "Username or password wrong",
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: "100%", p: 2 }}>
        <CardContent>

          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            mb={3}
          >
            Admin Login
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >

            <TextField
              label="Username"
              fullWidth
              value={form.username}
              onChange={(e) =>
                handleChange("username", e.target.value)
              }
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={form.password}
              onChange={(e) =>
                handleChange("password", e.target.value)
              }
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
            >
              Login
            </Button>

          </Box>

        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;