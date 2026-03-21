import { GET, PUT, DELETE } from "./api";

// GET ALL
export const getBookings = async () => {
  try {
    const res = await GET("/booking");
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// UPDATE STATUS
export const updateBooking = async (id, data) => {
  try {
    const res = await PUT(`/booking/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// DELETE
export const deleteBooking = async (id) => {
  try {
    const res = await DELETE(`/booking/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// GET BY ID
export const getBookingById = async (id) => {
  try {
    const res = await GET(`/booking/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// DOWNLOAD PDF ADMIN
export const downloadAdminPdf = (id) => {
  window.open(`/api/booking/download/admin-pdf/${id}`, "_blank");
};

// DOWNLOAD PDF CUSTOMER
export const downloadCustomerPdf = (id) => {
  window.open(`/api/booking/download/customer-pdf/${id}`, "_blank");
};