import axiosInstance from "../utils/axiosInstance";

const BASE_PATH =
  "http://localhost:5000/api/master/mechanic/diselrequisition";

export const getAllDieselRequisitions = async (): Promise<[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};

export const getDieselRequisitionById = async (id: string): Promise<any> => {
  const res = await axiosInstance.get(`${BASE_PATH}/${id}`);
  return res.data;
};
