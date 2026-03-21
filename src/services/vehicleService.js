import { GET, POST, PUT, DELETE } from "./api";

export const getVehicles = async () => {
  try {
    const res = await GET("/vehicle");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createVehicle = async (data) => {
  try {
    const res = await POST("/vehicle", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateVehicle = async (id, data) => {
  try {
    const res = await PUT(`/vehicle/${id}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteVehicle = async (id) => {
  try {
    const res = await DELETE(`/vehicle/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
