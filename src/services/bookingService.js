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
export const downloadAdminPdf = async (id) => {
  try {
    const res = await GET(`/booking/download/admin-pdf/${id}`, {
      responseType: "blob", // WAJIB
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `booking-admin-${id}.pdf`);

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Download admin PDF gagal:", err);
    throw err.response?.data || err;
  }
};

// DOWNLOAD PDF CUSTOMER
export const downloadCustomerPdf = async (id) => {
  try {
    const res = await GET(`/booking/download/customer-pdf/${id}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `booking-customer-${id}.pdf`);

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Download customer PDF gagal:", err);
    throw err.response?.data || err;
  }
};