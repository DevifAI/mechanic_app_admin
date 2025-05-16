import { Customer } from "../types/customerTypes";
import axiosInstance from "../utils/axiosInstance";

export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const res = await axiosInstance.get("/partner/getall");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch customers", error);
    throw error;
  }
};
