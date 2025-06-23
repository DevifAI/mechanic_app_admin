import axiosInstance from "../utils/axiosInstance";

const BASE_PATH =
  "https://www.devifai.website/api/master/mechanic/diselrequisition";

export const getAllDieselRequisitions = async (): Promise<[]> => {
  const res = await axiosInstance.get(`${BASE_PATH}`);
  return res.data;
};

export const getDieselRequisitionById = async (id: string): Promise<any> => {
  const res = await axiosInstance.get(`${BASE_PATH}/${id}`);
  return res.data;
};
