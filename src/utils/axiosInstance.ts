// utils/axiosInstance.ts
import axios from "axios";

const url = {
  production:
    "https://www.devifai.website/api/master/super/admin",
  development: "http://localhost:5000/api/master/super/admin",
};

const axiosInstance = axios.create({
  baseURL: url.production,
  headers: {
    "Content-Type": "application/json",
  },
  // You can add interceptors if needed (e.g., for auth tokens)
});

export default axiosInstance;
