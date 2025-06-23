import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "https://www.devifai.website/api/master/mechanic/consumptionsheet";

export const getAllConsumptionSheet = async (): Promise<[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};
