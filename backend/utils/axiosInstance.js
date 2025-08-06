// src/utils/axiosInstance.js
import axios from "axios";

const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default createAxiosInstance;
