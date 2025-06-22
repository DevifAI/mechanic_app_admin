import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "http://localhost:5000/api/master/site_incharge/get-all-dpr";

export const getAllDPR = async (): Promise<[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};
