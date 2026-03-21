import { GET, POST, PUT, DELETE } from "./api";

export const getHotels = async () => {
  try {
    const res = await GET("/hotel");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createHotel = async (data) => {
  try {
    const res = await POST("/hotel", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateHotel = async (id, data) => {
  try {
    const res = await PUT(`/hotel/${id}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteHotel = async (id) => {
  try {
    const res = await DELETE(`/hotel/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
