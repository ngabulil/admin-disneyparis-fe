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
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} from "../services/tripService";

import { getLocations } from "../services/locationService";

const TripPage = () => {
  const [trips, setTrips] = useState([]);
  const [locations, setLocations] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
  });

  const fetchTrips = async () => {
    try {
      const res = await getTrips();
      setTrips(res.data);
    } catch {
      Swal.fire("Error", "Failed to load trips", "error");
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await getLocations();
      setLocations(res.data);
    } catch {
      Swal.fire("Error", "Failed to load locations", "error");
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchLocations();
  }, []);

  const handleOpenCreate = () => {
    setEditData(null);
    setForm({
      pickupLocation: "",
      dropoffLocation: "",
    });
    setOpenModal(true);
  };

  const handleEdit = (data) => {
    setEditData(data);

    setForm({
      pickupLocation: data.pickupLocation?._id,
      dropoffLocation: data.dropoffLocation?._id,
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
    if (!form.pickupLocation || !form.dropoffLocation) {
      Swal.fire("Warning", "All fields required", "warning");
      return;
    }

    if (form.pickupLocation === form.dropoffLocation) {
      Swal.fire(
        "Warning",
        "Pickup and dropoff locations cannot be the same",
        "warning"
      );
      return;
    }

    try {
      Swal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (editData) {
        await updateTrip(editData._id, form);
      } else {
        await createTrip(form);
      }

      Swal.fire("Success", "Trip saved", "success");

      setOpenModal(false);
      fetchTrips();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete trip?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteTrip(id);

      Swal.fire("Deleted!", "", "success");

      fetchTrips();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <Container className="py-8">

      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight="bold">
          Trip Management
        </Typography>

        <Button variant="contained" onClick={handleOpenCreate}>
          Add Trip
        </Button>
      </div>

      <Card>
        <CardContent>

          <Table>

            <TableHead>
              <TableRow>
                <TableCell width="80">No</TableCell>
                <TableCell>Pickup Location</TableCell>
                <TableCell>Dropoff Location</TableCell>
                <TableCell width="150">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {trips.map((trip, index) => (
                <TableRow key={trip._id}>

                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    {trip.pickupLocation?.name}
                  </TableCell>

                  <TableCell>
                    {trip.dropoffLocation?.name}
                  </TableCell>

                  <TableCell>

                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(trip)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(trip._id)}
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

      {/* MODAL */}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>

        <DialogTitle>
          {editData ? "Edit Trip" : "Create Trip"}
        </DialogTitle>

        <DialogContent className="flex flex-col gap-4 mt-2">

          <TextField
            select
            label="Pickup Location"
            value={form.pickupLocation}
            onChange={(e) =>
              handleChange("pickupLocation", e.target.value)
            }
            fullWidth
          >
            {locations.map((loc) => (
              <MenuItem key={loc._id} value={loc._id}>
                {loc.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Dropoff Location"
            value={form.dropoffLocation}
            onChange={(e) =>
              handleChange("dropoffLocation", e.target.value)
            }
            fullWidth
          >
            {locations
              .filter((loc) => loc._id !== form.pickupLocation)
              .map((loc) => (
                <MenuItem key={loc._id} value={loc._id}>
                  {loc.name}
                </MenuItem>
              ))}
          </TextField>

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

export default TripPage;
