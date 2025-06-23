import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "https://www.devifai.website/api/master/site_incharge/get-all-dpr";

export const getAllDPR = async (): Promise<[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};
