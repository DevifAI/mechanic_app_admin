import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "https://www.devifai.website/api/master/mechanic/diselreciept";

export const getAllDieselReceipt = async (): Promise<[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};
