import { GET, POST, PUT, DELETE } from "./api";

export const getTerminals = async () => {
  try {
    const res = await GET("/terminal");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createTerminal = async (data) => {
  try {
    const res = await POST("/terminal", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateTerminal = async (id, data) => {
  try {
    const res = await PUT(`/terminal/${id}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteTerminal = async (id) => {
  try {
    const res = await DELETE(`/terminal/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
