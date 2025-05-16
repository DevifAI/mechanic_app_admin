// utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/master/super/admin", // Replace with your actual base URL
  headers: {
    "Content-Type": "application/json",
  },
  // You can add interceptors if needed (e.g., for auth tokens)
});

export default axiosInstance;
