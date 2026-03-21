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
  getTerminals,
  createTerminal,
  updateTerminal,
  deleteTerminal,
} from "../services/terminalService";

import { getAirportLocations } from "../services/locationService";

const TerminalPage = () => {
  const [terminals, setTerminals] = useState([]);
  const [locations, setLocations] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
  });

  const fetchTerminals = async () => {
    try {
      const res = await getTerminals();
      setTerminals(res.data);
    } catch {
      Swal.fire("Error", "Failed to load terminals", "error");
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await getAirportLocations();
      setLocations(res);
    } catch {
      Swal.fire("Error", "Failed to load airport locations", "error");
    }
  };

  useEffect(() => {
    fetchTerminals();
    fetchLocations();
  }, []);

  const handleOpenCreate = () => {
    setEditData(null);
    setForm({
      name: "",
      location: "",
    });
    setOpenModal(true);
  };

  const handleEdit = (data) => {
    setEditData(data);

    setForm({
      name: data.name,
      location: data.location?._id,
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
    if (!form.name || !form.location) {
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
        await updateTerminal(editData._id, form);
      } else {
        await createTerminal(form);
      }

      Swal.fire("Success", "Terminal saved", "success");

      setOpenModal(false);
      fetchTerminals();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete terminal?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteTerminal(id);

      Swal.fire("Deleted!", "", "success");

      fetchTerminals();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <Container className="py-8">

      <div className="flex justify-between items-center mb-6">

        <Typography variant="h5" fontWeight="bold">
          Terminal Management
        </Typography>

        <Button variant="contained" onClick={handleOpenCreate}>
          Add Terminal
        </Button>

      </div>

      <Card>
        <CardContent>

          <Table>

            <TableHead>
              <TableRow>
                <TableCell width="80">No</TableCell>
                <TableCell>Terminal Name</TableCell>
                <TableCell>Airport</TableCell>
                <TableCell width="150">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {terminals.map((terminal, index) => (
                <TableRow key={terminal._id}>

                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{terminal.name}</TableCell>

                  <TableCell>
                    {terminal.location?.name}
                  </TableCell>

                  <TableCell>

                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(terminal)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(terminal._id)}
                    >
                      <DeleteIcon />
                    </IconButton>

                  </TableCell>

                </TableRow>
              ))}

              {terminals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No terminals found
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
          {editData ? "Edit Terminal" : "Create Terminal"}
        </DialogTitle>

        <DialogContent className="flex flex-col gap-4 mt-2">

          <TextField
            label="Terminal Name"
            value={form.name}
            onChange={(e) =>
              handleChange("name", e.target.value)
            }
            fullWidth
          />

          <TextField
            select
            label="Airport Location"
            value={form.location}
            onChange={(e) =>
              handleChange("location", e.target.value)
            }
            fullWidth
          >

            {locations.map((loc) => (
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

export default TerminalPage;
