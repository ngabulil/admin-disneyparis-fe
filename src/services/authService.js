import { POST } from "./api";

export const loginAdmin = async (data) => {
  try {
    const res = await POST("/admin/login", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};