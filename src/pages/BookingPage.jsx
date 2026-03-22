import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Card,
  CardContent,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Swal from "sweetalert2";

import {
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  downloadAdminPdf,
  downloadCustomerPdf,
} from "../services/bookingService";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // ================= FETCH =================
  const fetchBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data);
    } catch {
      Swal.fire("Error", "Failed load booking", "error");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ================= MENU =================
  const handleMenuOpen = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelected(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // ================= STATUS FLOW =================
  const getNextStatus = (status) => {
    switch (status) {
      case "pending":
        return "confirmed";
      case "confirmed":
        return "completed";
      default:
        return null;
    }
  };

  // ================= VIEW DETAIL =================
  const handleViewDetail = async (id) => {
    try {
      const res = await getBookingById(id);
      setDetailData(res.data);
      setOpenDetail(true);
      handleMenuClose();
    } catch {
      Swal.fire("Error", "Failed load detail", "error");
    }
  };

  // ================= UPDATE STATUS =================
  const handleUpdateStatus = async (newStatus) => {
    const confirm = await Swal.fire({
      title: `Update to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateBooking(selected._id, { statusTrip: newStatus });

      Swal.fire("Success", "Updated!", "success");
      fetchBookings();
    } catch {
      Swal.fire("Error", "Failed update", "error");
    }
  };

  // ================= CANCEL =================
  const handleCancel = async () => {
    const confirm = await Swal.fire({
      title: "Cancel booking?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await updateBooking(selected._id, { statusTrip: "cancelled" });
    fetchBookings();
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Delete booking?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await deleteBooking(selected._id);
    fetchBookings();
  };

  // ================= STATUS COLOR =================
  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // ================= RENDER =================
  return (
    <Container className="py-8">
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Booking Management
      </Typography>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Passengers</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell width="100">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.map((b, i) => (
                <TableRow key={b._id}>
                  <TableCell>{i + 1}</TableCell>

                  <TableCell>{b.fullName}</TableCell>

                  <TableCell>
                    {b.pickupLocation?.name} → {b.dropoffLocation?.name}
                  </TableCell>

                  <TableCell>{b.vehicleId?.name}</TableCell>

                  <TableCell>{b.passengers}</TableCell>

                  {/* <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(b.totalPrice)}
                  </TableCell> */}
                  <TableCell>{b.totalPrice}</TableCell>

                  <TableCell>
                    <Chip
                      label={b.statusTrip}
                      color={statusColor(b.statusTrip)}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={b.statusPayment ? "Paid" : "Unpaid"}
                      color={b.statusPayment ? "success" : "warning"}
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, b)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= ACTION MENU ================= */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewDetail(selected?._id)}>
          <VisibilityIcon className="mr-2" /> Detail
        </MenuItem>

        {getNextStatus(selected?.statusTrip) && (
          <MenuItem
            onClick={() =>
              handleUpdateStatus(getNextStatus(selected.statusTrip))
            }
          >
            Update to {getNextStatus(selected.statusTrip)}
          </MenuItem>
        )}

        {selected &&
          selected.statusTrip !== "cancelled" &&
          selected.statusTrip !== "completed" && (
            <MenuItem onClick={handleCancel}>Cancel Booking</MenuItem>
          )}

        <MenuItem onClick={() => downloadAdminPdf(selected?._id)}>
          Download Admin PDF
        </MenuItem>

        <MenuItem onClick={() => downloadCustomerPdf(selected?._id)}>
          Download Customer PDF
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
          Delete
        </MenuItem>
      </Menu>

      {/* ================= DETAIL MODAL ================= */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Booking Detail</DialogTitle>

        <DialogContent>
          {detailData && (
            <div className="grid grid-cols-2 gap-4">
              <Typography>
                <b>Name:</b> {detailData.fullName}
              </Typography>
              <Typography>
                <b>Email:</b> {detailData.email}
              </Typography>

              <Typography>
                <b>Phone:</b> {detailData.phoneNumber}
              </Typography>
              <Typography>
                <b>Passengers:</b> {detailData.passengers}
              </Typography>

              <Typography>
                <b>Route:</b> {detailData.pickupLocation?.name} →{" "}
                {detailData.dropoffLocation?.name}
              </Typography>

              <Typography>
                <b>Vehicle:</b> {detailData.vehicleId?.name}
              </Typography>

              <Typography>
                <b>Roundtrip:</b> {detailData.roundtrip ? "Yes" : "No"}
              </Typography>

              <Typography>
                <b>Status:</b>{" "}
                <Chip
                  label={detailData.statusTrip}
                  color={statusColor(detailData.statusTrip)}
                />
              </Typography>

              <Typography>
                <b>Payment:</b>{" "}
                <Chip
                  label={detailData.statusPayment ? "Paid" : "Unpaid"}
                  color={detailData.statusPayment ? "success" : "warning"}
                />
              </Typography>

              {/* <Typography>
                <b>Total:</b>{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(detailData.totalPrice)}
              </Typography> */}
              <Typography>
                <b>Total:</b> {detailData.totalPrice}
              </Typography>
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDetail(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingPage;
