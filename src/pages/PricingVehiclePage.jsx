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
  getPricingVehicles,
  createPricingVehicle,
  updatePricingVehicle,
  deletePricingVehicle,
} from "../services/pricingVehicleService";

import { getTrips } from "../services/tripService";
import { getVehicles } from "../services/vehicleService";

const PricingVehiclePage = () => {
  const [pricing, setPricing] = useState([]);
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    trip: "",
    vehicle: "",
    price: "",
  });

  const fetchPricing = async () => {
    try {
      const res = await getPricingVehicles();
      setPricing(res.data);
    } catch {
      Swal.fire("Error", "Failed to load pricing data", "error");
    }
  };

  const fetchTrips = async () => {
    const res = await getTrips();
    setTrips(res.data);
  };

  const fetchVehicles = async () => {
    const res = await getVehicles();
    setVehicles(res.data);
  };

  useEffect(() => {
    fetchPricing();
    fetchTrips();
    fetchVehicles();
  }, []);

  const handleOpenCreate = () => {
    setEditData(null);
    setForm({
      trip: "",
      vehicle: "",
      price: "",
    });
    setOpenModal(true);
  };

  const handleEdit = (data) => {
    setEditData(data);

    setForm({
      trip: data.trip?._id,
      vehicle: data.vehicle?._id,
      price: data.price,
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
    if (!form.trip || !form.vehicle || !form.price) {
      Swal.fire("Warning", "All fields required", "warning");
      return;
    }

    try {
      Swal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (editData) {
        await updatePricingVehicle(editData._id, {
          price: form.price,
        });
      } else {
        await createPricingVehicle(form);
      }

      Swal.fire("Success", "Pricing saved", "success");

      setOpenModal(false);
      fetchPricing();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete pricing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deletePricingVehicle(id);

      Swal.fire("Deleted!", "", "success");

      fetchPricing();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <Container className="py-8">

      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight="bold">
          Pricing Vehicle Management
        </Typography>

        <Button variant="contained" onClick={handleOpenCreate}>
          Add Pricing
        </Button>
      </div>

      <Card>
        <CardContent>

          <Table>

            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Trip</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Price</TableCell>
                <TableCell width="150">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {pricing.map((item, index) => (
                <TableRow key={item._id}>

                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    {item.trip?.pickupLocation?.name} →{" "}
                    {item.trip?.dropoffLocation?.name}
                  </TableCell>

                  <TableCell>
                    {item.vehicle?.name}
                  </TableCell>

                  <TableCell>
                    {item.price}
                  </TableCell>

                  <TableCell>

                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(item)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item._id)}
                    >
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

        <DialogTitle>
          {editData ? "Edit Pricing" : "Create Pricing"}
        </DialogTitle>

        <DialogContent className="flex flex-col gap-4 mt-2">

          {!editData && (
            <>
              <TextField
                select
                label="Trip"
                value={form.trip}
                onChange={(e) =>
                  handleChange("trip", e.target.value)
                }
                fullWidth
              >
                {trips.map((trip) => (
                  <MenuItem key={trip._id} value={trip._id}>
                    {trip.pickupLocation?.name} →{" "}
                    {trip.dropoffLocation?.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Vehicle"
                value={form.vehicle}
                onChange={(e) =>
                  handleChange("vehicle", e.target.value)
                }
                fullWidth
              >
                {vehicles.map((v) => (
                  <MenuItem key={v._id} value={v._id}>
                    {v.name} ({v.vehicleType})
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}

          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              handleChange("price", e.target.value)
            }
            fullWidth
          />

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>

      </Dialog>

    </Container>
  );
};

export default PricingVehiclePage;
