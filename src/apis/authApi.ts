import axiosInstance from "../utils/axiosInstance";

// const BASE_PATH = "/admin";

export interface AdminLoginPayload {
  admin_id: string;
  password: string;
}

export interface AdminLoginResponse {
  message: string;
  token: string;
  admin: {
    id: string;
    admin_id: string;
    name: string;
    email: string;
  };
}

export const adminLogin = async (
  payload: AdminLoginPayload
): Promise<AdminLoginResponse> => {
  const res = await axiosInstance.post(`/login`, payload);
  return res.data;
};
