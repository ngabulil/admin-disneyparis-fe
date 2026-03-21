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
  Switch,
  FormControlLabel,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Swal from "sweetalert2";

import {
  getPromos,
  createPromo,
  updatePromo,
  deletePromo,
} from "../services/promoService";

import { getTrips } from "../services/tripService";

const PromoPage = () => {
  const [promos, setPromos] = useState([]);
  const [trips, setTrips] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    discount: "",
    promoCode: "",
    allowedTripId: "",
    allowedBookingType: "",
    roundtrip: false,
    isValid: true,
  });

  const fetchPromos = async () => {
    try {
      const res = await getPromos();
      setPromos(res.data);
    } catch {
      Swal.fire("Error", "Failed to load promos", "error");
    }
  };

  const fetchTrips = async () => {
    const res = await getTrips();
    setTrips(res.data);
  };

  useEffect(() => {
    fetchPromos();
    fetchTrips();
  }, []);

  const handleOpenCreate = () => {
    setEditData(null);
    setForm({
      discount: "",
      promoCode: "",
      allowedTripId: "",
      allowedBookingType: "",
      roundtrip: false,
      isValid: true,
    });
    setOpenModal(true);
  };

  const handleEdit = (data) => {
    setEditData(data);

    setForm({
      discount: data.discount,
      promoCode: data.promoCode,
      allowedTripId: data.allowedTripId?._id || "ALL",
      allowedBookingType: data.allowedBookingType || "ALL",
      roundtrip: data.roundtrip || false,
      isValid: data.isValid,
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
    if (!form.discount || !form.promoCode) {
      Swal.fire("Warning", "Discount and promo code required", "warning");
      return;
    }

    const payload = {
      ...form,
      allowedTripId: form.allowedTripId === "ALL" ? null : form.allowedTripId,
      allowedBookingType:
        form.allowedBookingType === "ALL" ? null : form.allowedBookingType,
    };

    try {
      Swal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (editData) {
        await updatePromo(editData._id, payload);
      } else {
        await createPromo(payload);
      }

      Swal.fire("Success", "Promo saved", "success");

      setOpenModal(false);
      fetchPromos();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete promo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deletePromo(id);

      Swal.fire("Deleted!", "", "success");

      fetchPromos();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight="bold">
          Promo Management
        </Typography>

        <Button variant="contained" onClick={handleOpenCreate}>
          Add Promo
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Promo Code</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Trip</TableCell>
                <TableCell>Booking Type</TableCell>
                <TableCell>Roundtrip</TableCell>
                <TableCell>Status</TableCell>
                <TableCell width="150">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {promos.map((promo, index) => (
                <TableRow key={promo._id}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{promo.promoCode}</TableCell>

                  <TableCell>{promo.discount}</TableCell>

                  <TableCell>
                    {promo.allowedTripId
                      ? `${promo.allowedTripId.pickupLocation?.name} → ${promo.allowedTripId.dropoffLocation?.name}`
                      : "All"}
                  </TableCell>

                  <TableCell>{promo.allowedBookingType || "All"}</TableCell>

                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        promo.roundtrip
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {promo.roundtrip ? "Roundtrip" : "One Way"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        promo.isValid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {promo.isValid ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(promo)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(promo._id)}
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
        <DialogTitle>{editData ? "Edit Promo" : "Create Promo"}</DialogTitle>

        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField
            label="Promo Code"
            value={form.promoCode}
            onChange={(e) => handleChange("promoCode", e.target.value)}
            fullWidth
          />

          <TextField
            label="Discount"
            type="number"
            value={form.discount}
            onChange={(e) => handleChange("discount", e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Allowed Trip"
            value={form.allowedTripId || "ALL"}
            onChange={(e) => handleChange("allowedTripId", e.target.value)}
            fullWidth
          >
            <MenuItem value="ALL">All Trips</MenuItem>

            {trips.map((trip) => (
              <MenuItem key={trip._id} value={trip._id}>
                {trip.pickupLocation?.name} → {trip.dropoffLocation?.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Booking Type"
            value={form.allowedBookingType || "ALL"}
            onChange={(e) => handleChange("allowedBookingType", e.target.value)}
            fullWidth
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="economy">Economy</MenuItem>
            <MenuItem value="business">Business</MenuItem>
          </TextField>

          <FormControlLabel
            control={
              <Switch
                checked={form.roundtrip}
                onChange={(e) => handleChange("roundtrip", e.target.checked)}
              />
            }
            label="Roundtrip Only"
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.isValid}
                onChange={(e) => handleChange("isValid", e.target.checked)}
              />
            }
            label="Promo Active"
          />
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

export default PromoPage;
