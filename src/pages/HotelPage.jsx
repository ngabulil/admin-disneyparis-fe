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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Swal from "sweetalert2";

import {
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
} from "../services/hotelService";

const HotelPage = () => {
  const [hotels, setHotels] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    name: "",
  });

  const fetchHotels = async () => {
    try {
      const res = await getHotels();
      setHotels(res.data);
    } catch {
      Swal.fire("Error", "Failed to load hotels", "error");
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleOpenCreate = () => {
    setEditData(null);
    setForm({ name: "" });
    setOpenModal(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setForm({
      name: data.name,
    });
    setOpenModal(true);
  };

  const handleChange = (value) => {
    setForm({
      name: value,
    });
  };

  const handleSubmit = async () => {
    if (!form.name) {
      Swal.fire("Warning", "Hotel name is required", "warning");
      return;
    }

    try {
      Swal.fire({
        title: "Saving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (editData) {
        await updateHotel(editData._id, form);
      } else {
        await createHotel(form);
      }

      Swal.fire("Success", "Hotel saved", "success");

      setOpenModal(false);
      fetchHotels();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete hotel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteHotel(id);

      Swal.fire("Deleted!", "", "success");

      fetchHotels();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <Container className="py-8">

      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight="bold">
          Hotel Management
        </Typography>

        <Button variant="contained" onClick={handleOpenCreate}>
          Add Hotel
        </Button>
      </div>

      <Card>
        <CardContent>

          <Table>

            <TableHead>
              <TableRow>
                <TableCell width="80">No</TableCell>
                <TableCell>Hotel Name</TableCell>
                <TableCell width="150">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {hotels.map((hotel, index) => (
                <TableRow key={hotel._id}>

                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{hotel.name}</TableCell>

                  <TableCell>

                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(hotel)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(hotel._id)}
                    >
                      <DeleteIcon />
                    </IconButton>

                  </TableCell>

                </TableRow>
              ))}

              {hotels.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No hotels found
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
          {editData ? "Edit Hotel" : "Create Hotel"}
        </DialogTitle>

        <DialogContent className="flex flex-col gap-4 mt-2">

          <TextField
            label="Hotel Name"
            value={form.name}
            onChange={(e) => handleChange(e.target.value)}
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

export default HotelPage;
