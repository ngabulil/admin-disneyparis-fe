import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Swal from "sweetalert2";

import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicleService";

const VehiclePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    bookingType: "",
    vehicleType: "",
    maxPassenger: "",
    maxUnit: "",
    maxStroller: "",
    photo: "",
  });

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch {
      Swal.fire("Error", "Failed to load vehicles", "error");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenCreate = () => {
    setEditData(null);
    setForm({
      name: "",
      bookingType: "",
      vehicleType: "",
      maxPassenger: "",
      maxUnit: "",
      maxStroller: "",
      photo: "",
    });
    setOpenModal(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setForm({
      name: data.name || "",
      bookingType: data.bookingType || "",
      vehicleType: data.vehicleType || "",
      maxPassenger: data.maxPassenger || "",
      maxUnit: data.maxUnit || "",
      maxStroller: data.maxStroller || "",
      photo: data.photo || "",
    });
    setOpenModal(true);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      Swal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (editData) {
        await updateVehicle(editData._id, form);
      } else {
        await createVehicle(form);
      }

      Swal.fire("Success", "Vehicle saved", "success");

      setOpenModal(false);
      fetchVehicles();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete vehicle?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteVehicle(id);

      Swal.fire("Deleted!", "", "success");

      fetchVehicles();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight="bold">
          Vehicle Management
        </Typography>

        <Button variant="contained" onClick={handleOpenCreate}>
          Add Vehicle
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Photo</TableCell>
                <TableCell>Booking</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Passenger</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Stroller</TableCell>
                <TableCell width="150">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {vehicles.map((v, index) => (
                <TableRow key={v._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>
                    {v.photo ? (
                      <img
                        src={v.photo}
                        alt={v.name}
                        style={{
                          width: 80,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{v.bookingType}</TableCell>
                  <TableCell>{v.vehicleType}</TableCell>
                  <TableCell>{v.maxPassenger}</TableCell>
                  <TableCell>{v.maxUnit}</TableCell>
                  <TableCell>{v.maxStroller}</TableCell>

                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(v)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton color="error" onClick={() => handleDelete(v._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>{editData ? "Edit Vehicle" : "Create Vehicle"}</DialogTitle>

        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField
            label="Vehicle Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
          />

          <TextField
            label="Photo URL"
            value={form.photo}
            onChange={(e) => handleChange("photo", e.target.value)}
            fullWidth
            placeholder="https://example.com/car.jpg"
          />

          <TextField
            select
            label="Booking Type"
            value={form.bookingType}
            onChange={(e) => handleChange("bookingType", e.target.value)}
            fullWidth
          >
            <MenuItem value="economy">Economy</MenuItem>
            <MenuItem value="business">Business</MenuItem>
          </TextField>

          <TextField
            select
            label="Vehicle Type"
            value={form.vehicleType}
            onChange={(e) => handleChange("vehicleType", e.target.value)}
            fullWidth
          >
            <MenuItem value="car">Car</MenuItem>
            <MenuItem value="van">Van</MenuItem>
          </TextField>

          <TextField
            label="Max Passenger"
            type="number"
            value={form.maxPassenger}
            onChange={(e) => handleChange("maxPassenger", e.target.value)}
            fullWidth
          />

          <TextField
            label="Max Unit"
            type="number"
            value={form.maxUnit}
            onChange={(e) => handleChange("maxUnit", e.target.value)}
            fullWidth
          />

          <TextField
            label="Max Stroller"
            type="number"
            value={form.maxStroller}
            onChange={(e) => handleChange("maxStroller", e.target.value)}
            fullWidth
          />

          {form.photo ? (
            <div>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Preview
              </Typography>
              <img
                src={form.photo}
                alt="Vehicle Preview"
                style={{
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />
            </div>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VehiclePage;