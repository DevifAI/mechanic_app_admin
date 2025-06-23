import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "https://www.devifai.website/api/master/mechanic/maintenancesheet";

export const getAllMaintenanceSheet = async (): Promise<[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};
