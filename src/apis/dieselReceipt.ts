import axiosInstance from "../utils/axiosInstance";

const BASE_PATH = "http://localhost:5000/api/master/mechanic/diselreciept";

export const getAllDieselReceipt = async (): Promise<[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};
