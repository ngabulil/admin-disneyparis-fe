import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ambil token dari cookie
 */
const getToken = () => Cookies.get("token");

/**
 * config request
 */
const createConfig = (config = {}) => {
  const token = getToken();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
};

/**
 * GET
 */
export const GET = (url, config = {}) => {
  return api.get(url, createConfig(config));
};

/**
 * POST
 */
export const POST = (url, data = {}, config = {}) => {
  return api.post(url, data, createConfig(config));
};

/**
 * PUT
 */
export const PUT = (url, data = {}, config = {}) => {
  return api.put(url, data, createConfig(config));
};

/**
 * DELETE
 */
export const DELETE = (url, config = {}) => {
  return api.delete(url, createConfig(config));
};