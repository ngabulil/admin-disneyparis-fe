import { GET, POST, PUT, DELETE } from "./api";

export const getPricingVehicles = async () => {
  try {
    const res = await GET("/pricingVehicle");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createPricingVehicle = async (data) => {
  try {
    const res = await POST("/pricingVehicle", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updatePricingVehicle = async (id, data) => {
  try {
    const res = await PUT(`/pricingVehicle/${id}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deletePricingVehicle = async (id) => {
  try {
    const res = await DELETE(`/pricingVehicle/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
