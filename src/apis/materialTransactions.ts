import axiosInstance from "../utils/axiosInstance";

const BASE_PATH =
  "https://www.devifai.website/api/master/store_manager/get/transactions";

export const getAllMaterialTransactions = async (): Promise<[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};
