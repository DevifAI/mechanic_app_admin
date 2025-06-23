// utils/axiosInstance.ts
import axios from "axios";

const isProduction = true; // Change this to false for development

const url = {
  production: "https://www.devifai.website/api/master/super/admin",
  development: "https://www.devifai.website/api/master/super/admin",
};

const axiosInstance = axios.create({
  baseURL: isProduction ? url.production : url.development,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
