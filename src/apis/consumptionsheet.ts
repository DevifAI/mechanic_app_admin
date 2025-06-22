import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "http://localhost:5000/api/master/mechanic/consumptionsheet";

export const getAllConsumptionSheet = async (): Promise<[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};
