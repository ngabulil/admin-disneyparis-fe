import { GET, POST, PUT, DELETE } from "./api";

export const getTrips = async () => {
  try {
    const res = await GET("/trip");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createTrip = async (data) => {
  try {
    const res = await POST("/trip", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateTrip = async (id, data) => {
  try {
    const res = await PUT(`/trip/${id}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteTrip = async (id) => {
  try {
    const res = await DELETE(`/trip/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
