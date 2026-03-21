import { GET, POST, PUT, DELETE } from "./api";

export const getPromos = async () => {
  try {
    const res = await GET("/promo");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createPromo = async (data) => {
  try {
    const res = await POST("/promo", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updatePromo = async (id, data) => {
  try {
    const res = await PUT(`/promo/${id}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deletePromo = async (id) => {
  try {
    const res = await DELETE(`/promo/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
