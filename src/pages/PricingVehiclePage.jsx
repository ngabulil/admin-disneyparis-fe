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
  Box,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

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
    try {
      const res = await getTrips();
      setTrips(res.data);
    } catch {
      Swal.fire("Error", "Failed to load trips", "error");
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data);
    } catch {
      Swal.fire("Error", "Failed to load vehicles", "error");
    }
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
      trip: data.trip?._id || "",
      vehicle: data.vehicle?._id || "",
      price: data.price || "",
    });

    setOpenModal(true);
  };

  const handleOpenDetail = (data) => {
    setDetailData(data);
    setOpenDetailModal(true);
  };

  const handleCloseDetail = () => {
    setOpenDetailModal(false);
    setDetailData(null);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getPassengerPriceList = (basePrice) => {
    const priceNumber = Number(basePrice) || 0;

    return Array.from({ length: 8 }, (_, index) => {
      const passenger = index + 1;
      let price = priceNumber;

      if (passenger >= 5) {
        price = priceNumber + (passenger - 4) * 5;
      }

      return {
        passenger,
        price,
      };
    });
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
          price: Number(form.price),
        });
      } else {
        await createPricingVehicle({
          ...form,
          price: Number(form.price),
        });
      }

      Swal.fire("Success", "Pricing saved", "success");

      setOpenModal(false);
      fetchPricing();
    } catch (err) {
      Swal.fire("Error", err?.message || "Failed", "error");
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

  const passengerDetails = getPassengerPriceList(detailData?.price);

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
                <TableCell>Price 1-4 Passenger</TableCell>
                <TableCell width="180">Action</TableCell>
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

                  <TableCell>{item.vehicle?.name}</TableCell>

                  <TableCell>{item.price}</TableCell>

                  <TableCell>
                    <IconButton
                      color="info"
                      onClick={() => handleOpenDetail(item)}
                    >
                      <VisibilityIcon />
                    </IconButton>

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

              {pricing.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No pricing data found
                  </TableCell>
                </TableRow>
              )}
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
                onChange={(e) => handleChange("trip", e.target.value)}
                fullWidth
              >
                {trips.map((trip) => (
                  <MenuItem key={trip._id} value={trip._id}>
                    {trip.pickupLocation?.name} → {trip.dropoffLocation?.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Vehicle"
                value={form.vehicle}
                onChange={(e) => handleChange("vehicle", e.target.value)}
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
            label="Price 1-4 Passenger"
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDetailModal}
        onClose={handleCloseDetail}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detail Pricing Vehicle</DialogTitle>

        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Trip
            </Typography>
            <Typography>
              {detailData?.trip?.pickupLocation?.name} →{" "}
              {detailData?.trip?.dropoffLocation?.name}
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Vehicle
            </Typography>
            <Typography>{detailData?.vehicle?.name}</Typography>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Passenger</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {passengerDetails.map((item) => (
                <TableRow key={item.passenger}>
                  <TableCell>
                    {item.passenger} Passenger
                  </TableCell>
                  <TableCell>{item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDetail}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PricingVehiclePage;