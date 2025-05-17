import { Project, ProjectPayload } from "../types/projectsTypes";
import axiosInstance from "../utils/axiosInstance";

// Fetch all projects
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const res = await axiosInstance.get("/project/getall");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch projects", error);
    throw error;
  }
};

// Create a new project
export const createProject = async (
  payload: ProjectPayload
): Promise<Project> => {
  try {
    const res = await axiosInstance.post("/project/create", payload);
    return res.data;
  } catch (error) {
    console.error("Failed to create project", error);
    throw error;
  }
};
