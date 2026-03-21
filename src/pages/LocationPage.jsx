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
  Card,
  CardContent,
  MenuItem,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Swal from "sweetalert2";

import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../services/locationService";

const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    locationType: "",
  });

  const fetchLocations = async () => {
    try {
      const res = await getLocations();
      setLocations(res.data);
    } catch {
      Swal.fire("Error", "Failed to load locations", "error");
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleOpenCreate = () => {
    setEditData(null);
    setForm({
      name: "",
      locationType: "",
    });
    setOpenModal(true);
  };

  const handleEdit = (data) => {
    setEditData(data);

    setForm({
      name: data.name,
      locationType: data.locationType,
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
      if (!form.name || !form.locationType) {
        Swal.fire("Warning", "All fields required", "warning");
        return;
      }

      Swal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (editData) {
        await updateLocation(editData._id, form);
      } else {
        await createLocation(form);
      }

      Swal.fire("Success", "Location saved", "success");

      setOpenModal(false);
      fetchLocations();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete location?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteLocation(id);

      Swal.fire("Deleted!", "", "success");

      fetchLocations();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight="bold">
          Location Management
        </Typography>

        <Button variant="contained" onClick={handleOpenCreate}>
          Add Location
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="80">No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Location Type</TableCell>
                <TableCell width="150">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {locations.map((loc, index) => (
                <TableRow key={loc._id}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{loc.name}</TableCell>

                  <TableCell className="capitalize">
                    {loc.locationType}
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(loc)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(loc._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {locations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No locations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL */}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>
          {editData ? "Edit Location" : "Create Location"}
        </DialogTitle>

        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField
            label="Location Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Location Type"
            value={form.locationType}
            onChange={(e) =>
              handleChange("locationType", e.target.value)
            }
            fullWidth
          >
            <MenuItem value="airport">Airport</MenuItem>
            <MenuItem value="hotel">Hotel</MenuItem>
            <MenuItem value="place">Place</MenuItem>
          </TextField>
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

export default LocationPage;
