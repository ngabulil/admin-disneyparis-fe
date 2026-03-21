import { GET, POST, PUT, DELETE } from "./api";

export const getLocations = async () => {
  try {
    const res = await GET("/location");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createLocation = async (data) => {
  try {
    const res = await POST("/location", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateLocation = async (id, data) => {
  try {
    const res = await PUT(`/location/${id}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteLocation = async (id) => {
  try {
    const res = await DELETE(`/location/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAirportLocations = async () => {
  try {
    const res = await GET("/location");
    const airports = res.data.data.filter(
      (loc) => loc.locationType === "airport"
    );
    

    return airports;
  } catch (error) {
    throw error.response?.data || error;
  }
};
